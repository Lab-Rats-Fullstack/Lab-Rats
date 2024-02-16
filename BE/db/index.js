const { Client } = require('pg') // imports the pg module

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/lab-rats-dev',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

/**
 * USERS Methods
 */

// CREATES USER IN DB
async function createUser({ 
    email,
    password,
    username,
    name,
    imgUrl,
    admin
}) {

  if (admin == null){
    admin = false;
  }

  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(email, password, username, name, imgUrl, admin) 
      VALUES($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [email, password, username, name, imgUrl, admin]);

    return user;
  } catch (error) {
    throw error;
  }
}

// EDITS USER IN DB
async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

// GETS ALL USERS IN DB
async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin, reviewCount
      FROM users;
    `);
  
    return rows;
  } catch (error) {
    throw error;
  }
}


// GET USER BY ID IN DB
async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin, reviewCount
      FROM users
      WHERE id=${ userId }
    `);

    if (!user) {
      throw {
        name: "UserNotFoundError",
        message: "A user with that id does not exist"
      }
    }

    user.recipes = await getRecipesByUser(userId); 
    user.reviews = await getReviewsByUser(userId); 
    user.comments = await getCommentsByUser(userId); 

    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * RECIPES Methods
 */

//UTIL ARRAYIFYSTRING (FOR DB EXPORT)
function arrayifyString(string){
  if (string == '' || string == null){
    return [];
  } else {
    return string.split("/n");
  }

}

// GET RECIPE BY ID IN DB
async function getRecipeById(recipeId) {
    try {
      const { rows: [ recipe ]  } = await client.query(`
        SELECT *
        FROM recipes
        WHERE id=$1;
      `, [recipeId]);
  
      if (!recipe) {
        throw {
          name: "RecipeNotFoundError",
          message: "Could not find a recipe with that recipeId"
        };
      }
 
      recipe.ingredients = arrayifyString(recipe.ingredients);
      recipe.procedure = arrayifyString(recipe.procedure);
      recipe.notes = arrayifyString(recipe.notes);
  
      const { rows: tags } = await client.query(`
        SELECT tags.*
        FROM tags
        JOIN recipe_tags ON tags.id=recipe_tags.tagId
        WHERE recipe_tags.recipeId=$1;
      `, [recipeId])

      const reviews = await getReviewsByRecipe(recipeId);
  
      const { rows: [user] } = await client.query(`
        SELECT id, email, username, name, imgUrl, admin
        FROM users
        WHERE id=$1;
      `, [recipe.userid])

      const recipeObject = {
        recipeInfo: recipe,
        tags: tags,
        reviews: reviews,
        user: user
      }
  
      return recipeObject;
    } catch (error) {
      throw error;
    }
}



// GET RECIPES BY USER IN DB
async function getRecipesByUser(userId) {
    try {
      const { rows: recipeIds } = await client.query(`
        SELECT id 
        FROM recipes
        WHERE userId=${ userId };
      `);
  
      const recipes = await Promise.all(recipeIds.map(
        recipe => getRecipeById( recipe.id )
      ));
  
      return recipes;
    } catch (error) {
      throw error;
    }
  }

// GET RECIPES BY TAG NAME IN DB
async function getRecipesByTagName(tagName) {
  try {
    const { rows: recipeIds } = await client.query(`
      SELECT recipes.id
      FROM recipes
      JOIN recipe_tags ON recipes.id=recipe_tags.recipeId
      JOIN tags ON tags.id=recipe_tags.tagId
      WHERE tags.name=$1;
    `, [tagName]);
    
    return await Promise.all(recipeIds.map(
      recipe => getRecipeById(recipe.id)
    ));
  } catch (error) {
    throw error;
  }
} 

// GET ALL RECIPES IN DB
async function getAllRecipes() {
  try {
    const { rows: recipeIds } = await client.query(`
      SELECT id
      FROM recipes;
    `);

    const recipes = await Promise.all(recipeIds.map(
      recipe => getRecipeById( recipe.id )
    ));

    return recipes;
  } catch (error) {
    throw error;
  }
}

//UTIL STRINGIFY ARRAY (FOR DB)
function stringifyArray(array){
  if (!array.length){
    return '';
  } else {
    return array.reduce((acc, item) => {
      return acc.concat("/n", item);
    });
  }
}

// CREATE RECIPE IN DB
async function createRecipe({
  userId,
  title,
  ingredients,
  procedure,
  imgUrl,
  notes,
  tags = []
}) {
  try {

    const ingredientsString = stringifyArray(ingredients);
    const procedureString = stringifyArray(procedure);
    let notesString;
    if (!notes.length || notes == null){
      notesString = '';
    } else {
      notesString = stringifyArray(notes);
    }
    

    const { rows: [ recipe ] } = await client.query(`
      INSERT INTO recipes(userId, title, ingredients, procedure, imgUrl, notes) 
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [userId, title, ingredientsString, procedureString, imgUrl, notesString]);

    const tagList = await createTags(tags); 

    await addTagsToRecipe(recipe.id, tagList); 

    return recipe;
  } catch (error) {
    throw error;
  }
}

// EDIT RECIPE IN DB
async function updateRecipe(recipeId, fields = {}) {
  // read off the tags & remove that field 
  const { tags } = fields; // might be undefined
  delete fields.tags;

  if (fields.ingredients){
    fields.ingredients = stringifyArray(fields.ingredients);
  }

  if (fields.procedure){
    fields.procedure = stringifyArray(fields.procedure);
  }

  if (fields.notes && fields.notes.length){
    fields.notes = stringifyArray(fields.notes);
  } else if (fields.notes && !fields.notes.length){
    fields.notes = '';
  }


  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const { rows: [recipe] } = await client.query(`
        UPDATE recipes
        SET ${ setString }
        WHERE id=${ recipeId }
        RETURNING *;
      `, Object.values(fields));
      
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return (await getRecipeById(recipeId))?.recipeInfo;
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags); 
    const tagListIdString = tagList.map(
      tag => `${ tag.id }`
    ).join(', ');

    // delete any recipe_tags from the database which aren't in that tagList
    await client.query(`
      DELETE FROM recipe_tags
      WHERE tagId
      NOT IN (${ tagListIdString })
      AND recipeId=$1;
    `, [recipeId]);
    
    // and create post_tags as necessary
    await addTagsToRecipe(recipeId, tagList); 

    return (await getRecipeById(recipeId))?.recipeInfo;
  } catch (error) {
    throw error;
  }
}

/**
 * TAGS Methods
 */

// GETS ALL TAGS FROM DB
async function getAllTags() {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM tags;
    `);

    return { rows }
  } catch (error) {
    throw error;
  }
}

// CREATE TAGS IN DB
async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  const valuesStringInsert = tagList.map(
    (_, index) => `$${index + 1}`
  ).join('), (');

  const valuesStringSelect = tagList.map(
    (_, index) => `$${index + 1}`
  ).join(', ');

  try {
    // insert all, ignoring duplicates
    await client.query(`
      INSERT INTO tags(name)
      VALUES (${ valuesStringInsert })
      ON CONFLICT (name) DO NOTHING;
    `, tagList);

    // grab all and return
    const { rows } = await client.query(`
      SELECT * FROM tags
      WHERE name
      IN (${ valuesStringSelect });
    `, tagList);

    return rows;
  } catch (error) {
    throw error;
  }
}

// CREATE ALL RECIPE_TAGS NECESSARY
async function addTagsToRecipe(recipeId, tagList) {
  if (!tagList) {
    return await getRecipeById(recipeId);
  }

  try {
    const createRecipeTagPromises = tagList.map(
      tag => createRecipeTag(recipeId, tag.id)
    );

    await Promise.all(createRecipeTagPromises);

    return await getRecipeById(recipeId);
  } catch (error) {
    throw error;
  }
}

/**
 * RECIPE_TAGS Methods
 */

// CREATE RECIPE_TAG IN JUNCTION TABLE FROM DB
async function createRecipeTag(recipeId, tagId) {
  try {
    await client.query(`
      INSERT INTO recipe_tags(recipeId, tagId)
      VALUES ($1, $2)
      ON CONFLICT (recipeId, tagId) DO NOTHING;
    `, [ recipeId, tagId ]);
  } catch (error) {
    throw error;
  }
}

/**
 * REVIEWS Methods
 */
// GET REVIEW BY ID IN DB
async function getReviewById(reviewId){
    try{
        const {rows: [review]} = await client.query(`
        SELECT *
        FROM reviews
        WHERE id = ${reviewId};
        `);

        if (!review) {
            throw {
              name: "ReviewNotFoundError",
              message: "Could not find a review with that reviewId"
            };
          }

        const comments = await getCommentsByReview(reviewId);

        const { rows: [user] } = await client.query(`
        SELECT id, email, username, name, imgUrl, admin
        FROM users
        WHERE id=$1;
      `, [review.userid]);

        const reviewObject = {
          reviewInfo: review,
          comments: comments,
          user: user
        }

        return reviewObject;
    } catch (error){
        throw error;
    }
}

// GET REVIEWS BY USER IN DB
async function getReviewsByUser(userId) {
    try {
      const { rows: reviewIds } = await client.query(`
        SELECT id 
        FROM reviews
        WHERE userId=${ userId };
      `);
  
      const reviews = await Promise.all(reviewIds.map(
        review => getReviewById( review.id )
      ));
  
      return reviews;
    } catch (error) {
      throw error;
    }
  }

// GET REVIEWS BY RECIPE IN DB
async function getReviewsByRecipe(recipeId) {
    try {
      const { rows: reviewIds } = await client.query(`
        SELECT id 
        FROM reviews
        WHERE userId=${ recipeId };
      `);
  
      const reviews = await Promise.all(reviewIds.map(
        review => getReviewById( review.id )
      ));
  
      return reviews;
    } catch (error) {
      throw error;
    }
  }

// GET ALL REVIEWS IN DB
async function getAllReviews() {
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id
      FROM reviews;
    `);

    const reviews = await Promise.all(reviewIds.map(
      review => getReviewById( review.id )
    ));

    return reviews;
  } catch (error) {
    throw error;
  }
}

// CREATE REVIEW IN DB
async function createReview({
  userId,
  recipeId,
  content,
  rating
}) {
  try {
    const { rows: [ review ] } = await client.query(`
      INSERT INTO reviews(userId, recipeId, content, rating) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [userId, recipeId, content, rating]);

  return review;

  } catch (error) {
    throw error;
  }
}

// EDIT REVIEW IN DB
async function updateReview(reviewId, fields = {}) {

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const {rows: [review]} = await client.query(`
        UPDATE reviews
        SET ${ setString }
        WHERE id=${ reviewId }
        RETURNING *;
      `, Object.values(fields));

      return review;
    } else {
      return (await getReviewById(reviewId))?.reviewInfo;
    }


  } catch (error) {
    throw error;
  }
}


/**
 * COMMENTS Methods
 */

// GET COMMENT BY ID IN DB
async function getCommentById(commentId){
    try{
        const { rows: [comment] } = await client.query(`
        SELECT *
        FROM comments
        WHERE id=$1;
    `, [commentId])

        const { rows: [user] } = await client.query(`
        SELECT id, email, username, name, imgUrl, admin
        FROM users
        WHERE id=$1;
      `, [comment.userid]);

      const commentObject = {
        commentInfo: comment,
        user: user
      }

        return commentObject;
    } catch (error) {
        throw error;
      }
}


// GET COMMENTS BY REVIEW IN DB
async function getCommentsByReview(reviewId){
    try{
        const { rows: commentIds } = await client.query(`
        SELECT id
        FROM comments
        WHERE reviewId=$1;
    `, [reviewId])

        const comments = await Promise.all(commentIds.map(
        comment => getCommentById( comment.id )
        ));

        return comments;
    } catch (error) {
        throw error;
      }
}
   
// GET COMMENTS BY USER IN DB
async function getCommentsByUser(userId) {
    try{
        const { rows: commentIds } = await client.query(`
        SELECT id
        FROM comments
        WHERE userId=$1;
    `, [userId])

        const comments = await Promise.all(commentIds.map(
        comment => getCommentById( comment.id )
        ));

        return comments;
    } catch (error) {
        throw error;
      }
  }

// GET ALL COMMENTS IN DB
async function getAllComments() {
  try {
    const { rows: commentIds } = await client.query(`
      SELECT id
      FROM comments;
    `);

    const comments = await Promise.all(commentIds.map(
      comment => getCommentById( comment.id )
    ));

    return comments;
  } catch (error) {
    throw error;
  }
}

// CREATE COMMENT IN DB
async function createComment({
  userId,
  reviewId,
  content
}) {
  try {
    const { rows: [ comment ] } = await client.query(`
      INSERT INTO comments(userId, reviewId, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `, [userId, reviewId, content]);

    return comment;

  } catch (error) {
    throw error;
  }
}

// EDIT COMMENT IN DB
async function updateComment(commentId, fields = {}) {

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const { rows: [ comment ] }  = await client.query(`
        UPDATE comments
        SET ${ setString }
        WHERE id=${ commentId }
        RETURNING *;
      `, Object.values(fields));

      return comment;
    } else {
      return (await getCommentById(commentId))?.commentInfo;
    }

  } catch (error) {
    throw error;
  }
}

module.exports = {  
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createRecipe,
  updateRecipe, 
  getAllRecipes, 
  getRecipesByTagName, 
  getAllTags, 
  createReview, 
  updateReview, 
  getAllReviews, 
  createComment, 
  updateComment, 
  getAllComments 
}
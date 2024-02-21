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
    const { userInfo } = await client.query(`
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
    const user = await getUserInfoById(userId);

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

// GET USER INFO BY ID IN DB
async function getUserInfoById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin, reviewCount
      FROM users
      WHERE id=${ userId }
    `);

    return user;
  } catch (error) {
    throw error;
  }
}

// GET USER INFO WITH PASSWORD BY ID IN DB
async function getUserInfoWithPasswordById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${ userId }
    `);

    return user;
  } catch (error) {
    throw error;
  }
}

// GET USER INFO BY RECIPE ID IN DB
/*async function getUserInfoByRecipe(recipeId) {
  try {
    const { rows: [ recipe ]  } = await client.query(`
    SELECT userId
    FROM recipes
    WHERE id=$1;
  `, [recipeId]);

    return await getUserInfoById(recipe.userid);
  } catch (error){
    throw (error);
  }
}*/

/**
 * RECIPES Methods
 */


// GET RECIPE INFO BY ID IN DB
async function getRecipeInfoById(recipeId) {
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

    return recipe;
  } catch (error) {
    throw (error);
  }
}

// GET RECIPE INFO BY REVIEW ID IN DB
/*async function getRecipeInfoByReview(reviewId) {
  try {
    const { rows: [ recipe ]  } = await client.query(`
    SELECT recipeId
    FROM reviews
    WHERE id=$1;
  `, [reviewId]);

    return await getRecipeInfoById(recipe.recipeid);
  } catch (error){
    throw (error);
  }
}*/

// GET RECIPE BY ID IN DB
async function getRecipeById(recipeId) {
    try {
      const recipe = await getRecipeInfoById(recipeId);
  
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
        ...recipe,
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

  //GET USER PAGE RECIPE BY ID
async function getUserPageRecipeById(recipeId){
  try {
    const recipeInfo = await getRecipeInfoById(recipeId);
    const userInfo = await getUserInfoById(recipeInfo.userid);

    const recipeObject = {
      ...recipeInfo,
      user: userInfo
    }
  
    return recipeObject;
  } catch (error) {
    throw (error);
  }

}

//GET USER PAGE RECIPES BY USER
async function getUserPageRecipesByUser(userId){
  try {
    const { rows: recipeIds } = await client.query(`
      SELECT id 
      FROM recipes
      WHERE userId=${ userId };
    `);

    const recipes = await Promise.all(recipeIds.map(
      recipe => getUserPageRecipeById( recipe.id )
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

// GET ALL RECIPES PAGE
async function getAllRecipesPage(){
  try {
    const { rows: recipeIds } = await client.query(`
    SELECT id
    FROM recipes;
  `);

  const recipes = await Promise.all(recipeIds.map(
    recipe => getUserPageRecipeById( recipe.id )
  ));
  }
}


// CREATE RECIPE IN DB
async function createRecipe({
  userId,
  title,
  ingredients,
  procedure,
  imgUrl,
  notes = [],
  tags = []
}) {
  try {

    const { rows: [ recipe ] } = await client.query(`
      INSERT INTO recipes(userId, title, ingredients, procedure, imgUrl, notes) 
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [userId, title, ingredients, procedure, imgUrl, notes]);

    const tagList = await createTags(tags); 

    await addTagsToRecipe(recipe.id, tagList); 

    return getRecipeById(recipe.id);
  } catch (error) {
    throw error;
  }
}

// EDIT RECIPE IN DB
async function updateRecipe(recipeId, fields = {}) {
  // read off the tags & remove that field 
  const { tags } = fields; // might be undefined
  delete fields.tags;

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
      return await getRecipeById(recipeId);
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
    
    // and create recipe_tags as necessary
    await addTagsToRecipe(recipeId, tagList); 

    return await getRecipeById(recipeId);
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

//GET REVIEW INFO BY ID IN DB
async function getReviewInfoById(reviewId){
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
    return review;
  } catch (error){
    throw (error);
  }
}

// GET REVIEW INFO BY COMMENT ID IN DB
/*async function getReviewInfoByComment(commentId) {
  try {
    const { rows: [ review ]  } = await client.query(`
    SELECT reviewId
    FROM comments
    WHERE id=$1;
  `, [commentId]);

    return getReviewInfoById(review.reviewid)
  } catch (error){
    throw (error);
  }
}*/

//GET USER PAGE REVIEW BY ID
async function getUserPageReviewById(reviewId){
  try {
    const reviewInfo = await getReviewInfoById(reviewId);
    const userInfo = await getUserInfoById(reviewInfo.userid);
    const recipeInfo = await getRecipeInfoById(reviewInfo.recipeId);
    const reviewObject = {
      ...reviewInfo,
      user: userInfo,
      recipe: recipeInfo
    }
  
    return reviewObject;
  } catch (error) {
    throw (error);
  }

}

//GET USER PAGE REVIEWS BY USER
async function getUserPageReviewsByUser(userId){
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id 
      FROM reviews
      WHERE userId=${ userId };
    `);

    const reviews = await Promise.all(reviewIds.map(
      review => getUserPageReviewById( review.id )
    ));

    return reviews;
  } catch (error) {
    throw error;
  }

}

// GET REVIEW BY ID IN DB
async function getReviewById(reviewId){
    try{
        const review = await getReviewInfoById(reviewId);

        const comments = await getCommentsByReview(reviewId);

        const { rows: [user] } = await client.query(`
        SELECT id, email, username, name, imgUrl, admin
        FROM users
        WHERE id=$1;
      `, [review.userid]);

        const reviewObject = {
          ...review,
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

    await client.query(`
      UPDATE users
      SET reviewCount = reviewCount + 1
      WHERE id=${ userId };
    `)

  return await getReviewById(review.id);

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
    } 
      return await getReviewById(reviewId);

  } catch (error) {
    throw error;
  }
}


/**
 * COMMENTS Methods
 */

// GET COMMENT INFO BY ID IN DB
async function getCommentInfoById(commentId){
  try{
      const { rows: [comment] } = await client.query(`
      SELECT *
      FROM comments
      WHERE id=$1;
  `, [commentId])

    return comment;
  } catch (error){
    throw (error);
  }
}

//GET USER PAGE COMMENT BY ID
async function getUserPageCommentById(commentId){
  try {
    const commentInfo = await getCommentInfoById(commentId);
    const userInfo = await getUserInfoById(commentInfo.userid);
    const reviewInfo = await getReviewInfoById(commentInfo.reviewId);
    const recipeInfo = await getRecipeInfoById(reviewInfo.recipeid);
    const commentObject = {
      ...commentInfo,
      user: userInfo,
      review: reviewInfo,
      recipe: recipeInfo
    }
  
    return commentObject;
  } catch (error) {
    throw (error);
  }

}

//GET USER PAGE COMMENTS BY USER
async function getUserPageCommentsByUser(userId){
  try {
    const { rows: commentIds } = await client.query(`
      SELECT id 
      FROM comments
      WHERE userId=${ userId };
    `);

    const comments = await Promise.all(commentIds.map(
      comment => getUserPageCommentById( comment.id )
    ));

    return comments;
  } catch (error) {
    throw error;
  }

}

// GET COMMENT BY ID IN DB
async function getCommentById(commentId){
    try{
      const comment = await getCommentInfoById(commentId);

      const { rows: [user] } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin
      FROM users
      WHERE id=$1;
    `, [comment.userid]);

    const commentObject = {
      ...comment,
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

    return await getCommentById(comment.id);

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
    } 
      return await getCommentById(commentId);

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
  getUserInfoById,
  getUserInfoWithPasswordById,
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
  getAllComments,
  getUserPageCommentsByUser,
  getUserPageReviewsByUser,
  getUserPageRecipesByUser
}
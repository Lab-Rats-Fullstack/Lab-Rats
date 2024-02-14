const { Client } = require('pg') // imports the pg module

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/recipes-dev',
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
      `, [recipe.userId])
  
      recipe.tags = tags;
      recipe.reviews = reviews;
        recipe.user = user;
  
      return recipe;
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

// CREATE RECIPE IN DB
async function createRecipe({
  userId,
  title,
  ingredients,
  content,
  imgUrl,
  tags = []
}) {
  try {
    const { rows: [ recipe ] } = await client.query(`
      INSERT INTO recipes(user, title, ingredients, content, imgUrl) 
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `, [userId, title, ingredients, content, imgUrl]);

    const tagList = await createTags(tags); 

    return await addTagsToRecipe(recipe.id, tagList); 
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
      await client.query(`
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
    
    // and create post_tags as necessary
    await addTagsToRecipe(recipeId, tagList); 

    return await getRecipeById(recipeId);
  } catch (error) {
    throw error;
  }
}

/**
 * TAGS Methods
 */

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
      tag => createRecipeTag(postId, tag.id)
    );

    await Promise.all(createRecipeTagPromises);

    return await getRecipeById(postId);
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
        const {rows: review} = await client.query(`
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
      `, [review.userId]);

        review.comments = comments;
        review.user = user;

        return review;
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

/**
 * COMMENTS Methods
 */

// GET COMMENT BY ID IN DB
async function getCommentById(commentId){
    try{
        const { rows: comment } = await client.query(`
        SELECT *
        FROM comments
        WHERE id=$1;
    `, [commentId])

        const { rows: [user] } = await client.query(`
        SELECT id, email, username, name, imgUrl, admin
        FROM users
        WHERE id=$1;
      `, [comment.userId]);

        comment.user = user;

        return comment;
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
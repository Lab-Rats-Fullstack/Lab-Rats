const { Client } = require("pg"); // imports the pg module

const client = new Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/lab-rats-dev",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

/**
 * USERS Methods
 */

// CREATES USER IN DB
async function createUser({ email, password, username, name, imgUrl, admin }) {
  if (admin == null) {
    admin = false;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(email, password, username, name, imgUrl, admin) 
      VALUES($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [email, password, username, name, imgUrl, admin]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

// EDITS USER IN DB
async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING id, email, username, name, imgurl, admin, reviewCount;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function destroyUserById(userId) {
  try {
    const destroyedUser = await getUserById(userId);

    const { rows: commentIds } = await client.query(
      `
        SELECT id
        FROM comments
        WHERE userId=$1;
    `,
      [userId]
    );

    if (commentIds.length > 0) {
      await Promise.all(
        commentIds.map((comment) => {
          return destroyCommentById(comment.id);
        })
      );
    }

    const { rows: reviewIds } = await client.query(
      `
        SELECT id
        FROM reviews
        WHERE userId=$1;
    `,
      [userId]
    );

    if (reviewIds.length > 0) {
      await Promise.all(
        reviewIds.map((review) => {
          return destroyReviewById(review.id);
        })
      );
    }

    const { rows: recipeIds } = await client.query(
      `
        SELECT id
        FROM recipes
        WHERE userId=$1;
    `,
      [userId]
    );

    if (recipeIds.length > 0) {
      await Promise.all(
        recipeIds.map((recipe) => {
          return destroyRecipeById(recipe.id);
        })
      );
    }

    await client.query(
      `
        DELETE FROM users
        WHERE id = $1
    `,
      [userId]
    );

    return destroyedUser;
  } catch (error) {
    throw error;
  }
}

// GETS ALL USERS IN DB
async function getAllUsers() {
  try {
    const { rows: userInfo } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin, reviewCount
      FROM users;
    `);

    return userInfo;
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
        message: "A user with that id does not exist",
      };
    }

    user.recipes = await getRecipesByUser(userId);
    user.reviews = await getReviewsByUser(userId);
    user.comments = await getCommentsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

// GET USER BY USERNAME IN DB
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

// GET USER INFO BY ID IN DB
async function getUserInfoById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, email, username, name, imgUrl, admin, reviewCount
      FROM users
      WHERE id=${userId}
    `);

    return user;
  } catch (error) {
    throw error;
  }
}

// GET USER INFO WITH PASSWORD BY ID IN DB
async function getUserInfoWithPasswordById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${userId}
    `);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserPageById(userId) {
  try {
    const userInfo = await getUserInfoById(userId);
    const recipes = await getUserPageRecipesByUser(userId);
    const reviews = await getUserPageReviewsByUser(userId);
    const comments = await getUserPageCommentsByUser(userId);

    const userObject = {
      ...userInfo,
      recipes: recipes,
      reviews: reviews,
      comments: comments,
    };

    return userObject;
  } catch (error) {
    throw error;
  }
}

async function getPublicUserPageById(userId) {
  try {
    const {
      rows: [userInfo],
    } = await client.query(`
      SELECT id, username, imgUrl, admin, reviewCount
      FROM users
      WHERE id=${userId}
    `);
    const recipes = await getUserPageRecipesByUser(userId);
    const reviews = await getUserPageReviewsByUser(userId);
    const comments = await getUserPageCommentsByUser(userId);

    const userObject = {
      ...userInfo,
      recipes: recipes,
      reviews: reviews,
      comments: comments,
    };

    return userObject;
  } catch (error) {
    throw error;
  }
}

/**
 * RECIPES Methods
 */

// GET RECIPE INFO BY ID IN DB
async function getRecipeInfoById(recipeId) {
  try {
    const {
      rows: [recipe],
    } = await client.query(
      `
      SELECT *
      FROM recipes
      WHERE id=$1;
    `,
      [recipeId]
    );

    if (!recipe) {
      throw {
        name: "RecipeNotFoundError",
        message: "Could not find a recipe with that recipeId",
      };
    }

    return recipe;
  } catch (error) {
    throw error;
  }
}

// GET RECIPE BY ID IN DB
async function getRecipeById(recipeId) {
  try {
    const recipe = await getRecipeInfoById(recipeId);

    const { rows: tags } = await client.query(
      `
        SELECT tags.*
        FROM tags
        JOIN recipe_tags ON tags.id=recipe_tags.tagId
        WHERE recipe_tags.recipeId=$1;
      `,
      [recipeId]
    );

    const reviews = await getReviewsByRecipe(recipeId);

    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username, imgUrl, admin, reviewCount
        FROM users
        WHERE id=$1;
      `,
      [recipe.userid]
    );

    const avgRating = await getAverageRating(recipeId);

    const recipeObject = {
      ...recipe,
      tags: tags,
      reviews: reviews,
      user: user,
      avgRating: avgRating,
    };

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
        WHERE userId=${userId};
      `);

    const recipes = await Promise.all(
      recipeIds.map((recipe) => getRecipeById(recipe.id))
    );

    return recipes;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE RECIPE BY ID
async function getUserPageRecipeById(recipeId) {
  try {
    const {
      rows: [recipeInfo],
    } = await client.query(
      `
      SELECT id, title, imgUrl, esttime
      FROM recipes
      WHERE id=$1;
    `,
      [recipeId]
    );

    const { rows: tags } = await client.query(
      `
    SELECT tags.*
    FROM tags
    JOIN recipe_tags ON tags.id=recipe_tags.tagId
    WHERE recipe_tags.recipeId=$1;
  `,
      [recipeId]
    );

    const avgRating = await getAverageRating(recipeId);

    const recipeObject = {
      ...recipeInfo,
      tags: tags,
      avgRating: avgRating,
    };

    return recipeObject;
  } catch (error) {
    throw error;
  }
}

//GET OTHER PAGE RECIPE BY ID
async function getOtherPageRecipeById(recipeId) {
  try {
    const {
      rows: [recipeInfo],
    } = await client.query(
      `
      SELECT id, userId, title, imgUrl, esttime
      FROM recipes
      WHERE id=$1;
    `,
      [recipeId]
    );

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN recipe_tags ON tags.id=recipe_tags.tagId
      WHERE recipe_tags.recipeId=$1;
    `,
      [recipeId]
    );

    const {
      rows: [userInfo],
    } = await client.query(
      `
        SELECT id, username, imgUrl
        FROM users
        WHERE id = $1;
      `,
      [recipeInfo.userid]
    );

    const avgRating = await getAverageRating(recipeId);

    const recipeObject = {
      ...recipeInfo,
      tags: tags,
      user: userInfo,
      avgRating: avgRating,
    };

    return recipeObject;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE RECIPES BY USER
async function getUserPageRecipesByUser(userId) {
  try {
    const { rows: recipeIds } = await client.query(`
      SELECT id 
      FROM recipes
      WHERE userId=${userId};
    `);

    const recipes = await Promise.all(
      recipeIds.map((recipe) => getUserPageRecipeById(recipe.id))
    );

    return recipes;
  } catch (error) {
    throw error;
  }
}

// GET RECIPES BY TAG NAME IN DB
async function getRecipesByTagName(tagName) {
  try {
    const { rows: recipeIds } = await client.query(
      `
      SELECT recipes.id
      FROM recipes
      JOIN recipe_tags ON recipes.id=recipe_tags.recipeId
      JOIN tags ON tags.id=recipe_tags.tagId
      WHERE tags.name=$1;
    `,
      [tagName]
    );

    return await Promise.all(
      recipeIds.map((recipe) => getOtherPageRecipeById(recipe.id))
    );
  } catch (error) {
    throw error;
  }
}

// GET USER RECIPES BY TAG NAME IN DB
async function getUserRecipesByTagName(userId, tagName) {
  try {
    const { rows: recipeIds } = await client.query(
      `
      SELECT recipes.id
      FROM recipes
      JOIN users ON users.id=recipes.userId
      JOIN recipe_tags ON recipes.id=recipe_tags.recipeId
      JOIN tags ON tags.id=recipe_tags.tagId
      WHERE tags.name=$1 AND users.id=$2;
    `,
      [tagName, userId]
    );

    return await Promise.all(
      recipeIds.map((recipe) => getUserPageRecipeById(recipe.id))
    );
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

    const recipes = await Promise.all(
      recipeIds.map((recipe) => getRecipeById(recipe.id))
    );

    return recipes;
  } catch (error) {
    throw error;
  }
}

// GET ALL RECIPES PAGE
async function getAllRecipesPage() {
  try {
    const { rows: recipeIds } = await client.query(`
    SELECT id
    FROM recipes;
  `);

    const recipes = await Promise.all(
      recipeIds.map((recipe) => getOtherPageRecipeById(recipe.id))
    );

    return recipes;
  } catch (error) {
    throw error;
  }
}

async function getReviewedRecipesPage() {
  try {
    const { rows: reviews } = await client.query(`
    SELECT DISTINCT recipeId
    FROM reviews;
    `);

    const reviewedRecipes = await Promise.all(
      reviews.map((review) => {
        return getOtherPageRecipeById(review.recipeid);
      })
    );

    return reviewedRecipes;
  } catch (error) {
    throw error;
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
  tags = [],
  esttime = "",
}) {
  try {
    const {
      rows: [recipe],
    } = await client.query(
      `
      INSERT INTO recipes(userId, title, ingredients, procedure, imgUrl, notes, esttime) 
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [userId, title, ingredients, procedure, imgUrl, notes, esttime]
    );

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
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const {
        rows: [recipe],
      } = await client.query(
        `
        UPDATE recipes
        SET ${setString}
        WHERE id=${recipeId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getRecipeById(recipeId);
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");

    // delete any recipe_tags from the database which aren't in that tagList
    await client.query(
      `
      DELETE FROM recipe_tags
      WHERE tagId
      NOT IN (${tagListIdString})
      AND recipeId=$1;
    `,
      [recipeId]
    );

    // and create recipe_tags as necessary
    await addTagsToRecipe(recipeId, tagList);

    await client.query(
      `
      DELETE FROM tags 
      WHERE NOT EXISTS (
        SELECT FROM recipe_tags 
        WHERE  recipe_tags.tagId = tags.id
        );
      `
    );

    return await getRecipeById(recipeId);
  } catch (error) {
    throw error;
  }
}

async function destroyRecipeById(recipeId) {
  try {
    const destroyedRecipe = await getRecipeById(recipeId);

    await client.query(
      `
        DELETE FROM recipe_tags
        WHERE recipeId=$1;
    `,
      [recipeId]
    );

    await client.query(
      `
      DELETE FROM tags 
      WHERE NOT EXISTS (
        SELECT FROM recipe_tags 
        WHERE  recipe_tags.tagId = tags.id
        );
      `
    );

    const { rows: reviewIds } = await client.query(
      `
        SELECT id
        FROM reviews
        WHERE recipeId=$1;
    `,
      [recipeId]
    );

    if (reviewIds.length > 0) {
      await Promise.all(
        reviewIds.map((review) => {
          return destroyReviewById(review.id);
        })
      );
    }

    await client.query(
      `
        DELETE FROM recipes
        WHERE id = $1
    `,
      [recipeId]
    );

    return destroyedRecipe;
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

    return { rows };
  } catch (error) {
    throw error;
  }
}

// GETS ALL TAGS BY USER
async function getTagsByUser(userId) {
  try {
    const { rows: tags } = await client.query(
      `
    SELECT tags.id, tags.name
    FROM tags
    JOIN recipe_tags ON recipe_tags.tagId=tags.id
    JOIN recipes ON recipes.id=recipe_tags.recipeId
    WHERE recipes.userId=$1;
    `,
      [userId]
    );

    return tags;
  } catch (error) {
    throw error;
  }
}

// CREATE TAGS IN DB
async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  const valuesStringInsert = tagList
    .map((_, index) => `$${index + 1}`)
    .join("), (");

  const valuesStringSelect = tagList
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  try {
    // insert all, ignoring duplicates
    await client.query(
      `
      INSERT INTO tags(name)
      VALUES (${valuesStringInsert})
      ON CONFLICT (name) DO NOTHING;
    `,
      tagList
    );

    // grab all and return
    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE name
      IN (${valuesStringSelect});
    `,
      tagList
    );

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
    const createRecipeTagPromises = tagList.map((tag) =>
      createRecipeTag(recipeId, tag.id)
    );

    await Promise.all(createRecipeTagPromises);

    return await getRecipeById(recipeId);
  } catch (error) {
    throw error;
  }
}

async function destroyTagById(tagId) {
  try {
    const destroyedTag = await client.query(
      `
      DELETE FROM tags
      WHERE id=$1
      RETURN *
    `,
      [tagId]
    );

    return destroyedTag;
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
    await client.query(
      `
      INSERT INTO recipe_tags(recipeId, tagId)
      VALUES ($1, $2)
      ON CONFLICT (recipeId, tagId) DO NOTHING;
    `,
      [recipeId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

/**
 * REVIEWS Methods
 */

async function getAverageRating(recipeId) {
  try {
    const { rows: ratings } = await client.query(
      `
      SELECT rating
      FROM reviews
      WHERE recipeId=$1;
    `,
      [recipeId]
    );

    let ratingsSum = 0;
    let avgRating;

    if (!ratings.length || ratings.length == 0) {
      avgRating = 0;
    } else {
      ratings.forEach((rating) => {
        ratingsSum = ratingsSum + rating.rating;
      });

      avgRating = Math.round((ratingsSum / ratings.length) * 10) / 10;
    }

    return avgRating;
  } catch (error) {
    throw error;
  }
}

//GET REVIEW INFO BY ID IN DB
async function getReviewInfoById(reviewId) {
  try {
    const {
      rows: [review],
    } = await client.query(`
    SELECT *
    FROM reviews
    WHERE id = ${reviewId};
    `);

    if (!review) {
      throw {
        name: "ReviewNotFoundError",
        message: "Could not find a review with that reviewId",
      };
    }
    return review;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE REVIEW BY ID
async function getUserPageReviewById(reviewId) {
  try {
    const {
      rows: [reviewInfo],
    } = await client.query(
      `
      SELECT id, recipeId, title, content, rating
      FROM reviews
      WHERE id=$1;
    `,
      [reviewId]
    );

    const {
      rows: [recipeInfo],
    } = await client.query(
      `
      SELECT id, userId, title, imgUrl, esttime
      FROM recipes
      WHERE id=$1;
    `,
      [reviewInfo.recipeid]
    );

    const {
      rows: [recipeUserInfo],
    } = await client.query(
      `
      SELECT id, username, imgUrl
      FROM users
      WHERE id=$1;
    `,
      [recipeInfo.userid]
    );

    const reviewObject = {
      ...reviewInfo,
      recipe: {
        ...recipeInfo,
        user: recipeUserInfo,
      },
    };

    return reviewObject;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE REVIEWS BY USER
async function getUserPageReviewsByUser(userId) {
  try {
    const { rows: reviewIds } = await client.query(`
      SELECT id 
      FROM reviews
      WHERE userId=${userId};
    `);

    const reviews = await Promise.all(
      reviewIds.map((review) => getUserPageReviewById(review.id))
    );

    return reviews;
  } catch (error) {
    throw error;
  }
}

// GET REVIEW BY ID IN DB
async function getReviewById(reviewId) {
  try {
    const review = await getReviewInfoById(reviewId);

    const comments = await getCommentsByReview(reviewId);

    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username, imgUrl, admin, reviewCount
        FROM users
        WHERE id=$1;
      `,
      [review.userid]
    );

    const reviewObject = {
      ...review,
      comments: comments,
      user: user,
    };

    return reviewObject;
  } catch (error) {
    throw error;
  }
}

// GET REVIEWS BY USER IN DB
async function getReviewsByUser(userId) {
  try {
    const { rows: reviewIds } = await client.query(`
        SELECT id 
        FROM reviews
        WHERE userId=${userId};
      `);

    const reviews = await Promise.all(
      reviewIds.map((review) => getReviewById(review.id))
    );

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
        WHERE recipeId=${recipeId};
      `);

    const reviews = await Promise.all(
      reviewIds.map((review) => getReviewById(review.id))
    );

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

    const reviews = await Promise.all(
      reviewIds.map((review) => getReviewById(review.id))
    );

    return reviews;
  } catch (error) {
    throw error;
  }
}

// CREATE REVIEW IN DB

async function createReview({ userId, recipeId, title, content, rating }) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
      INSERT INTO reviews(userId, recipeId, title, content, rating) 
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [userId, recipeId, title, content, rating]
    );

    await client.query(`
      UPDATE users
      SET reviewCount = reviewCount + 1
      WHERE id=${userId};
    `);

    return await getReviewById(review.id);
  } catch (error) {
    throw error;
  }
}

// EDIT REVIEW IN DB
async function updateReview(reviewId, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const {
        rows: [review],
      } = await client.query(
        `
        UPDATE reviews
        SET ${setString}
        WHERE id=${reviewId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getReviewById(reviewId);
  } catch (error) {
    throw error;
  }
}

async function destroyReviewById(reviewId) {
  try {
    const destroyedReview = await getReviewById(reviewId);

    const { rows: commentIds } = await client.query(
      `
        SELECT id
        FROM comments
        WHERE reviewId=$1;
    `,
      [reviewId]
    );

    if (commentIds.length > 0) {
      await Promise.all(
        commentIds.map((comment) => {
          return destroyCommentById(comment.id);
        })
      );
    }

    await client.query(
      `
      UPDATE users
      SET reviewCount = reviewCount - 1
      WHERE id=$1;
    `,
      [destroyedReview.userid]
    );

    await client.query(
      `
        DELETE FROM reviews
        WHERE id = $1
    `,
      [reviewId]
    );

    return destroyedReview;
  } catch (error) {
    throw error;
  }
}

/**
 * COMMENTS Methods
 */

// GET COMMENT INFO BY ID IN DB
async function getCommentInfoById(commentId) {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
      SELECT *
      FROM comments
      WHERE id=$1;
  `,
      [commentId]
    );

    return comment;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE COMMENT BY ID
async function getUserPageCommentById(commentId) {
  try {
    const {
      rows: [commentInfo],
    } = await client.query(
      `
      SELECT *
      FROM comments
      WHERE id=$1;
    `,
      [commentId]
    );

    const {
      rows: [reviewInfo],
    } = await client.query(
      `
      SELECT *
      FROM reviews
      WHERE id=$1;
    `,
      [commentInfo.reviewid]
    );

    const {
      rows: [reviewUserInfo],
    } = await client.query(
      `
      SELECT id, username, imgUrl
      FROM users
      WHERE id=$1;
    `,
      [reviewInfo.userid]
    );

    const {
      rows: [recipeInfo],
    } = await client.query(
      `
      SELECT id, userId, title, imgUrl, esttime
      FROM recipes
      WHERE id=$1;
    `,
      [reviewInfo.recipeid]
    );

    const {
      rows: [recipeUserInfo],
    } = await client.query(
      `
    SELECT id, username, imgUrl
    FROM users
    WHERE id=$1;
  `,
      [recipeInfo.userid]
    );

    const commentObject = {
      ...commentInfo,
      review: {
        ...reviewInfo,
        user: reviewUserInfo,
        recipe: {
          ...recipeInfo,
          user: recipeUserInfo,
        },
      },
    };

    return commentObject;
  } catch (error) {
    throw error;
  }
}

//GET USER PAGE COMMENTS BY USER
async function getUserPageCommentsByUser(userId) {
  try {
    const { rows: commentIds } = await client.query(`
      SELECT id 
      FROM comments
      WHERE userId=${userId};
    `);

    const comments = await Promise.all(
      commentIds.map((comment) => getUserPageCommentById(comment.id))
    );

    return comments;
  } catch (error) {
    throw error;
  }
}

// GET COMMENT BY ID IN DB
async function getCommentById(commentId) {
  try {
    const comment = await getCommentInfoById(commentId);

    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username, imgUrl, admin, reviewCount
      FROM users
      WHERE id=$1;
    `,
      [comment.userid]
    );

    const commentObject = {
      ...comment,
      user: user,
    };

    return commentObject;
  } catch (error) {
    throw error;
  }
}

// GET COMMENTS BY REVIEW IN DB
async function getCommentsByReview(reviewId) {
  try {
    const { rows: commentIds } = await client.query(
      `
        SELECT id
        FROM comments
        WHERE reviewId=$1;
    `,
      [reviewId]
    );

    const comments = await Promise.all(
      commentIds.map((comment) => getCommentById(comment.id))
    );

    return comments;
  } catch (error) {
    throw error;
  }
}

// GET COMMENTS BY USER IN DB
async function getCommentsByUser(userId) {
  try {
    const { rows: commentIds } = await client.query(
      `
        SELECT id
        FROM comments
        WHERE userId=$1;
    `,
      [userId]
    );

    const comments = await Promise.all(
      commentIds.map((comment) => getCommentById(comment.id))
    );

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

    const comments = await Promise.all(
      commentIds.map((comment) => getCommentById(comment.id))
    );

    return comments;
  } catch (error) {
    throw error;
  }
}

// CREATE COMMENT IN DB
async function createComment({ userId, reviewId, content }) {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
      INSERT INTO comments(userId, reviewId, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `,
      [userId, reviewId, content]
    );

    return await getCommentById(comment.id);
  } catch (error) {
    throw error;
  }
}

// EDIT COMMENT IN DB
async function updateComment(commentId, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const {
        rows: [comment],
      } = await client.query(
        `
        UPDATE comments
        SET ${setString}
        WHERE id=${commentId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getCommentById(commentId);
  } catch (error) {
    throw error;
  }
}

async function destroyCommentById(commentId) {
  try {
    const destroyedComment = await getCommentById(commentId);

    await client.query(
      `
        DELETE FROM comments
        WHERE id = $1
    `,
      [commentId]
    );

    return destroyedComment;
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
  getUserByUsername,
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
  getUserPageRecipesByUser,
  getAllRecipesPage,
  getReviewedRecipesPage,
  getUserRecipesByTagName,
  destroyUserById,
  destroyTagById,
  destroyRecipeById,
  destroyReviewById,
  destroyCommentById,
  getUserPageById,
  getTagsByUser,
  getRecipeById,
  getReviewById,
  getCommentById,
  getPublicUserPageById,
};

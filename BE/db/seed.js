const {  
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
  } = require('./index');
  
  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS recipe_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS recipes;
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email varchar(255) NOT NULL,
          password varchar(255) NOT NULL,
          username varchar(255) UNIQUE NOT NULL,
          name varchar(255),
          imgUrl varchar(255),
          admin boolean DEFAULT false NOT NULL,
          reviewCount int DEFAULT 0 NOT NULL
        );
  
        CREATE TABLE recipes (
          id SERIAL PRIMARY KEY,
          userId INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          ingredients TEXT NOT NULL,
          content TEXT NOT NULL,
          imgUrl varchar(255)
        );
  
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name varchar(255) UNIQUE NOT NULL
        );
  
        CREATE TABLE recipe_tags (
          recipeId INTEGER REFERENCES recipes(id),
          tagId INTEGER REFERENCES tags(id),
          UNIQUE (recipeId, tagId)
        );

        CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            userId INTEGER REFERENCES users(id),
            recipeId INTEGER REFERENCES recipes(id),
            content TEXT NOT NULL,
            rating int NOT NULL,
            CHECK (rating <= 5)
          );

          CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            userId INTEGER REFERENCES users(id),
            reviewId INTEGER REFERENCES reviews(id),
            content TEXT NOT NULL
          );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      await createUser({ 
        email: 'adminTest@gmail.com',
        password: 'adminTestPass',
        username: 'adminTest', 
        name: 'Admin Test',
        imgUrl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
        admin: true
      });
      await createUser({ 
        email: 'userTest@gmail.com',
        password: 'userTestPass',
        username: 'userTest', 
        name: 'User Test',
        imgUrl: 'hhttps://www.shelbystar.com/gcdn/authoring/authoring-images/2023/10/24/NGAG/71300969007-sauce-1.jpg'
      });
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  
  async function createInitialRecipes() {
    try {
      const [adminTest, userTest] = await getAllUsers();
  
      console.log("Starting to create recipes...");
      await createRecipe({
        userId: adminTest.id,
        title: 
        ingredients: 
        content: 
        imgUrl:
      });
      console.log("Finished creating recipes!");
    } catch (error) {
      console.log("Error creating recipes!");
      throw error;
    }
  }

  async function createInitialReviews(){
    try {
      const [userTest] = await getAllUsers();
      const recipes = await getAllRecipes();
  
      console.log("Starting to create reviews...");
      await createReview({
        userId: userTest.id,
        recipeId: recipes[0].id,
        content: "this is cool",
        rating: 4
      });
      console.log("Finished creating reviews!");
    } catch (error) {
      console.log("Error creating reviews!");
      throw error;
    }
  }

  async function createInitialComments(){
    try {
      const [adminTest] = await getAllUsers();
      const reviews = await getAllReviews();
  
      console.log("Starting to create comments...");
      await createComment({
        userId: adminTest.id,
        reviewId: reviews[0].id,
        content: "thanks bruh",
      });
      console.log("Finished creating comments!");
    } catch (error) {
      console.log("Error creating comments!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialRecipes();
      await createInitialReviews();
      await createInitialComments();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }
  
  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Admin Test Updated Name"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllRecipes");
      const recipes = await getAllRecipes();
      console.log("Result:", recipes);
  
      console.log("Calling updateRecipe on recipes[0]");
      const updateRecipeResult = await updateRecipe(recipes[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updateRecipeResult);
  
      console.log("Calling updateRecipe on recipes[1], only updating tags");
      const updateRecipeTagsResult = await updateRecipe(recipes[1].id, {
        tags: ["stuff-with-hot-sauce", "something-from-yo-grandma", "dance-and-eat"]
      });
      console.log("Result:", updateRecipeTagsResult);

      console.log("Calling getAllReviews");
      const reviews = await getAllReviews();
      console.log("Result:", reviews);
  
      console.log("Calling updateReview on reviews[0]");
      const updateReviewResult = await updateReview(reviews[0].id, {
        content: "Updated Content"
      });
      console.log("Result:", updateReviewResult);

      console.log("Calling getAllComments");
      const comments = await getAllComments();
      console.log("Result:", comments);
  
      console.log("Calling updateComment on comments[0]");
      const updateCommentResult = await updateComment(comments[0].id, {
        content: "Updated Content"
      });
      console.log("Result:", updateCommentResult);
  
      console.log("Calling getUserById with 1");
      const admin = await getUserById(1);
      console.log("Result:", admin);
  
      console.log("Calling getAllTags");
      const allTags = await getAllTags();
      console.log("Result:", allTags);
  
      console.log("Calling getRecipesByTagName with something-from-yo-grandma");
      const recipesWithGrandma = await getRecipesByTagName("something-from-yo-grandma");
      console.log("Result:", recipesWithGrandma);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }
  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
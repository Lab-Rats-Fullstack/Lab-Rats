const bcrypt = require("bcrypt");

const {
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
  getAllComments,
  getUserPageRecipesByUser,
  getUserPageReviewsByUser,
  getUserPageCommentsByUser,
  getReviewedRecipesPage,
  getAllRecipesPage,
  getUserRecipesByTagName,
  destroyUserById,
  destroyTagById,
  destroyRecipeById,
  destroyReviewById,
  destroyCommentById,
  getUserPageById,
  getTagsByUser,
} = require("./index");

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
          ingredients TEXT[] NOT NULL,
          procedure TEXT[] NOT NULL,
          notes TEXT[],
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
            title varchar(255) NOT NULL,
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
    const adminTestPass = await bcrypt.hash("adminTestPass", 10);
    const userTestPass = await bcrypt.hash("userTestPass", 10);
    console.log("Starting to create users...");

    await createUser({
      email: "adminTest@gmail.com",
      password: adminTestPass,
      username: "adminTest",
      name: "Admin Test",
      imgUrl:
        "https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png",
      admin: true,
    });
    await createUser({
      email: "userTest@gmail.com",
      password: userTestPass,
      username: "userTest",
      name: "User Test",
      imgUrl:
        "https://www.shelbystar.com/gcdn/authoring/authoring-images/2023/10/24/NGAG/71300969007-sauce-1.jpg",
    });
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialRecipes() {
  try {
    const allUsers = await getAllUsers();
    const adminTest = allUsers[0];

    console.log("Starting to create recipes...");
    await createRecipe({
      userId: adminTest.id,
      title: "Butter Chicken",
      estimatedTime: "1 hour",
      ingredients: [
        "1.5 lbs Chicken Thighs",
        "1 cup Full-Fat Yogurt",
        "1 tbsp Grated or Crushed Garlic",
        "1 tbsp Grated Ginger",
        "1 tsp Turmeric Powder",
        "1 tsp Ground Cumin",
        "1 tsp Ground Coriander",
        "1 tsp Garam Masala",
        "Salt to Taste",
        "1 tsp Oil or Ghee",
        "2 tbsp Butter",
        "1 Large Onion, Finely Diced",
        "1 cup Tomato Puree",
        "1 cup Heavy Cream",
        "Fresh Cilantro, for Garnish",
      ],
      procedure: [
        "Mix yogurt, ginger, garlic, and spices (reserve half of garam masala) to a large bowl and mix well. Add in the chicken and marinate for at least 30min up to a day.",
        "In a large pan or dutch oven, add your oil over medium heat. Cook the chicken until well browned. It does not need to be cooked through at this stage.",
        "Set the chicken aside and add the butter to the pan. Once melted and bubbling, add the chopped onion to the pan.",
        "Once the onions are fully softened, add in the tomato puree and cook on high until the oil separated and the tomato starts to brown.",
        "Add the chicken back to the pan and stir to combine the mixture.",
        "Pour in the heavy cream and cook on medium low heat for 10-15 minutes or until the chicken is tender.",
        "Add in your remaining garam masala and any additional salt to taste. Adjust the consistency of the gravy with water only if absolutely necessary.",
        "Serve with naan and rice. Garnish with your chopped cilantro.",
      ],
      imgUrl:
        "https://www.foodiesfeed.com/wp-content/uploads/2023/03/close-up-of-butter-chicken-indian-dish.jpg",
      notes: [
        "I like to make the naan too as its a very easy and approachable flat bread to make at home.",
      ],
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Chicken and Sausage Gumbo",
      estimatedTime: "4-5 hours",
      ingredients: [
        "1 Onion, Finely Diced",
        "1 Bell Pepper, Finely Diced",
        "3 Stalks Celery, Finely Diced",
        "3-5 Cloves Garlic Finely Minced",
        "1 lbs Andoullie Sausage",
        "2 lbs Boneless Skinless Chicken Thighs",
        "1-2 quarts Chicken Stock",
        "2 tbsp Flour",
        "2 tbsp Vegetable Oil",
        "Tony Chachere's to Taste",
        "Cayenne Pepper to Taste",
        "Salt to Taste",
        "Fresh Ground Black Pepper to Taste",
        "MSG to Taste",
      ],
      procedure: [
        "Place your flour and oil in a heavy bottom pot or dutch oven that can hold around 4 quarts.",
        "Constantly stir your roux (flour/oil mixture) over medium heat until it is as dark as possible without being burnt. See note 1.",
        "While your roux is going, I like to brown my andouille and chicken in a separate pan. You'll want to go ahead and slice the sausage, but leave the chicken thighs whole for now. Note 2.",
        "When roux is the desired color, carefully add your holy trinity (diced vegetables) and garlic and stir vigorously. Alternatively a frozen store mix works fine. It's for flavor and thickening not for texture of the vegetables.",
        "After 2-3 minutes, or once you notice the vegetables soften slowly add the chicken stock around a cup at a time, allowing the mixture to come to a boil between additions. Note 3.",
        "Chop the chicken thighs and add them along with the sausage to your gumbo. Leave on medium low heat for at least thirty minutes, but preferably a few hours. DO NOT let the gumbo get above a bare simmer or you will end up with rubbery, dry sausage.",
        "Season to taste. I like to start with the Tony's until it is most of the way there, then make small adjustments to heat and salinity with the others. If your nose doesn't run, it's not spicy enough.",
        "Serve with rice and plenty of hot sauce. Garlic bread is also a great addition.",
      ],
      imgUrl: "BE/db/photos/gumbo-pic.jpg",
      notes: [
        'You should aim for what\'s called a "red roux" which is just past a dark dirt brown. This step takes practice to get right.',
        "You can alternatively brown these before you start the roux in the same pot/dutch oven, but you have to be careful not to burn the fond when making the roux.",
        "Homemade stock is best, but Better than Bouillon Roasted Chicken Base works better than any carton stock. Just reconstitute according to package directions.",
      ],
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Buffalo Chicken Sandwich",
      estimatedTime: "1 hour",
      ingredients: [
        "4 Chicken Thighs",
        "1 cup Flour",
        "1 Egg",
        "1 cup Buttermilk",
        "1 package of Panko Breadcrumbs",
        "Spices of your own choice",
        "Peanut oil for frying",
        "1 cup Frank's Red Hot",
        "2-4 tbsp Butter",
        "1 dash Worcestershire Sauce",
        "1 dash Honey",
        "Blue Cheese Dressing to Taste",
        "Pickled Peppers and Onions to Taste",
        "4 Brioche Buns",
      ],
      procedure: [
        "Mix the buttermilk, egg, and spices of your own choice into a large bowl and add chicken thighs to marinate. Leave for at least 30 minutes, but up to overnight.",
        "While the chicken is marinating, mix the flour with spices in a separate bowl. Set up a third bowl with your panko.",
        "Heat your oil to 350°F and move your chicken fries from the buttermilk, into the flour, back into the buttermilk, and finally into the panko.",
        "When your oil is ready, add your chicken to the oil and fry to golden brown.",
        "While your chicken is cooking, add the Frank's Red Hot and butter to a separate pan to melt the butter. Stir in the honey and worcestershire sauce.",
        "Once your chicken is cooked, place on a paper towel lined plate or a wire rack while you toast your brioche buns.",
        "Once your buns are toasted coat your chicken in the sauce and quickly assemble your sandwich with the pickled onions and peppers and blue cheese sauce.",
        "Enjoy with french fries.",
      ],
      imgUrl: "BE/db/photos/buffalo-chicken-pic.JPG",
      notes: [],
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Blue Cheese Dressing",
      ingredients: [
        "1 cup Mayonnaise",
        "1/2 cup Sour Cream",
        "1/2 cup Buttermilk",
        "4 oz Blue Cheese",
        "1 tbsp White Wine or Apple Cider Vinegar",
        "1 clove Garlic, Minced",
        "1/2 tsp of Worcestershire Sauce",
        "Your Choice of Fresh Herbs like Dill, Rosemary, Oregano, or Thyme",
        "Salt and Black Pepper to Taste",
      ],
      procedure: [
        "Add the mayonnaise, sour cream, buttermilk, vinegar, and worcestershire sauce to a bowl and mix until well combined.",
        "Crumble in the Blue Cheese and add your choice of fresh herbs and the minced garlic.",
        "Season with the Salt and Black pepper to taste.",
        "For best results, chill before serving.",
      ],
      imgUrl:
        "https://img.freepik.com/free-photo/top-view-yogurt-meal-brown-wooden-desk-food-yogurt-meat_140725-28373.jpg?w=740&t=st=1707958620~exp=1707959220~hmac=ccb6ad132464b618af23d47c6bbd510185020066158580387806fbb896d3c72c",
      notes: [
        "Pick a really good blue cheese for this and you'd be amazed how excellent this can be.",
      ],
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Quick Pickled Vegetables",
      ingredients: [
        "Enough of Any Vegetables of Your Choice to Fill up a Quart Jar",
        "Any Type of Vinegar",
        "Plain Water",
        "Salt to Taste",
        "1 tsp Sweetener of Your Choice",
      ],
      procedure: [
        "Chop your vegetables and add to your jar.",
        "Add enough vinegar to fill the jar halfway and fill the remaining space with water.",
        "Remove all of this liquid to a pot leaving the vegetables in the jar.",
        "Heat the mixture to a low boil and add your salt, sweetener, and any desired spices.",
        "As soon as everything is incorporated, pour the hot liquid over the vegetables in the jar.",
        "Place a loose lid over the jar and allow to come down to room temperature.",
        "Place the jar in the fridge.",
      ],
      imgUrl:
        "https://img.freepik.com/free-photo/composition-with-preserved-vegetables_23-2148626045.jpg?w=740&t=st=1707959071~exp=1707959671~hmac=1b45109139179b27b920f254f389123d717756d0e6ee900b66b7ea8f31bb041d",
      notes: [
        "This is good with any vegetable, but particularly with peppers and/or onions.",
        "You can use plain sugar, honey, or any other sweetener. Vary the amount too depending on the vegetables you are using. I like more sweetness with peppers for example.",
      ],
    });
    console.log("Finished creating recipes!");
  } catch (error) {
    console.log("Error creating recipes!");
    throw error;
  }
}

async function createInitialReviews() {
  try {
    const allUsers = await getAllUsers();
    const recipes = await getAllRecipes();

    console.log("Starting to create reviews...");
    await createReview({
      userId: allUsers[1].id,
      recipeId: recipes[0].id,
      title: "wow",
      content: "this is cool",
      rating: 4,
    });
    console.log("Finished creating reviews!");
  } catch (error) {
    console.log("Error creating reviews!");
    throw error;
  }
}

async function createInitialComments() {
  try {
    const allUsers = await getAllUsers();
    const reviews = await getAllReviews();

    console.log("Starting to create comments...");
    await createComment({
      userId: allUsers[0].id,
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
    console.log("Error during rebuildDB");
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
    const updateUserResult = await updateUser(users[1].id, {
      name: "User Test Updated Name",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllRecipes");
    const recipes = await getAllRecipes();
    console.log("Result:", recipes);

    console.log("Calling updateRecipe on recipes[0]");
    const updateRecipeResult = await updateRecipe(recipes[0].id, {
      title: "New Title",
      procedure: ["Updated Content"],
    });
    console.log("Result:", updateRecipeResult);

    console.log("Calling updateRecipe on recipes[1], only updating tags");
    const updateRecipeTagsResult = await updateRecipe(recipes[1].id, {
      tags: ["pastries", "classic", "salads"],
    });
    console.log("Result:", updateRecipeTagsResult);

    console.log("Calling getAllReviews");
    const reviews = await getAllReviews();
    console.log("Result:", reviews);

    console.log("Calling updateReview on reviews[0]");
    const updateReviewResult = await updateReview(reviews[0].id, {
      content: "This is cool 2",
    });
    console.log("Result:", updateReviewResult);

    console.log("Calling getAllComments");
    const comments = await getAllComments();
    console.log("Result:", comments);

    console.log("Calling updateComment on comments[0]");
    const updateCommentResult = await updateComment(comments[0].id, {
      content: "thanks bruh 2",
    });
    console.log("Result:", updateCommentResult);

    console.log("Calling getUserById with 1");
    const admin = await getUserById(1);
    console.log("Result:", admin);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getRecipesByTagName with salads");
    const recipesWithGrandma = await getRecipesByTagName("salads");
    console.log("Result:", recipesWithGrandma);

    console.log("Getting User Page Recipes with User ID 1");
    const userRecipes = await getUserPageRecipesByUser(1);
    console.log("Result:", userRecipes);

    console.log("user id 1");
    const test = await getUserById(1);
    console.log(test);

    console.log("user id 2");
    const test2 = await getUserById(2);
    console.log(test2);

    console.log("Getting User Page Reviews with User ID 2");
    const userReviews = await getUserPageReviewsByUser(2);
    console.log("Result:", userReviews);

    console.log("Getting User Page Comments with User ID 1");
    const userComments = await getUserPageCommentsByUser(1);
    console.log("Result:", userComments);

    console.log("Get all recipes page");
    const allRecipesPage = await getAllRecipesPage();
    console.log("Result:", allRecipesPage);

    console.log("Get reviewed recipes page");
    const reviewedRecipesPage = await getReviewedRecipesPage();
    console.log("Result:", reviewedRecipesPage);

    console.log("Get User Recipes By Tag Name");
    const userRecipesByTagName = await getUserRecipesByTagName(1, "salads");
    console.log("Result:", userRecipesByTagName);

    /*console.log("Destroy Comment By Id");
      const destroyedComment = await destroyCommentById(1);
      console.log("Result:", destroyedComment);*/

    /*console.log("Destroy Review By Id");
      const destroyedReview = await destroyReviewById(1);
      console.log("Result:", destroyedReview);*/

    /*console.log("Destroy Recipe By Id");
      const destroyedRecipe = await destroyRecipeById(2);
      console.log("Result:", destroyedRecipe);*/

    /*console.log("Destroy User By Id");
      const destroyedUser = await destroyUserById(1);
      console.log("Result:", destroyedUser);*/

    console.log("Get Full User Page Data for user 2");
    const userPage = await getUserPageById(2);
    console.log("Result:", userPage);

    console.log("Get tags by user 1");
    const tagsByUser = await getTagsByUser(1);
    console.log("Result:", tagsByUser);

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

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
        "https://res.cloudinary.com/dbwbh7oxd/image/upload/butter_chicken?_a=BAMHUyRg0",
      notes: [
        "I like to make the naan too as its a very easy and approachable flat bread to make at home.",
      ],
      tags: [
        "Main", "Curry", "Chicken", "Rice", "Indian"
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
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/chicken_and_sausage_gumbo?_a=BAMHUyRg0",
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
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/buffalo_chicken_sandwhich?_a=BAMHUyRg0",
      notes: [],
      tags: [
        "Sandwhiches", "Chicken", "American", "Main", "Lunch"
      ]
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
      tags: [
        "Condiments", "Sauces"
      ]
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
      tags: [
        "Condiments", "Vegetables"
      ]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Beef Birria Tacos",
      ingredients: [
        "3 lbs beef chuck roast, cut into chunks (or goat meat if preferred)",
        "5 dried guajillo chilies, seeded and deveined",
        "3 dried ancho chilies, seeded and deveined",
        "3 cloves garlic, minced",
        "1 medium-sized onion, chopped",
        "1 teaspoon dried oregano",
        "1 teaspoon ground cumin",
        "1/2 teaspoon ground cloves",
        "1/4 teaspoon ground cinnamon",
        "Salt to taste",
        "Black pepper to taste",
        "4 cups beef or chicken broth",
        "2 bay leaves",
        "2 tablespoons vegetable oil",
        "Corn tortillas",
        "Chopped fresh cilantro",
        "Diced onions",
        "Lime wedges"
      ],
      procedure: [
        "Toast the dried guajillo and ancho chilies in a hot, dry skillet.",
        "Remove stems, seeds, and devein the chilies. Soak them in hot water for about 20 minutes.",
        "In a blender, combine soaked chilies, minced garlic, chopped onion, oregano, cumin, cloves, cinnamon, salt, and black pepper. Blend into a smooth paste.",
        "Heat vegetable oil in a large pot. Brown beef chunks on all sides.",
        "Add the chili paste to the pot, stirring to coat the meat evenly.",
        "Pour in the broth, add bay leaves, and bring the mixture to a simmer.",
        "Reduce heat, cover, and simmer for 2-3 hours or until the meat is tender and shreds easily.",
        "Shred the cooked meat with two forks, removing any excess fat.",
        "Heat corn tortillas in a skillet or over an open flame.",
        "Spoon shredded birria meat into warm tortillas.",
        "Top with chopped cilantro and diced onions.",
        "Serve with lime wedges on the side.",
        "Enjoy your Birria Tacos! Optionally, serve with consomé for dipping."
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/birria_tacos?_a=BAMHUyRg0",
      notes: [
        "For a spicier flavor, you can add a couple of dried arbol chilies to the blender when making the chili paste.",
        "Adjust the salt and pepper according to your taste preferences. Taste the birria broth as it simmers and adjust as needed.",
        "Consomé, the flavorful broth from cooking the meat, is a key component. Save some to serve alongside the tacos for dipping.",
        "Consider garnishing with radishes, avocado slices, or your favorite salsa for added freshness and flavor.",
        "To save time, you can use a pressure cooker or slow cooker to cook the birria meat until tender.",
        "Leftover birria can be refrigerated and used in quesadillas, burritos, or as a topping for rice and salads.",
        "Serve the tacos with warm tortillas to enhance their flavor and make them more pliable.",
        "Feel free to experiment with different types of meat or a combination for a unique twist on the traditional recipe.",
        "The lime wedges add a bright citrusy kick; squeeze some over the tacos just before eating for a burst of freshness."
      ], 
      tags: ["Main", "Beef", "Mexican", "Tacos", "Sauces"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "French Dip Sandwhich",
      ingredients: [
        "2 lbs beef sirloin or chuck roast, thinly sliced",
        "4 cloves garlic, minced",
        "1 onion, thinly sliced",
        "2 tablespoons olive oil",
        "4 cups beef broth",
        "1 cup red wine (optional)",
        "1 teaspoon dried thyme",
        "1 teaspoon dried rosemary",
        "Salt and black pepper to taste",
        "4-6 French rolls or baguettes",
        "Provolone or Swiss cheese slices (optional)",
        "For Au Jus:",
        "- Reserved cooking liquid",
        "- Additional beef broth if needed",
        "- Salt and pepper to taste"
      ],
      procedure: [
        "Preheat your oven to 350°F (175°C).",
        "In a large oven-safe skillet, heat olive oil over medium-high heat.",
        "Season the thinly sliced beef with salt, black pepper, and minced garlic.",
        "Sear the beef slices in the skillet until browned on both sides. Remove and set aside.",
        "In the same skillet, sauté thinly sliced onions until softened and golden.",
        "Pour in the beef broth and red wine (if using). Add dried thyme and rosemary.",
        "Return the seared beef to the skillet. Cover and transfer to the preheated oven for about 20-25 minutes, or until the beef is tender.",
        "While the beef cooks, prepare the Au Jus by straining the cooking liquid. Add more beef broth if needed. Season with salt and pepper to taste.",
        "Slice the French rolls or baguettes and, if desired, add a slice of provolone or Swiss cheese.",
        "Divide the cooked beef among the rolls. Serve with a side of Au Jus for dipping.",
        "Enjoy your delicious French Dip sandwiches!"
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/french_dip?_a=BAMHUyRg0",
      notes: [
        "For a richer flavor, you can use a combination of beef broth and reserved cooking liquid for the Au Jus.",
        "Feel free to customize the sandwich by adding caramelized onions, sautéed mushrooms, or your favorite condiments.",
        "If you don't have red wine, you can omit it and use additional beef broth in its place.",
        "Toasting the French rolls or baguettes before assembling the sandwiches adds a nice crunch.",
        "Serve with a side of coleslaw, pickles, or a green salad for a complete meal."
      ], 
      tags: ["Main", "Beef", "Sandwhiches", "Sauces"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Criossants",
      ingredients: [
        "4 cups all-purpose flour, plus extra for dusting",
        "1/4 cup granulated sugar",
        "1 tablespoon active dry yeast",
        "1 1/4 cups warm milk",
        "1 teaspoon salt",
        "1 cup unsalted butter, cold",
        "1 egg (for egg wash)",
      ],
      procedure: [
        "In a bowl, combine warm milk and active dry yeast. Let it sit for 5 minutes until frothy.",
        "In a large mixing bowl, combine flour, sugar, and salt. Make a well in the center and pour in the yeast mixture.",
        "Mix until a dough forms, then knead on a floured surface for about 5-7 minutes until smooth.",
        "Roll the dough into a rectangle, wrap it in plastic wrap, and refrigerate for 1 hour.",
        "Take the cold butter and place it between sheets of parchment paper. Roll it out into a rectangle.",
        "Roll out the chilled dough on a floured surface into a larger rectangle. Place the butter layer on two-thirds of the dough.",
        "Fold the uncovered third over the butter, then fold the other third on top (similar to a letter fold).",
        "Wrap the dough and refrigerate for 30 minutes. Repeat this folding process two more times, chilling between each fold.",
        "After the final fold, refrigerate the dough for at least 4 hours or overnight.",
        "Roll out the chilled dough into a large rectangle and cut it into triangles.",
        "Roll each triangle from the wide end towards the tip to form a crescent shape.",
        "Place the shaped croissants on a baking sheet, cover, and let them rise for 1-2 hours, or until doubled in size.",
        "Preheat the oven to 400°F (200°C). Beat an egg and brush it over the croissants for a golden finish.",
        "Bake for 15-20 minutes or until the croissants are golden brown and flaky.",
        "Allow them to cool on a wire rack before serving.",
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/criossant?_a=BAMHUyRg0",
      notes: [
        "Ensure that your butter is cold, and the dough stays chilled during the folding process to create those flaky layers.",
        "You can prepare the dough the night before and let it rise in the refrigerator overnight for a convenient morning bake.",
        "Feel free to fill the croissants with chocolate, almond paste, or ham and cheese for variations.",
        "Serve with your favorite jam or enjoy them plain with a hot cup of coffee.",
        "This recipe requires some patience, but the result is delicious, homemade croissants."
      ], 
      tags: ["Breakfast", "Pastries", "Grains", "Yeast"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Pizza Dough",
      ingredients: [
        "4 cups all-purpose flour, plus extra for dusting",
        "1 tablespoon sugar",
        "1 tablespoon active dry yeast",
        "1 1/2 cups warm water",
        "2 tablespoons olive oil",
        "1 teaspoon salt",
      ],
      procedure: [
        "In a bowl, combine warm water and sugar. Stir until the sugar dissolves. Sprinkle the yeast over the water and let it sit for 5-10 minutes, or until foamy.",
        "In a large mixing bowl, combine flour and salt. Make a well in the center and pour in the yeast mixture and olive oil.",
        "Stir the ingredients together until a dough forms. Knead the dough on a floured surface for about 5-7 minutes, until smooth and elastic.",
        "Place the dough in a lightly oiled bowl, cover with a damp cloth, and let it rise in a warm place for 1-2 hours, or until doubled in size.",
        "Preheat your oven to the highest setting (usually around 475-500°F or 245-260°C). If you have a pizza stone, place it in the oven while preheating.",
        "Punch down the risen dough and divide it into desired portions for your pizzas. Roll or stretch each portion into the desired shape and thickness.",
        "If using a pizza stone, transfer the rolled-out dough onto a pizza peel or an inverted baking sheet dusted with flour or cornmeal.",
        "Add your favorite pizza toppings, sauce, cheese, and bake in the preheated oven for 10-15 minutes, or until the crust is golden and the cheese is bubbly and browned.",
        "Remove from the oven, let it cool for a few minutes, then slice and enjoy your homemade pizza!",
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/pizza_dough?_a=BAMHUyRg0",
      notes: [
        "Experiment with different flours, such as bread flour or 00 flour, for variations in texture and flavor.",
        "For a hint of garlic flavor, add a minced garlic clove or garlic powder to the dough mixture.",
        "Letting the dough rise in the refrigerator overnight can enhance its flavor and make it easier to work with.",
        "You can freeze extra dough portions for later use. Just thaw in the refrigerator before using.",
        "Feel free to get creative with toppings, from classic Margherita to BBQ chicken or veggie-loaded options."
      ], 
      tags: ["Grain", "Bread", "Base", "Yeast"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Naan",
      ingredients: [
        "3 cups all-purpose flour, plus extra for dusting",
        "1 teaspoon active dry yeast",
        "1 teaspoon sugar",
        "1 cup warm water",
        "1/4 cup plain yogurt",
        "2 tablespoons melted butter or ghee",
        "1 teaspoon salt",
        "Garlic butter for brushing (optional)",
        "Chopped fresh cilantro for garnish (optional)"
      ],
      procedure: [
      "In a small bowl, combine warm water, sugar, and active dry yeast. Stir and let it sit for 5-10 minutes, or until foamy.",
      "In a large mixing bowl, combine flour and salt. Make a well in the center and pour in the yeast mixture, yogurt, and melted butter or ghee.",
      "Mix the ingredients until a dough forms. Knead the dough on a floured surface for about 5-7 minutes, until smooth and elastic.",
      "Place the dough in a lightly oiled bowl, cover with a damp cloth, and let it rise in a warm place for 1-2 hours, or until doubled in size.",
      "Preheat a skillet or griddle over medium-high heat.",
      "Punch down the risen dough and divide it into equal-sized portions. Roll each portion into a ball.",
      "Roll out each ball of dough into an oval or teardrop shape, about 1/4 inch thick.",
      "Place the rolled-out dough onto the preheated skillet or griddle. Cook for 1-2 minutes on each side, or until golden brown and puffed up.",
      "Brush each cooked naan with garlic butter and sprinkle with chopped cilantro, if desired.",
      "Serve warm and enjoy your homemade naan bread with your favorite curry or as a delicious side!"
    ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/naan?_a=BAMHUyRg0",
      notes: [
        "For a softer texture, you can replace some of the all-purpose flour with bread flour or use whole wheat flour for a nuttier flavor.",
        "If you don't have yogurt, you can substitute it with an equal amount of milk or dairy-free yogurt.",
        "To add flavor variations, you can mix in minced garlic, chopped herbs, or spices like cumin or nigella seeds into the dough.",
        "Naan can also be cooked on a grill for a smoky flavor.",
        "Leftover naan can be stored in an airtight container or frozen for later use. Reheat before serving for best results."
      ], 
      tags: ["Bread", "Side", "Indian", "Grain", "Yeast"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Chili in a Sourdough Bread Bowl",
      ingredients: [
        "1 lb ground beef",
        "1 onion, diced",
        "2 cloves garlic, minced",
        "1 bell pepper, diced",
        "1 can (14 oz) diced tomatoes",
        "1 can (15 oz) kidney beans, drained and rinsed",
        "1 can (15 oz) black beans, drained and rinsed",
        "1 can (15 oz) tomato sauce",
        "1 cup beef broth",
        "2 tablespoons chili powder",
        "1 teaspoon ground cumin",
        "1 teaspoon paprika",
        "1/2 teaspoon cayenne pepper (optional, for heat)",
        "Salt and black pepper to taste",
        "Sourdough bread bowls"
      ],
      procedure: [
        "In a large pot or Dutch oven, brown the ground beef over medium-high heat. Drain excess fat if needed.",
        "Add diced onions, minced garlic, and bell pepper to the pot. Sauté until vegetables are softened.",
        "Stir in diced tomatoes, kidney beans, black beans, tomato sauce, and beef broth.",
        "Add chili powder, ground cumin, paprika, cayenne pepper (if using), salt, and black pepper. Mix well.",
        "Bring the chili to a simmer, then reduce the heat to low and let it simmer for at least 30 minutes to allow the flavors to meld. Stir occasionally.",
        "While the chili is simmering, preheat the oven to 350°F (175°C). Slice off the tops of sourdough bread and hollow out the center to create bread bowls.",
        "Place the bread bowls on a baking sheet and toast them in the preheated oven for about 8-10 minutes or until they are slightly crispy.",
        "Once the chili is ready, ladle it into the toasted sourdough bread bowls.",
        "Serve the chili-filled bread bowls hot, optionally topped with shredded cheese, sour cream, green onions, or your favorite chili toppings.",
        "Enjoy your delicious chili in a sourdough bread bowl!"
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/chili_in_bread_bowl?_a=BAMHUyRg0",
      notes: [
        "Feel free to customize the chili by adding other ingredients like corn, diced jalapeños, or different types of beans.",
        "For a vegetarian version, substitute the ground beef with plant-based protein or extra beans.",
        "You can prepare the chili ahead of time and reheat it before serving in the bread bowls.",
        "Consider making smaller bread bowls for appetizer-sized servings.",
        "The hollowed-out bread from the centers of the bowls can be used for dipping or making croutons."
      ], 
      tags: ["Bread", "Beef", "American", "Grain", "Yeast"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Hotdog with Beer Cheese Sauce and Homemade Buns",
      ingredients: [
        "Good Hotdogs",
        "Hotdog buns (homemade recipe below)",
        "1 cup shredded cheddar cheese",
        "1/2 cup shredded mozzarella cheese",
        "1/2 cup beer (choose your favorite type)",
        "2 tablespoons all-purpose flour",
        "2 tablespoons unsalted butter",
        "1/2 cup diced bell peppers (assorted colors)",
        "1/2 cup diced onions",
        "Salt and black pepper to taste",
        "4 cups bread flour",
        "1 tablespoon sugar",
        "1 tablespoon active dry yeast",
        "1 teaspoon salt",
        "1 cup warm milk",
        "1/4 cup unsalted butter, melted",
        "1 egg, beaten (for egg wash)"
      ],
      procedure: [
        "Preheat your grill or stovetop grilling pan.",
        "Grill the hotdog sausages until they are cooked to your liking.",
        "In a saucepan, melt butter over medium heat. Add diced bell peppers and onions, and sauté until they are soft and lightly caramelized.",
        "In a separate saucepan, melt butter over medium heat. Add flour and stir to form a roux.",
        "Slowly pour in the beer while continuously whisking to avoid lumps. Continue whisking until the mixture thickens.",
        "Reduce the heat to low, add shredded cheddar and mozzarella cheese, and stir until the cheese is melted and the sauce is smooth.",
        "Season the cheese sauce with salt and black pepper to taste. Keep warm on low heat while assembling the hotdogs.",
        "For the homemade buns (optional): Mix flour, sugar, yeast, and salt in a bowl. Add warm milk, melted butter, and knead until the dough is smooth. Let it rise until doubled, then shape into buns, and bake at 375°F (190°C) until golden brown.",
        "Place the grilled hotdog sausages into the buns. Top with the beer cheese sauce and sautéed peppers and onions.",
        "Serve your gourmet hotdogs immediately, and enjoy!"
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/hotdog_beer_cheese?_a=BAMHUyRg0",
      notes: [
        "Experiment with different types of sausages, such as bratwurst or chorizo, for variety.",
        "If you prefer a non-alcoholic version, you can substitute the beer in the cheese sauce with chicken or vegetable broth.",
        "Feel free to customize your toppings with additional ingredients like pickles, mustard, or jalapeños.",
        "You can prepare the buns in advance and freeze them for quick use when needed.",
        "Pair your gourmet hotdogs with your favorite side dishes, such as sweet potato fries or coleslaw."
      ], 
      tags: ["Homemade", "Side", "Buns", "Bread", "Yeast", "Cheese", "Beer"]
    });
    await createRecipe({
      userId: adminTest.id,
      title: "Fish and Chips",
      ingredients: [
        "4 large russet potatoes, peeled and cut into thick fries",
        "Vegetable oil, for frying",
        "1 1/2 cups all-purpose flour",
        "1 teaspoon baking powder",
        "1/2 teaspoon baking soda",
        "1/2 teaspoon salt",
        "1 1/4 cups cold club soda",
        "1 1/2 lbs white fish fillets (such as cod or haddock)",
        "Salt and black pepper to taste",
        "Lemon wedges, for serving",
        "Malt vinegar, for serving",
        "Tartar sauce, for serving"
      ],
      procedure: [
        "Preheat the oven to 200°F (95°C) to keep the cooked items warm while preparing the rest.",
        "In a large, deep pot, heat vegetable oil to 350°F (180°C) for frying the potatoes.",
        "While the oil is heating, rinse the cut potatoes under cold water to remove excess starch. Pat them dry with paper towels.",
        "In batches, carefully add the potatoes to the hot oil and fry for 4-5 minutes or until golden brown and crispy. Use a slotted spoon to remove them and place them on a paper towel-lined baking sheet. Keep warm in the preheated oven.",
        "For the fish batter, in a large bowl, whisk together flour, baking powder, baking soda, and salt. Gradually whisk in the cold club soda until you have a smooth batter.",
        "Season the fish fillets with salt and black pepper. Dip each fillet into the batter, allowing excess to drip off.",
        "Carefully place the battered fish into the hot oil and fry for 3-4 minutes per side, or until golden brown and the fish is cooked through. Remove and place on a paper towel-lined plate.",
        "Serve the fish and chips hot, sprinkled with additional salt if desired. Accompany with lemon wedges, malt vinegar, and tartar sauce.",
        "Enjoy your homemade fish and chips!"
      ], 
      imgUrl: "https://res.cloudinary.com/dbwbh7oxd/image/upload/fish_and_chips?_a=BAMHUyRg0",
      notes: [
        "For a lighter version, you can bake the fries instead of frying. Just toss them with a bit of oil and bake in a preheated oven at 425°F (220°C) until golden brown and crispy.",
        "Experiment with different types of white fish for the fillets, depending on your preference and availability.",
        "Adjust the thickness of the fries and fish fillets based on your desired level of crispiness and cooking time.",
        "Serve with traditional British accompaniments like mushy peas or coleslaw for an authentic experience.",
        "Be cautious when working with hot oil, and use a deep-fry thermometer to monitor the temperature."
      ], 
      tags: ["British", "Seafood", "Main"]
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
      tags: ["Soup/Stews", "Pork", "Poultry", "American"],
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

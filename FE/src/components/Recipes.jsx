import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Recipes ({token}) {
    const [recipeList, setRecipeList] = useState([]);

    const [filteredRecipes, setFilteredRecipes] = useState(recipeList);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const dummyRecipes = [
    {
        id: 3,
        userId: 3,
        userName: "kiss_the_chef",
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
        tags: ["gluten free"],
    },
    {
        id: 4,
        userId: 4,
        userName: "bleu_cheese_lover",
        title: "Blue Cheese Dressing",
        estimatedTime: "45 min",
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
        tags: ["condiment"],
      },
      {
        id: 5,
        userId: 5,
        userName: "pickle_boy",
        title: "Quick Pickled Vegetables",
        estimatedTime: "1 hour",
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
        tags: ["vegetarian"]
      }]
    
    function changeSearch(e){
      setSearchTerm(e.target.value)
    }

    useEffect(() => {
        setRecipeList(dummyRecipes);
    }, []);

    useEffect(()=>{
      const filter = recipeList.filter((recipe)=>{
        const { title, tags } = recipe
        const tagsList = tags.join('')
        const search = searchTerm.toLowerCase()
        return title.toLowerCase().includes(search) || tagsList.toLowerCase().includes(search)
      })
      setFilteredRecipes(filter)
    }, [searchTerm, recipeList]);

    return (
        <div className="recipesContainer">
        <label htmlFor="search-bar">
          Search Recipes: 
          <input type="text" value={searchTerm} onChange={changeSearch}/>
        </label>
           {filteredRecipes.length ?
           filteredRecipes.map((recipe) => {
               return (
                   <div className="recipeCard" key={recipe.id}>
                       <h2>{recipe.title}</h2>
                       <h4>{recipe.userName}</h4>
                       <img src={recipe.imgUrl} alt={`A picture of ${recipe.title}`} height="15%" width="22.5%"/>
                       <p><em>{recipe.tags}</em></p>
                       <p>Est. Time: {recipe.estimatedTime}</p>
                       <button onClick={() => {
                           navigate(`/recipes/${recipe.id}`)
                       }}>See Recipe</button>
                   </div>
               );
           }):
           <h2>
            No Recipes to Display.
           </h2>
           }
       </div>
    )
}
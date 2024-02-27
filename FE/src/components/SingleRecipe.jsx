import { useState } from 'react'
import { useEffect } from 'react'

export default function SingleRecipe ({token}) {
    const [recipe, setRecipe] = useState({});
    const [tags, setTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [procedure, setProcedure] = useState([]);

    const dummyRecipe =
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
            tags: ["gluten free", "indian", "entree"],
        };

    useEffect(() => {
        setRecipe(dummyRecipe);
        setTags(dummyRecipe.tags);
        setIngredients(dummyRecipe.ingredients);
        setProcedure(dummyRecipe.procedure);
    },[]);

    return (
        <>
        <div className="singleRecipeCard">
            <h1>{recipe.title}</h1>
            <h5>@{recipe.userName}</h5>
            <div>{tags.map((tag) => {
                return (
                <p key={tag}><em>{tag}</em></p>
            )})}</div>
            <img src={recipe.imgUrl} heigth="20%" width="25%"/>
            <h3>Ingredients:</h3>
                <ul>
                    {ingredients.map((ingredient) => {
                        return (
                            <li key={ingredient}>{ingredient}</li>
                        )
                    })}
                </ul>
            <h2>Instructions:</h2>
            <ol>
                {procedure.map((item) => {
                    return (
                    <li key={item}>{item}</li>
                    )})}
            </ol>
        </div>
        </>
    );
}
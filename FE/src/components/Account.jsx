import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Account ({token}) {
    const [userData, setUserData] = useState({})
    const [error, setError] = useState(null);
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [update, setUpdate] =useState(0);
    const [userRecipes, setUserRecipes] =useState(true);
    const [userReviews, setUserReviews] =useState(false);
    const [userComments, setUserComments] =useState(false);
    const [recipeList, setRecipeList] = useState([]);

    token = 2;
    const dummyUser = {
        email: "adminTest@gmail.com",
        password: "adminTestPass",
        username: "adminTest", 
        name: "Admin Test",
        imgUrl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
        admin: true
    }
    const dummyRecipes = [
        {
            id: 3,
            userId: 3,
            userName: "adminTest",
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
            userId: 3,
            userName: "adminTest",
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
          }
        ]

    const dummyReviews = [
        {
            userId: 2,
            recipeId: 2,
            content: "this is cool",
            rating: 4
        },
        {
            userId: 5,
            recipeId: 6,
            content: "Wouldn't make again",
            rating: 2
        }
    ]
    const dummyComment = [
        {
            userId: 16,
            reviewId: 10,
            content: "thanks bruh",
        }
    ]
        
    useEffect(()=>{
        async function userCheck () {
            try {
                // const response = await fetch(`${API}users/me`, {
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "Authorization": `Bearer ${token}`,
                //     },
                // });
                // const result = await response.json();
                if (token !== null) {
                    setUserData(dummyUser);
                    setFail(false);
                    setSuccess(true);
                    setUserRecipes(true);
                } else {
                    setFail(true);
                    setSuccess(false);
                }

            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }userCheck();
    }, [update])

    async function signIn(){
        navigate('/login');
    }

    async function userVersion(){
        setUpdate((version) => version +1);
    }
    
    useEffect(() => {
        setRecipeList(dummyRecipes);
    }, []);

    return (
        <><p>This is the Account page</p>
        <div className = 'wrapper'>
            {error && <p>{error}</p>}
            {fail && <div className='fail'><h2>Please Sign In</h2><br/> <button type='login' onClick={signIn}>Log In</button></div>}
            {success &&
            <div>
                <div className = 'userInfo'>
                    <img src={userData.imgUrl} alt={`User account image for ${userData.username}`} height="15%" width="22.5%"/>
                    <h2>{userData.username}</h2>
                    <p>{userData.name}</p>
                    <p>{userData.email}</p>
                    <button onClick={userVersion}>Update Profile</button>
                </div>
                <div className = 'userItems'>
                    <div className='userItemsNav'>
                        <p>My Recipes</p>
                        <p>My Reviews</p>
                        <p>My Comments</p>
                    </div>
                    <div className='itemContent'>
                        
                        <div className="recipesContainer">
                            <div className = 'userRecipes'>
                                {recipeList.map((recipe)=>{
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
                                })}
                            </div>
                        </div>
                        {/* {userReviews && }
                        {userComments && } */}
                    </div>
                </div>
            </div>}
            
        </div>
        </>
    )
}
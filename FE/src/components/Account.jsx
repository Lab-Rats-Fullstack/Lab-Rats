import {useEffect, useState} from 'react'
import { Routes, Route, useNavigate, useParams} from 'react-router-dom'
import { Link } from 'react-router-dom'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import UserReviews from './UserReviews'
import UserComments from './UserComments'
import NavButton from './NavButton'

const API = 'http://localhost:3000/api/';

export default function Account ({token}) {
    const [userData, setUserData] = useState({}); 
    const [adminPriv, setAdminPriv] = useState(false);   
    const {recipes: recipeList =[], reviews: reviewList=[], comments: commentList=[]} = userData;

    const [error, setError] = useState(null);
    const [fail, setFail] = useState(false);
    const navigate = useNavigate();
    const [update, setUpdate] =useState(0);
    const [userRecipes, setUserRecipes] =useState(true);
    const [userReviews, setUserReviews] =useState(false);
    const [userComments, setUserComments] =useState(false);
    
    const [updatedUser, setUpdatedUser] =useState({});

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [buttonStatus, setButtonStatus] = useState(true);
    const [userForm, setUserForm] = useState(false);
    const [userBio, setUserBio] = useState(true);

    const dummyUser = {
        email: "adminTest@gmail.com",
        password: "adminTestPass",
        username: "adminTest", 
        name: "Admin Test",
        imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
        admin: true
    }
    const dummyRecipes = [
        {
            id: 3,
            userid: 1,
            username: "adminTest",
            title: "Butter Chicken",
            estimatedtime: "1 hour",
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
            imgurl:
              "https://www.foodiesfeed.com/wp-content/uploads/2023/03/close-up-of-butter-chicken-indian-dish.jpg",
            notes: [
              "I like to make the naan too as its a very easy and approachable flat bread to make at home.",
            ],
            tags: [
                {
                    "id": 1,
                    "name": "pastries"
                },
                {
                    "id": 2,
                    "name": "classic"
                },
                {
                    "id": 3,
                    "name": "salads"
                }
            ],
        },
        {
            id: 4,
            userid: 1,
            username: "adminTest",
            title: "Blue Cheese Dressing",
            estimatedtime: "45 min",
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
            imgurl:
              "https://img.freepik.com/free-photo/top-view-yogurt-meal-brown-wooden-desk-food-yogurt-meat_140725-28373.jpg?w=740&t=st=1707958620~exp=1707959220~hmac=ccb6ad132464b618af23d47c6bbd510185020066158580387806fbb896d3c72c",
            notes: [
              "Pick a really good blue cheese for this and you'd be amazed how excellent this can be.",
            ],
            tags: [
                {
                    "id": 1,
                    "name": "pastries"
                },
                {
                    "id": 2,
                    "name": "classic"
                },
                {
                    "id": 3,
                    "name": "salads"
                }
            ],
          }
    ]

    const dummyReviews = [
        {
            id: 1,
            userid: 1,
            recipeid: 1,
            content: 'This is cool',
            rating: 4,
            user: {
                id: 1,
                email: 'adminTest@gmail.com',
                username: 'adminTest',
                name: 'Admin Test',
                imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
                admin: true,
                reviewcount: 0
            },
            recipe: {
                id: 1,
                userid: 2,
                title: 'New Title',
                ingredients: [Array],
                procedure: [Array],
                notes: [Array],
                imgurl: 'https://www.foodiesfeed.com/wp-content/uploads/2023/03/close-up-of-butter-chicken-indian-dish.jpg'
            }
        }
    ]
    const dummyComments = [
        {
            id: 1,
            userid: 1,
            reviewid: 5,
            content: 'thanks bruh',
            user: {
              id: 1,
              email: 'adminTest@gmail.com',
              username: 'adminTest',
              name: 'Admin Test',
              imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
              admin: true,
              reviewcount: 0
            },
            review: {
              id: 5,
              userid: 2,
              recipeid: 7,
              content: 'This is cool 2',
              rating: 4
            },
            recipe: {
              id: 7,
              userid: 6,
              title: 'Tasty Chicken',
              ingredients: [Array],
              procedure: [Array],
              notes: [Array],
              imgurl: 'https://www.foodiesfeed.com/wp-content/uploads/2023/03/close-up-of-butter-chicken-indian-dish.jpg'
            }
        }
    ]
    
    const dummyData = {
        ...dummyUser,
        recipes: dummyRecipes,
        reviews: dummyReviews,
        comments: dummyComments
    }

    token = 2;
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
                // console.log(result);
                if (token !== null) {
                    setUserData(dummyData);
                    setFail(false);
                } if (dummyData.admin !== false){
                    setAdminPriv(true);
                } else {
                    setFail(true);
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

    async function userUpdate(event) {
        event.preventDefault();
        try {
            // const response = await fetch(`${API}users/me`, {
            //     method: "PATCH",
            //     headers: {
            //         "Content-Type":"application/json",
            //         "Authorization": `Bearer ${token}`,
            //     },
            //         body: JSON.stringify({
            //             ...updatedUser,
            //             password
            //         })
            // });
            // const result = await response.json()
            // console.log(result);             
            setUserData(dummyData);
            setUpdate((version) => version +1);
            setUserForm(false);
            setUserBio(true);
        } catch (error) {
            setError(error.message);
            console.log( error );
        }
    }

    useEffect(() => {
        async function enableButton () {
            try {
                if (password == confirmPassword) {
                    setButtonStatus(false);
                } else {
                    setButtonStatus(true);
                }
            } catch(error) {
                console.log(error);
            }
        }enableButton();
    }, [password, confirmPassword]);

    // console.log(dummyData);
    // console.log(userData);

    return (
        <><p>This is the Account page</p>
        <div className = 'wrapper'>
            {error && <p>{error}</p>}
            {fail ? <div className='fail'><h2>Please Sign In</h2><br/> <button type='login' onClick={signIn}>Log In</button></div> :
            <div>
                {userBio && 
                    <div>
                        <UserInfo
                            key ={userData.id}
                            token={token}
                            userData={userData}
                            adminPriv={adminPriv}/>
                        <button onClick={() => {setUserBio(false); setUserForm(true);}}>Update Profile</button>
                    </div>
                }
                
                {userForm &&
                    <div className = 'userUpdateForm'>
                        {/* form could be a component? */}
                    <form onSubmit = {userUpdate}>
                        <label>
                            Profile Image:
                            <input
                                defaultValue = {userData.imgurl}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        imgurl: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <br/>
                        <label>
                            Username:
                            <input
                                defaultValue = {userData.username}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        username: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <br/>
                        <label>
                            Email:
                            <input
                                defaultValue = {userData.email}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        email: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <br/>
                        <label>
                            Name:
                            <input
                                defaultValue = {userData.name}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        name: e.target.value
                                }})}
                            />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input
                                type = "password"
                                defaultValue = {password}

                                onChange = {(e)=> setPassword(e.target.value)}
                            />
                        </label>
                        <br/>
                        <label>
                            Confirm Password:
                            <input
                                type = "password"
                                value = {confirmPassword}

                                onChange = {(e)=> setConfirmPassword(e.target.value)}
                            />
                        </label>
                        {buttonStatus == true && <p>Passwords must match</p>}
                        <br/>
                        <button type='submit' disabled = {buttonStatus} >Submit</button>
                    </form>
                </div>
                }
                
                <div className = 'userItems'>
                    <div className='userItemsNav'>
                        {/* This might be swapped to a router. acounts/recipes, accounts/reviews, accounts/comments
                         this userNav div could be it's own component
                         this is one of the generic button options */}
                        {/* Need to get clarification on this from Larry */}
                        <button onClick={() => {
                            setUserRecipes(true);
                            setUserReviews(false);
                            setUserComments(false);
                        }}>My Recipes</button>
                        <button onClick={() => {
                            setUserRecipes(false);
                            setUserReviews(true);
                            setUserComments(false);
                        }}>My Reviews</button>
                        <button onClick={() => {
                            setUserRecipes(false);
                            setUserReviews(false);
                            setUserComments(true);
                        }}>My Comments</button>
                        {/* <NavButton location ={`/account/recipes`} buttonText={"My Recipes"}/> */}
                    </div>
                    <div className='itemContent'>
                        {userRecipes && 
                        <UserRecipes token={token} userData={userData} adminPriv={adminPriv}/>
                        }
                        {userReviews && 
                        <UserReviews token={token} userData={userData} adminPriv={adminPriv}/>
                        }
                        {userComments && 
                        <UserComments token={token} userData={userData} adminPriv={adminPriv}/>
                        }
                    </div>
                </div>
            </div>}
            
        </div>
        </>
    )
}
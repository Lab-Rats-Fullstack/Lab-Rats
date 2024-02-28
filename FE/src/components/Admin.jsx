import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin ({token}) {
    const [allUsers, setAllUsers] =useState(true);
    const [reviewedRecipes, setReviewedRecipes] =useState(false);
    const [recipeTags, setrecipeTags] =useState(false);
    const [usersList, setUsersList] = useState({});
    const [reviewedRecipesList, setReviewedRecipesList] = useState({});
    const [tagsList, setTagsList] = useState({});
    const [error, setError] = useState(null);
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    token = 2;//temp placeholder
    const dummyUsers= [
        {
          id: 1,
          email: 'adminTest@gmail.com',
          username: 'adminTest',
          name: 'Admin Test',
          imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
          admin: true,
          reviewcount: 0
        },
        {
          id: 2,
          email: 'userTest@gmail.com',
          username: 'userTest',
          name: 'User Test',
          imgurl: 'https://www.shelbystar.com/gcdn/authoring/authoring-images/2023/10/24/NGAG/71300969007-sauce-1.jpg',
          admin: false,
          reviewcount: 1
        }
      ]

      const dummyTags = [
        { id: 1, name: 'soups/stews' },
        { id: 2, name: 'classic' },
        { id: 3, name: 'dessert' },
        { id: 4, name: 'appetizer' },
        { id: 5, name: 'sides' },
        { id: 6, name: 'gluten free' },
      ]

      const dummyReviewedRecipes = [
        {
            id: 2,
            userid: 1,
            title: 'Chicken and Sausage Gumbo',
            ingredients: [
              '1 Onion, Finely Diced',
              '1 Bell Pepper, Finely Diced',
              '3 Stalks Celery, Finely Diced',
              '3-5 Cloves Garlic Finely Minced',
              '1 lbs Andoullie Sausage',
              '2 lbs Boneless Skinless Chicken Thighs',
              '1-2 quarts Chicken Stock',
              '2 tbsp Flour',
              '2 tbsp Vegetable Oil',
              "Tony Chachere's to Taste",
              'Cayenne Pepper to Taste',
              'Salt to Taste',
              'Fresh Ground Black Pepper to Taste',
              'MSG to Taste'
            ],
            procedure: [
              'Place your flour and oil in a heavy bottom pot or dutch oven that can hold around 4 quarts.',
              'Constantly stir your roux (flour/oil mixture) over medium heat until it is as dark as possible without being burnt. See note 1.',
              "While your roux is going, I like to brown my andouille and chicken in a separate pan. You'll want to go ahead and slice the sausage, but leave the chicken thighs whole for now. Note 2.",
              "When roux is the desired color, carefully add your holy trinity (diced vegetables) and garlic and stir vigorously. Alternatively a frozen store mix works fine. It's for flavor and thickening not for texture of the vegetables.",
              'After 2-3 minutes, or once you notice the vegetables soften slowly add the chicken stock around a cup at a time, allowing the mixture to come to a boil between additions. Note 3.',
              'Chop the chicken thighs and add them along with the sausage to your gumbo. Leave on medium low heat for at least thirty minutes, but preferably a few hours. DO NOT let the gumbo get above a bare simmer or you will end up with rubbery, dry sausage.',
              "Season to taste. I like to start with the Tony's until it is most of the way there, then make small adjustments to heat and salinity with the others. If your nose doesn't run, it's not spicy enough.",
              'Serve with rice and plenty of hot sauce. Garlic bread is also a great addition.'
            ],
            notes: [
              `You should aim for what's called a "red roux" which is just past a dark dirt brown. This step takes practice to get right.`,
              'You can alternatively brown these before you start the roux in the same pot/dutch oven, but you have to be careful not to burn the fond when making the roux.',
              'Homemade stock is best, but Better than Bouillon Roasted Chicken Base works better than any carton stock. Just reconstitute according to package directions.'
            ],
            imgurl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/01_Old_School_Gumbo_-_Tchoup_Shop.jpg',
            tags: [
              { id: 1, name: 'soups/stews' },
              { id: 2, name: 'classic' }
            ],
            reviews: [
              {
                id: 1,
                userid: 2,
                recipeid: 1,
                content: 'this is cool',
                rating: 4,
                comments: [],
                user: 
                {
                    id: 2,
                    email: 'adminTest2@gmail.com',
                    username: 'adminTest2',
                    name: 'Admin Test 2',
                    imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
                    admin: true
                }
                
              }
            ],
            user: {
              id: 1,
              email: 'adminTest@gmail.com',
              username: 'adminTest',
              name: 'Admin Test',
              imgurl: 'https://www.icb.org.za/wp-content/uploads/2023/08/2023-Blog-header-images-10-1030x579.png',
              admin: true
            }
          }
      ]

    useEffect(()=>{
        async function allUserCheck () {
            try {
                // const response = await fetch(`${API}users/"usersId"`, {
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "Authorization": `Bearer ${token}`,
                //     },
                // });
                // const result = await response.json()             
                if (token !== null) {//need an elseif to crosscheck admin
                    setUsersList(dummyUsers);
                    setFail(false);
                    setSuccess(true);
                    // setUserBio(true);
                    // setUserForm(false);
                } else {
                    setFail(true);
                    setSuccess(false);
                }

            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }allUserCheck();
    }, [])

    async function signIn(){
        navigate('/login');
    }

    useEffect(()=>{
        async function allReviewedRecipesCheck () {
            try {
                // const response = await fetch(`${API}recipes/reviewedRecipes, {
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "Authorization": `Bearer ${token}`,
                //     },
                // });
                // const result = await response.json()             
                if (token !== null) {//need an elseif to crosscheck admin
                    setReviewedRecipesList(dummyReviewedRecipes);
                    setFail(false);
                    setSuccess(true);
                    // setUserBio(true);
                    // setUserForm(false);
                } else {
                    setFail(true);
                    setSuccess(false);
                }

            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }allReviewedRecipesCheck();
    }, [])

    useEffect(()=>{
        async function allTagsCheck () {
            try {
                // const response = await fetch(`${API}tags, {
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "Authorization": `Bearer ${token}`,
                //     },
                // });
                // const result = await response.json()             
                if (token !== null) {//need an elseif to crosscheck admin
                    setTagsList(dummyTags);
                    setFail(false);
                    setSuccess(true);
                    // setUserBio(true);
                    // setUserForm(false);
                } else {
                    setFail(true);
                    setSuccess(false);
                }

            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }allTagsCheck();
    }, [])

    return (
        <><p>This is the Admin page for admin specific tasks</p>
        <div className = 'wrapper'>
            <div className='adminNav'>
                <button onClick={() => {
                    setAllUsers(true);
                    setReviewedRecipes(false);
                    setrecipeTags(false);
                }}>All Users</button>
                <button onClick={() => {
                    setAllUsers(false);
                    setReviewedRecipes(true);
                    setrecipeTags(false);
                }}>Reviewed Recipes</button>
                <button onClick={() => {
                    setAllUsers(false);
                    setReviewedRecipes(false);
                    setrecipeTags(true);
                }}>Recipe Tags</button>
            </div>
            {error && <p>{error}</p>}
            {fail && <div className='fail'><h2>Please Sign In</h2><br/> <button type='login' onClick={signIn}>Log In</button></div>}
            {success &&
            <div>
                {allUsers &&
                <div className = 'allUsers'>
                    <h2>All Users</h2>
                    {usersList.map((user)=> {
                        return (
                            <div className ="userCard" key = {user.id}>
                            <img src={user.imgurl} alt={`User account image for ${user.username}`} height="15%" width="22.5%"/>
                            <h3>Username: {user.username}</h3>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Review count: {user.reviewcount}</p>
                            <button onClick={() => {
                                navigate(`/users/${user.id}`)
                            }}>View User</button>
                        </div>
                        )
                    })}
                </div>}
                {reviewedRecipes &&
                <div className = 'reviewedRecipes'>
                    <h2>All Reviewed Recipes</h2>
                    {reviewedRecipesList.map((reviewedRecipe)=> {
                        return (
                            <div className ="reviewedRecipeCard" key = {reviewedRecipe.id}>
                                <h3>{reviewedRecipe.title}</h3>
                                <h4>{reviewedRecipe.user.username}</h4>
                                <img src={reviewedRecipe.imgurl} alt={`A picture of ${reviewedRecipe.title}`} height="15%" width="22.5%"/>
                                {reviewedRecipe.tags.map((tag)=> {
                                    return (
                                        <div className ='cardTag' key = {tag.id}>
                                            <p><em>{tag.name}</em></p>
                                        </div>
                                    )
                                })}
                                {reviewedRecipe.reviews.map((review)=> {
                                    return (
                                        <div className ='cardReview' key = {review.id}>
                                            <p>Review: "{review.content}" by {review.user.username}</p>
                                            <p>rating: {review.rating}</p>
                                        </div>
                                    )
                                })}
                                <button onClick={() => {
                                    navigate(`/recipes/${reviewedRecipe.id}`)
                                }}>See Recipe</button>
                            </div>
                        )
                    })}
                </div>}
                {recipeTags &&
                        <div className ="allTags">
                            {tagsList.map((tag)=>{
                                return(
                                    <div className='tag' key ={tag.id}>
                                        <p><em>{tag.name}</em></p>
                                    </div>
                                )
                            })}
                            <button onClick={() => {
                                    navigate(`/tags`)
                                }}>Edit Tags</button>
                        </div>
                    }
            </div>}
        </div>
        </>
    )
}
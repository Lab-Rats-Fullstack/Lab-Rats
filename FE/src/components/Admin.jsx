import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AverageStars from './AverageStars'

const API = "http://localhost:3000/api/";

export default function Admin ({token, admin}) {
    const [allUsers, setAllUsers] =useState(true);
    const [reviewedRecipes, setReviewedRecipes] =useState(false);
    const [recipeTags, setrecipeTags] =useState(false);
    const [usersList, setUsersList] = useState({});
    const [reviewedRecipesList, setReviewedRecipesList] = useState([]);
    const [tagsList, setTagsList] = useState({});
    const [error, setError] = useState(null);
    const [fail, setFail] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    async function signIn(){
        navigate('/login');
    }

    useEffect(()=>{
        async function allReviewedRecipesFetch(){
            async function allReviewedRecipesCheck () {
                try {
                    const response = await fetch(`${API}recipes/reviewedRecipes`, {
                        method: "GET",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": `Bearer ${token}`,
                         }
                     });
                     const result = await response.json()             
                    return result;
                } catch (error) {
                    setError(error.message);
                    throw(error);
                }
            }
            
            const potentialReviewedRecipes= await allReviewedRecipesCheck();
            
            if (potentialReviewedRecipes.length > 0){
                setReviewedRecipesList(potentialReviewedRecipes);
            } else {
                setError("No Recipes.");
            }
        }

        allReviewedRecipesFetch();
        
    }, [])

    useEffect(()=>{
        async function allTagsFetch(){
            async function allTagsCheck () {
                try {
                    const response = await fetch(`${API}tags`, {
                         method: "GET",
                         headers: {
                             "Content-Type":"application/json",
                         "Authorization": `Bearer ${token}`,
                        }
                     });
                    const result = await response.json()             
                    return result;
                } catch (error) {
                    setError(error.message);
                    throw (error);
                }
            }

            const potentialAllTags = await allTagsCheck();
            console.log("potentialAllTags:", potentialAllTags);
            if (potentialAllTags.rows.length > 0){
                setTagsList(potentialAllTags.rows);
            } else {
                setError("No Tags.");
            }

        }
        allTagsFetch();
    }, [])

    return (
        <>
        {!token ?
            <div className='fail'><h2>Please Sign In</h2><br/> <button type='login' onClick={signIn}>Log In</button></div>
        :
        <>
                {!(admin) ?
                    <p>Only admin are granted access to this page.</p>
                :
                <>
                    <p>This is the Admin page for admin specific tasks</p>
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
                        {error ?
                            <p>{error}</p>
                        :
                        <div>
                        {allUsers &&
                        <p>users list</p>
                        /*<div className = 'allUsers'>
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
                        </div>*/}
                        {reviewedRecipes &&
                        <div className = 'reviewedRecipes'>
                            <h2>All Reviewed Recipes</h2>
                            {reviewedRecipesList.map((reviewedRecipe)=> {
                                return (
                                    <div className ="reviewedRecipeCard" key = {reviewedRecipe.id}>
                                        <h3>{reviewedRecipe.title}</h3>
                                        <h4>{reviewedRecipe.user.username}</h4>
                                        <div className="averageRating">
                                           {reviewedRecipe.avgRating ? (
                                                <AverageStars starAverage={reviewedRecipe.avgRating} />
                                             ) : (
                                             <p>This recipe has not yet been reviewed.</p>
                                             )}
                                        </div>
                                        <img src={reviewedRecipe.imgurl} alt={`A picture of ${reviewedRecipe.title}`} />
                                        {reviewedRecipe.tags.map((tag)=> {
                                            return (
                                                <div className ='cardTag' key = {tag.id}>
                                                    <p><em>{tag.name}</em></p>
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
                                </div>
                            }
                    </div>
                        }
                        
                    </div>
                </>
            }
        
        
        </>
        }
        </>

        
    )
}
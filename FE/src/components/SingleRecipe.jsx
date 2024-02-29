import { useState, useEffect } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import Recipes from './Recipes';

export default function SingleRecipe ({token}) {
    const {recipeId} = useParams();
    const [errMess, setErrMess] = useState(false);
    const navigate = useNavigate();
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [recipe, setRecipe] = useState({});

    useEffect(() => {
        async function handleGetRecipeById(){
            async function handleGetRecipeFetch(){
                try{
                    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, 
                    { 
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json"
                        }
                    })
                    const json = await response.json();
                    console.log(json);
                    return json;
                } catch (error) {
                    setErrMess(true);
                }
            }
    
            const potentialRecipe = await handleGetRecipeFetch();
            if (potentialRecipe.id) {
                setRecipe(potentialRecipe);
                setErrMess(false);
            } else {
                setErrMess(true);
            }
        }
        handleGetRecipeById();

    }, [refreshCounter])

    return (
        <>
        {(errMess || !recipe.id) ?
        <p>There has been an error</p>
        :
        <div className="singleRecipeCard">
            <h1>{recipe.title}</h1>
            <h5>@{recipe.username}</h5>
            <div>{recipe.tags.map((tag) => {
                return (
                <p key={tag.id}><em>{tag.name}</em></p>
            )})}</div>
            <img src={recipe.imgurl} heigth="20%" width="25%"/>
            <h3>Ingredients:</h3>
                <ul>
                    {recipe.ingredients.map((ingredient) => {
                        return (
                            <li key={ingredient}>{ingredient}</li>
                        )
                    })}
                </ul>
            <h2>Instructions:</h2>
            <ol>
                {recipe.procedure.map((item) => {
                    return (
                    <li key={item}>{item}</li>
                    )})}
            </ol>
            <h3>Reviews:</h3>
            {!recipe.reviews.length ?
                <p>No reviews to show.</p>
            :
                <>
                    {recipe.reviews.map((review) => {
                        return (
                            <div key={review.id}>
                                <h4>{review.title}</h4>
                                <p>Rating: {review.rating}</p>
                                <p>By {review.user.username}</p>
                                <p>{review.content}</p>
                                <h5>Comments:</h5>
                                    {!review.comments.length ?
                                        <p>No comments to show.</p>
                                    :
                                    <>
                                        {review.comments.map((comment) => {
                                            return (
                                                <div key={comment.id}>
                                                    <p>{comment.content}</p>
                                                    <p>By {comment.user.username}</p>
                                                </div>
                                            )
                                        })}
                                    </>
                                    }                                 
                                    
                            </div>
                        )
                    })}
                </>
            }
         </div>
        }
        </>
    );
}
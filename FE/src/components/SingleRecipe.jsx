import { useState, useEffect } from 'react'
import {useParams, useNavigate} from 'react-router-dom'

export default function SingleRecipe ({token}) {
    const {recipeId} = useParams();
    const [errMess, setErrMess] = useState(false);
    const navigate = useNavigate();
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [recipe, setRecipe] = useState({});
    const [leavingAReview, setLeavingAReview] = useState(false);
    const [leavingAComment, setLeavingAComment] = useState(false);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [commentContent, setCommentContent] = useState('');

    const [commentErrMess, setCommentErrMess] = useState(false);
    const [reviewErrMess, setReviewErrMess] = useState(false);

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

   function leavingAReviewForm(){
        if (leavingAReview){
            return (
                <>
                <form onSubmit={handleCreateReview}>
                    <label>
                        Title: <input type='text' value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)}></input>
                    </label>
                    <label>
                        Rating: <select id="stars" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} name="stars">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                </select>
                    </label>
                    <label>
                        Content: <input type='text' value={reviewContent} onChange={(e) => setReviewContent(e.target.value)}></input>
                    </label>
                    <button>Submit</button>
                </form>
                </>
            )
        }
    }

    async function handleCreateReview(event){
            event.preventDefault();
            async function createReviewFetch(){
                try {
                    const response = await fetch(`http://localhost:3000/api/reviews/${recipe.id}`,
                    { 
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization" :`BEARER ${token}`
                        },
                        body: {
                            title: reviewTitle,
                            rating: reviewRating,
                            content: reviewContent
                        }
                    });
                    const json = await response.json();
                    return json;
                } catch (error) {
                    throw (error);
                }
            }

            const potentialReview = await createReviewFetch();
            if (potentialReview.id){
                setReviewErrMess(false);
                setRefreshCounter((prev) => prev + 1);
            } else {
                setReviewErrMess(true);
            }  
            
    }

    function leavingACommentForm(){
        if (leavingAComment){
            return (
                <>
                <form onSubmit={handleCreateComment}>
                    <label>
                        Content: <input type='text' value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></input>
                    </label>
                    <button>Submit</button>
                </form>
                </>
            )
        }
    }

    async function handleCreateComment(event, reviewId){
        event.preventDefault();
        async function createCommentFetch(reviewId){
            try {
                const response = await fetch(`http://localhost:3000/api/comments/${reviewId}`,
                { 
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization" :`BEARER ${token}`
                    },
                    body: {
                        content: commentContent
                    }
                });
                const json = await response.json();
                return json;
            } catch (error) {
                throw (error);
            }
        }

        const potentialComment = await createCommentFetch(reviewId);
        if (potentialComment.id){
            setCommentErrMess(false);
            setRefreshCounter((prev) => prev + 1);
        } else {
            setCommentErrMess(true);
        }
}

    return (
        <>
        {(errMess || !recipe.id) ?
        <p>There has been an error</p>
        :
        <div className="singleRecipeCard">
            <h1>{recipe.title}</h1>
            <h5>@{recipe.user.username}</h5>
            <div>{recipe.tags.map((tag) => {
                return (
                <p key={tag.id}><em>{tag.name}</em></p>
            )})}</div>
            <img src={recipe.imgurl} width="500px"/>
            <h2>Ingredients:</h2>
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
            {token ?
                <>
                    {!leavingAReview ?
                    <button onClick= {()=>setLeavingAReview(true)}>Leave a review</button>
                    :
                    <button onClick= {()=>setLeavingAReview(false)}>Close review form </button>
                    } 
                    {leavingAReviewForm()}
                </>
                
            :
                <button>Sign in to leave a review</button>
                    }
            <h2>Reviews:</h2>
            {!recipe.reviews.length ?
                <p>No reviews to show.</p>
            :
                <>
                    {recipe.reviews.map((review) => {
                        return (
                            <div key={review.id}>
                                <h4>{review.title}</h4>
                                <p>By {review.user.username}</p>
                                <p>Rating: {review.rating}</p>
                                <p>{review.content}</p>
                                {token ?
                                 <>
                                      {!leavingAComment ?
                                         <button onClick= {()=>setLeavingAComment(true)}>Leave a comment</button>
                                         :
                                         <button onClick= {()=>setLeavingAComment(false)}>Close comment form </button>
                                        } 
                                        {leavingACommentForm()}
                                 </>
                
                                :
                                <button>Sign in to leave a comment</button>
                                }
                                <h3>Comments:</h3>
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
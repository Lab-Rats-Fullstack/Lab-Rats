import { useState, useEffect, useInsertionEffect } from 'react'
import {useParams, useNavigate} from 'react-router-dom'

export default function SingleRecipe ({token}) {
    const navigate = useNavigate();
    const {recipeId} = useParams();
    const [errMess, setErrMess] = useState(false);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [recipe, setRecipe] = useState({});
    const [userId, setUserId] = useState(null);

    const [leavingAReview, setLeavingAReview] = useState(false);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewErrMess, setReviewErrMess] = useState(false);

    const [leavingAComment, setLeavingAComment] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [commentErrMess, setCommentErrMess] = useState(null);

    const [editingAReview, setEditingAReview] = useState(null);
    const [editReviewTitle, setEditReviewTitle] = useState('');
    const [editReviewRating, setEditReviewRating] = useState('');
    const [editReviewContent, setEditReviewContent] = useState('');
    const [editReviewErrMess, setEditReviewErrMess] = useState(null);

    const [editingAComment, setEditingAComment] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [editCommentErrMess, setEditCommentErrMess] = useState(null);

    const [reviewAreYouSure, setReviewAreYouSure] = useState(null);
    const [deleteReviewErrMess, setDeleteReviewErrMess] = useState(null);
    
    const [commentAreYouSure, setCommentAreYouSure] = useState(null);
    const [deleteCommentErrMess, setDeleteCommentErrMess] = useState(null);


 

    useEffect(() => {
        async function handleGetRecipeById(){
            async function handleGetRecipeFetch(){
                try{
                    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, 
                    { 
                        method: "GET",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    const json = await response.json();
                    return json;
                } catch (error) {
                    setErrMess(true);
                }
            }
    
            const potentialRecipe = await handleGetRecipeFetch();
            if (potentialRecipe.recipe) {
                setRecipe(potentialRecipe.recipe);
                setUserId(potentialRecipe.userId);
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
                            "Authorization" :`Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title: reviewTitle,
                            rating: reviewRating,
                            content: reviewContent
                        })
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
                setLeavingAReview(false);
            } else {
                setReviewErrMess(true);
            }  
            
    }

    function leavingACommentForm(reviewId){
        if (leavingAComment === reviewId){
            return (
                <>
                <form onSubmit={(event)=>handleCreateComment(event, reviewId)}>
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
                    body: JSON.stringify({
                        content: commentContent
                    })
                });
                const json = await response.json();
                return json;
            } catch (error) {
                throw (error);
            }
        }

        const potentialComment = await createCommentFetch(reviewId);
        if (potentialComment.id){
            setCommentErrMess(null);
            setRefreshCounter((prev) => prev + 1);
            setLeavingAComment(null);
        } else {
            setCommentErrMess(reviewId);
        }
}



function editingAReviewForm(reviewId){
    if (editingAReview === reviewId){
        return (
            <>
            <form onSubmit={(event) => handleEditReview(event, reviewId)}>
                <label>
                    Title: <input type='text' value={editReviewTitle} onChange={(e) => setEditReviewTitle(e.target.value)}></input>
                </label>
                <label>
                    Rating: <select id="stars" value={editReviewRating} onChange={(e) => setEditReviewRating(e.target.value)} name="stars">
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            </select>
                </label>
                <label>
                    Content: <input type='text' value={editReviewContent} onChange={(e) => setEditReviewContent(e.target.value)}></input>
                </label>
                <button>Submit</button>
            </form>
            </>
        )
    }
}

async function handleEditReview(event, reviewId){
    event.preventDefault();
    async function editReviewFetch(reviewId){
        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`,
            { 
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" :`BEARER ${token}`
                },
                body: JSON.stringify({
                    title: editReviewTitle,
                    rating: editReviewRating,
                    content: editReviewContent
                })
            });
            const json = await response.json();
            return json;
        } catch (error) {
            throw (error);
        }
    }

    const potentialEditReview = await editReviewFetch(reviewId);
    if (potentialEditReview.id){
        setEditReviewErrMess(null);
        setEditingAReview(null);
        setRefreshCounter((prev) => prev + 1);
    } else {
        setEditReviewErrMess(reviewId);
    }
}

function editingACommentForm(commentId){
    if (editingAComment === commentId){
        return (
            <>
            <form onSubmit={(event) => handleEditComment(event, commentId)}>
                <label>
                    Content: <input type='text' value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)}></input>
                </label>
                <button>Submit</button>
            </form>
            </>
        )
    }
}

async function handleEditComment(event, commentId){
    event.preventDefault();
    async function editCommentFetch(commentId){
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`,
            { 
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" :`BEARER ${token}`
                },
                body: JSON.stringify({
                    content: editCommentContent
                })
            });
            const json = await response.json();
            return json;
        } catch (error) {
            throw (error);
        }
    }

    const potentialEditComment = await editCommentFetch(commentId);
    if (potentialEditComment.id){
        setEditCommentErrMess(null);
        setEditingAComment(null);
        setRefreshCounter((prev) => prev + 1);
    } else {
        setEditCommentErrMess(commentId);
    }
}

async function handleDeleteReview(reviewId){
    async function deleteReviewFetch(reviewId){
        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`,
            { 
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" :`BEARER ${token}`
                },
            });
            const json = await response.json();
            return json;
        } catch (error) {
            throw (error);
        }
    }

    const potentialDeletedReview= await deleteReviewFetch(reviewId);
    if(potentialDeletedReview){
        setReviewAreYouSure(null);
        setDeleteReviewErrMess(null);
        setRefreshCounter((prev) => prev + 1);
    } else {
        setDeleteReviewErrMess(reviewId);
    }
}

async function handleDeleteComment(commentId){
    async function deleteCommentFetch(commentId){
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`,
            { 
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" :`BEARER ${token}`
                },
            });
            const json = await response.json();
            return json;
        } catch (error) {
            throw (error);
        }
    }

    const potentialDeletedComment= await deleteCommentFetch(commentId);
    if(potentialDeletedComment){
        setCommentAreYouSure(null);
        setDeleteCommentErrMess(null);
        setRefreshCounter((prev) => prev + 1);
    } else {
        setDeleteCommentErrMess(commentId);
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
                    <button onClick= {()=>{
                        setLeavingAReview(true);
                        setReviewTitle('');
                        setReviewRating(1);
                        setReviewContent('');
                    }}>Leave a review</button>
                    :
                    <button onClick= {()=>setLeavingAReview(false)}>Close review form </button>
                    } 
                    {leavingAReviewForm()}
                </>
                
            :
                <button onClick={()=>navigate('/login')}>Sign in to leave a review</button>
             }
            {reviewErrMess && <p>There has been an error submitting the review.</p>}
            <h2>Reviews:</h2>
            {!recipe.reviews.length ?
                <p>No reviews to show.</p>
            :
                <>
                    {recipe.reviews.map((review) => {
                        return (
                            <div key={review.id}>
                                <h3>{review.title}</h3>
                                <h5>By @{review.user.username}</h5>
                                <p>Rating: {review.rating}</p>
                                <p>{review.content}</p>
                                {token &&
                                 <>
                                    {(review.userid === userId) &&
                                    <>
                                        {(editingAReview === review.id) ?
                                        <>
                                            <button onClick={()=>setEditingAReview(null)}>Close edit review form</button>
                                            {editingAReviewForm(review.id)}
                                        </>
                                        :
                                        <>
                                            <button onClick={()=>{
                                                setEditingAReview(review.id);
                                                setEditReviewTitle(review.title);
                                                setEditReviewRating(review.rating);
                                                setEditReviewContent(review.content);
                                            }}>Edit your review</button>
                                        </>
                                        }
                                        {(editReviewErrMess === review.id) && <p>There has been an error submitting the edited review.</p>}
                                        {!(reviewAreYouSure=== review.id) ?
                                                <button onClick={()=>setReviewAreYouSure(review.id)}>Delete Review</button>
                                        :
                                            <>
                                                <p>Are you sure you want to delete this?</p>
                                                <button onClick={()=>handleDeleteReview(review.id)}>Yes</button>
                                                <button onClick={()=>setReviewAreYouSure(null)}>No</button>
                                            </>
                                        }
                                    
                                        {(deleteReviewErrMess === review.id) && <p>There has been an error deleting your review.</p>}
                                    </>
                                    }
                                 </>
                                }
                                
                                {token ?
                                 <>
                                      {!(leavingAComment === review.id) ?
                                         <button onClick= {()=>{
                                            setLeavingAComment(review.id);
                                            setCommentContent('');
                                        }}>Leave a comment</button>
                                         :
                                         <button onClick= {()=>setLeavingAComment(null)}>Close comment form </button>
                                        } 
                                        {leavingACommentForm(review.id)}
                                 </>
                
                                :
                                <button onClick={()=>navigate('/login')}>Sign in to leave a comment</button>
                                }
                                {(commentErrMess === review.id) && <p>There has been an error submitting the comment.</p>}
                                <h5>Comments:</h5>
                                    {!review.comments.length ?
                                        <p>No comments to show.</p>
                                    :
                                    <>
                                        {review.comments.map((comment) => {
                                            return (
                                                <div key={comment.id}>
                                                    <p>{comment.content}</p>
                                                    <h5>By @{comment.user.username}</h5>
                                                    {token &&
                                                    <>
                                                        {(comment.userid === userId) &&
                                                        <>
                                                            {(editingAComment === comment.id) ?
                                                            <>
                                                                <button onClick={()=>setEditingAComment(null)}>Close edit comment form</button>
                                                                {editingACommentForm(comment.id)}
                                                            </>
                                                            :
                                                            <>
                                                                <button onClick={()=>{
                                                                    setEditingAComment(comment.id);
                                                                    setEditCommentContent(comment.content);
                                                                 }}>Edit your comment</button>
                                                            </>
                                                            }
                                                            {(editCommentErrMess === comment.id) && <p>There has been an error submitting the edited comment.</p>}
                                                            {!(commentAreYouSure === comment.id) ?
                                                                <button onClick={()=>setCommentAreYouSure(comment.id)}>Delete Comment</button>
                                                            :
                                                            <>
                                                                <p>Are you sure you want to delete this?</p>
                                                                <button onClick={()=>handleDeleteComment(comment.id)}>Yes</button>
                                                                 <button onClick={()=>setCommentAreYouSure(null)}>No</button>
                                                            </>
                                                            }
                                                             {(deleteCommentErrMess === comment.id) && <p>There has been an error deleting your comment.</p>}
                                                        </>
                                                        }
                                                    </>
                                                     }
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
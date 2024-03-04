import React from 'react';
import NavButton from './NavButton';

export default function ReviewInfo ({comment}) {
return (
    <div className="commentCard" key={comment.id}>
        <p className="commentContent">Comment: {comment.content}</p>
        <p>On review {comment.review.title} for recipe {comment.recipe.title}</p>
        <NavButton location ={`/recipes/${comment.recipe.id}`} buttonText={"See Recipe"}/>
    </div>)
}
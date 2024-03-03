import React from 'react';
import NavButton from './NavButton';

export default function ReviewInfo ({token, comment}) {
return (
    <div className="commentCard" key={comment.id}>
        <h3>Comment: {comment.content}</h3>
        <p>On review {comment.review.title} for recipe {comment.recipe.title}</p>
        <NavButton location ={`/recipes/${comment.recipe.id}`} buttonText={"See Recipe"}/>
    </div>)
}
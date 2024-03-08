import React from 'react';
import NavButton from "./NavButton";

export default function CommentInfo ({comment}) {

    return (
        <div className="commentCard" key={comment.id}>
            <p className="commentContent">Comment: {comment.content}</p>
            <p>On review {comment.review.title} for recipe {comment.review.recipe.title}</p>
            <NavButton location ={`/recipes/${comment.review.recipe.id}`} buttonText={"See Recipe"}/>
        </div>)
}
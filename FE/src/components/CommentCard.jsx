import React from 'react';
import NavButton from "./NavButton";
import {Link} from "react-router-dom";

export default function CommentInfo ({comment, currentUser}) {

    return (
        <div className="commentCard" key={comment.id}>
            <p className="commentContent">Comment: {comment.content}</p>
            <p>On review {comment.review.title}</p>
            <p>by {(comment.review.user.username === currentUser) ?
                    <Link className="username"to={`/account`}>@{comment.review.user.username}</Link>
                     :
                    <Link className="username"to={`/users/${comment.review.user.id}`}>@{comment.review.user.username}</Link>
                    }</p>
            <p>for recipe {comment.review.recipe.title}</p>
            <p>by {(comment.review.recipe.user.username === currentUser) ?
                    <Link className="username"to={`/account`}>@{comment.review.recipe.user.username}</Link>
                     :
                    <Link className="username"to={`/users/${comment.review.recipe.user.id}`}>@{comment.review.recipe.user.username}</Link>
                    }</p>
            <NavButton location ={`/recipes/${comment.review.recipe.id}`} buttonText={"See Recipe"}/>
        </div>)
}
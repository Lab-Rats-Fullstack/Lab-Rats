import React from 'react';
import NavButton from "./NavButton";
import {Link} from "react-router-dom";

export default function ReviewInfo ({review, currentUser}) {

    return (
        <div className="reviewCard" key={review.id}>
            <p className="reviewTitle">Review: {review.title}</p>
            <p className="reviewContent">{review.content}</p>
            <p>for recipe {review.recipe.title}</p>
            <p>by {(review.recipe.user.username === currentUser) ?
                    <Link className="username"to={`/account`}>@{review.recipe.user.username}</Link>
                     :
                    <Link className="username"to={`/users/${review.recipe.user.id}`}>@{review.recipe.user.username}</Link>
                    }</p>
            <p>Rating: {review.rating}</p>
            <NavButton location ={`/recipes/${review.recipe.id}`} buttonText={"See Recipe"}/>
        </div>
    )
}
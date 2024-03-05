import React from 'react';
import NavButton from './NavButton';

export default function ReviewInfo ({review}) {

    return (
        <div className="reviewCard" key={review.id}>
            <p className="reviewTitle">Review: {review.title}</p>
            <p className="reviewContent">{review.content}</p>
            <p>for recipe {review.recipe.title}</p>
            <p>Rating: {review.rating}</p>
            <NavButton location ={`/recipes/${review.recipe.id}`} buttonText={"See Recipe"}/>
        </div>
    )
}
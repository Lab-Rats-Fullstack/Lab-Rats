import React from 'react';
import NavButton from './NavButton';

export default function ReviewInfo ({token, review}) {
    // console.log(review);
    // console.log(adminPriv);
    return (
        <div className="reviewCard" key={review.id}>
            <h3>Review: {review.content}</h3>
            <p>for recipe {review.recipe.title}</p>
            <p>Rating: {review.rating}</p>
            <NavButton location ={`/recipes/${review.recipe.id}`} buttonText={"See Recipe"}/>
        </div>
    )
}
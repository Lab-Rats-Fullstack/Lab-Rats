import React from 'react';
import ReviewCard from './ReviewCard';

export default function UserReviews ({userData, currentUser}) {
    const {reviews: reviewList=[]} = userData;
    return (
        <div className="userReviewContainer">
            <div className = 'userReviews'>
                <h2>Reviews</h2>
                {reviewList.map((review)=>{
                    return (
                        <ReviewCard key ={review.id} review = {review} currentUser={currentUser}/>
                    )
                })}
            </div>
        </div>
    )
}
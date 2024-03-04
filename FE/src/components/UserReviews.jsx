import React from 'react';
import ReviewCard from './ReviewCard';

export default function UserInfo ({userData}) {
    const {reviews: reviewList=[]} = userData;
    return (
        <div className="reviewContainer">
            <div className = 'userReviews'>
                <h2>My Reviews</h2>
                {reviewList.map((review)=>{
                    return (
                        <ReviewCard key ={review.id} review = {review}/>
                    )
                })}
            </div>
        </div>
    )
}
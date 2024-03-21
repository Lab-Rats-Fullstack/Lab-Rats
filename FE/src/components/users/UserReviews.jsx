import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import Pagination from '../general/Pagination';

export default function UserReviews ({userData, currentUser}) {
    const {reviews: reviewList=[]} = userData;
    const [currentCards, setCurrentCards] = useState([])
    return (
        <div className="userReviewContainer">
            <div>
                <Pagination
                Card={ReviewCard}
                cardArr={reviewList}
                currentCards={currentCards}
                setCurrentCards={setCurrentCards}
                cardType={"review"}
                numberPerPage={3}
                currentUser={currentUser}
                />
            </div>
        </div>
    )
}
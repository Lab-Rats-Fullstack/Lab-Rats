import React from "react";
import NavButton from "./NavButton";
import { Link } from "react-router-dom";
import AverageStars from "./AverageStars";

export default function ReviewInfo({ review, currentUser }) {
  return (
    <div className="reviewCard" key={review.id}>
      <p className="reviewTitle">Review: {review.title}</p>
      <p className="reviewContent">{review.content}</p>
      <Link className="reviewRecipeTitle" to={`/recipes/${review.recipe.id}`}>
        {review.recipe.title}
      </Link>
      <p className="cardUsername">
        by{" "}
        {review.recipe.user.username === currentUser ? (
          <Link to={`/account`}>@{review.recipe.user.username}</Link>
        ) : (
          <Link to={`/users/${review.recipe.user.id}`}>
            @{review.recipe.user.username}
          </Link>
        )}
      </p>
      <AverageStars starAverage={review.rating} />
      <NavButton
        location={`/recipes/${review.recipe.id}`}
        buttonText={"See Recipe"}
      />
    </div>
  );
}

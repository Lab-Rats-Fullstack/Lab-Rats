import React from "react";
import TagInfo from "./TagInfo";
import NavButton from "./NavButton";
import defaultImg from "../assets/default food.jpeg";

export default function RecipeInfo({ recipe, admin, currentUser, token}) {

  return (
    <div className="recipeCard">
      <img
        src={recipe.imgurl || defaultImg}
        alt={`A picture of ${recipe.title}`}
      />
      <p className="recipeTitle">{recipe.title}</p>
      {recipe.tags.map((tag) => {
        return <TagInfo key={tag.id} tag={tag} />;
      })}
      <p>Est. Time: {recipe.estimatedtime}</p>
      <NavButton location={`/recipes/${recipe.id}`} buttonText={"See Recipe"} />
      {admin ? (<NavButton
        location={`/recipes/${recipe.id}/edit`}
        buttonText={"Edit Recipe"}
      />) : (<></>)}
      {/* need to make this conditional on being admin and tier 2 currentUser if username matches */}
    </div>
  );
}

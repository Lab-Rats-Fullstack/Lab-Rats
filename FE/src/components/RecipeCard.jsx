import React from "react";
import TagInfo from "./TagInfo";
import NavButton from "./NavButton";
import defaultImg from "../assets/default food.jpeg";
import {Link} from "react-router-dom";
import AverageStars from "./AverageStars";


export default function RecipeInfo({ recipe, admin, currentUser}) {

  return (
    <div className="recipeCard">
      <img
        src={recipe.imgurl || defaultImg}
        alt={`A picture of ${recipe.title}`}
      />
      <Link className="recipeTitle" to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
      {recipe.user && 
        <>
          {(recipe.user.username === currentUser) ?
          <Link className="username"to={`/account`}>@{recipe.user.username}</Link>
           :
          <Link className="username"to={`/users/${recipe.user.id}`}>@{recipe.user.username}</Link>
           }
        </>
      }
      {recipe.tags.map((tag) => {
        return <TagInfo key={tag.id} tag={tag} />;
      })}
      {recipe.esttime &&  <p>Est. Time: {recipe.esttime}</p>}
      {recipe.avgRating ?
        <AverageStars starAverage={recipe.avgRating}/>
        :
        <p>This recipe has not yet been reviewed.</p>
      }
      <NavButton location={`/recipes/${recipe.id}`} buttonText={"See Recipe"} />
      {admin ? (<NavButton
        location={`/recipes/${recipe.id}/edit`}
        buttonText={"Edit Recipe"}
      />) : (<></>)}
    </div>
  );
}

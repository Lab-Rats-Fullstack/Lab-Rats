import React from 'react';
import TagInfo from './TagInfo';
import NavButton from './NavButton';

export default function RecipeInfo ({recipe, admin, currentUser}) {

    return (
        <div className="recipeCard">
            <img src={recipe.imgurl} alt={`A picture of ${recipe.title}`}/>
            <p className ="recipeTitle">{recipe.title}</p>
            <p className="recipeUsername">{recipe.username}</p>
            {recipe.tags.map((tag)=> {         
                return (
                    <TagInfo key={tag.id} tag = {tag} />
                )
            })}
            <p>Est. Time: {recipe.estimatedtime}</p>
            <NavButton location ={`/recipes/${recipe.id}`} buttonText={"See Recipe"}/>
            <NavButton location ={`/recipes/${recipe.id}/edit`} buttonText={"Edit Recipe"}/>
            {/* need to make this conditional on being admin and tier 2 currentUser if username matches */}
        </div>
    )
}
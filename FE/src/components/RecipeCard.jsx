import React from 'react';
import TagInfo from './TagInfo';
import NavButton from './NavButton';

export default function RecipeInfo ({token, recipe}) {
    // console.log(recipe);
    // console.log(adminPriv);
    return (
        <div className="recipeCard">
            <img src={recipe.imgurl} alt={`A picture of ${recipe.title}`} height="15%" width="22.5%"/>
            <h3>{recipe.title}</h3>
            {token == null && <p>{userData.username}</p>}
            {recipe.tags.map((tag)=> {         
                return (
                    <TagInfo key={tag.id} tag = {tag} />
                )
            })}
            <p>Est. Time: {recipe.estimatedtime}</p>
            <NavButton location ={`/recipes/${recipe.id}`} buttonText={"See Recipe"}/>
            <NavButton location ={`/recipes/${recipe.id}/edit`} buttonText={"Edit Recipe"}/>
        </div>
    )
}
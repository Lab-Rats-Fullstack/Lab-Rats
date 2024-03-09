import React from 'react';
import RecipeCard from './RecipeCard';
import NavButton from "./NavButton";

export default function UserRecipes ({userData, admin, currentUser}) {

    const {recipes: recipeList =[]} = userData;
    return (
        <div className="recipesContainer">
            <div className = 'userRecipes'>
                <h2>Recipes</h2>
                {admin === true && currentUser === userData.username &&(
                   <NavButton location={`/recipes/new`} buttonText={"Create Recipe"} /> 
                )}
                {recipeList.map((recipe)=>{
                    return (
                        <RecipeCard key={recipe.id} recipe = {recipe} admin={admin} currentUser={currentUser}/>
                    )
                })}
            </div>
        </div>
    )
}
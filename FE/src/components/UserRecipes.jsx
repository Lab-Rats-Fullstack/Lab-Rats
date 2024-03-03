import React from 'react';
import RecipeCard from './RecipeCard';

export default function UserInfo ({token, adminPriv, userData}) {
    // console.log(userData);
    // console.log(adminPriv);
    const {recipes: recipeList =[]} = userData;
    return (
        <div className="recipesContainer">
            <div className = 'userRecipes'>
                <h2>My Recipes</h2>
                {recipeList.map((recipe)=>{
                    return (
                        <RecipeCard key={recipe.id} recipe = {recipe} token={token}/>
                    )
                })}
            </div>
        </div>
    )
}
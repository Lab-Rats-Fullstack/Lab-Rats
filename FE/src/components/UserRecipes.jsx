import { useState } from "react";
import RecipeCard from "./RecipeCard";
import NavButton from "./NavButton";
import Pagination from "./Pagination";

export default function UserRecipes({ userData, admin, currentUser }) {
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const { recipes: recipeList = [] } = userData;
  return (
    <div className="recipesContainer">
      <div className="userRecipes">
        <h2>Recipes</h2>
        {admin === true && currentUser === userData.username && (
          <NavButton location={`/recipes/new`} buttonText={"Create Recipe"} />
        )}
        <Pagination
          recipeList={recipeList}
          currentRecipes={currentRecipes}
          setCurrentRecipes={setCurrentRecipes}
          numberPerPage={5}
          admin={admin}
          currentUser={currentUser}
          token={null}
        />
      </div>
    </div>
  );
}

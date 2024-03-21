import { useState } from "react";
import NavButton from "../general/NavButton";
import RecipePagination from "../general/RecipePagination";

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
        <RecipePagination
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

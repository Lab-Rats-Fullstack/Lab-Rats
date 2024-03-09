import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

export default function Pagination({
  recipeList,
  currentRecipes,
  setCurrentRecipes,
  numberPerPage,
  admin,
  currentUser,
  token,
}) {
  const [numberOfPages, setNumberofPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  function determineNumberOfPages(arr) {
    return Math.ceil(arr.length / numberPerPage);
  }

  function splitRecipesIntoPages() {
    const pages = determineNumberOfPages(recipeList);
    setNumberofPages(pages);
  }

  function sliceRecipes(arr) {
    const start = (currentPage - 1) * numberPerPage;
    const end = start + numberPerPage;
    console.log(start, end);
    const currentPageRecipes = arr.slice(start, end);
    setCurrentRecipes(currentPageRecipes);
  }

  function CreatePageButtons() {
    const arr = new Array(numberOfPages).fill(0);
    return (
      <div>
        {arr.length > 1 ? (
          arr.map((item, idx) => {
            return (
              <button onClick={() => setCurrentPage(idx + 1)} key={idx}>
                {idx + 1}
              </button>
            );
          })
        ) : (
          <></>
        )}
      </div>
    );
  }

  useEffect(() => {
    splitRecipesIntoPages();
  }, [numberOfPages, currentPage]);
  useEffect(() => sliceRecipes(recipeList), [currentPage]);

  return (
    <div>
      {currentRecipes.map((recipe) => {
        return (
          <RecipeCard
            recipe={recipe}
            admin={admin}
            currentUser={currentUser}
            token={token}
            key={recipe.id}
          />
        );
      })}
      <CreatePageButtons />
    </div>
  );
}

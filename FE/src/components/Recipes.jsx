import { useEffect } from "react";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipesPageTabs from "./RecipesPageTabs";
import Loading from "./Loading";
import Pagination from "./Pagination";

export default function Recipes({ token, currentUser, admin }) {
  const API = "http://localhost:3000/api/";
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);

  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => console.log(selectedTags), [selectedTags]);

  useEffect(() => {
    async function getAllRecipes() {
      try {
        const response = await fetch(`${API}recipes`);
        const result = await response.json();
        setRecipes(result);
      } catch (error) {
        console.error(error);
      }
    }
    getAllRecipes();
    console.log(recipes);
  }, []);

  function changeSearch(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    const filter = recipes.filter((recipe) => {
      const { title, tags } = recipe;
      const name = tags.map((tag) => {
        return tag.name;
      });
      const tagsList = name.join("");
      const search = searchTerm.toLowerCase();
      return (
        title.toLowerCase().includes(search) ||
        tagsList.toLowerCase().includes(search)
      );
    });
    setFilteredRecipes(filter);
  }, [searchTerm, recipes]);

  useEffect(() => {
    const filter = recipes.filter((recipe) => {
      const { tags } = recipe;
      const name = tags.map((tag) => {
        return tag.name;
      });
      const tagsList = name.join("");
      const search = selectedTags.join("").toLowerCase();
      return tagsList.toLowerCase().includes(search);
    });
    setFilteredRecipes(filter);
  }, [selectedTags, recipes]);

  useEffect(() => {
    async function getAllTags() {
      try {
        const response = await fetch(`${API}tags`);
        const result = await response.json();
        setTags(result.rows);
      } catch (error) {
        console.error(error);
      }
    }
    getAllTags();
  }, []);

  useEffect(() => {
    if (recipes.length !== 0) setLoading(false);
  }, [recipes]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="recipesContainer">
          <div className="searchContainer">
            <label htmlFor="search-bar">
              Search Recipes:
              <input
                className="searchBar"
                type="text"
                value={searchTerm}
                onChange={changeSearch}
              />
            </label>
            <RecipesPageTabs tags={tags} setSelectedTags={setSelectedTags} />
          </div>
          {filteredRecipes ? (
            filteredRecipes.length >= 1 ? (
              <Pagination
                recipeList={filteredRecipes}
                currentRecipes={currentRecipes}
                setCurrentRecipes={setCurrentRecipes}
                numberPerPage={5}
                admin={admin}
                currentUser={currentUser}
                token={token}
              />
            ) : (
              <p>No recipes match your search</p>
            )
          ) : (
            recipes.map((recipe) => {
              return (
                <div key={recipe.id}>
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    token={token}
                    currentUser={currentUser}
                    admin={admin}
                  />
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
}

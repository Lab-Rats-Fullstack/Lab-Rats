import { useEffect } from "react";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipesPageTabs from "./RecipesPageTabs";

export default function Recipes({ token, currentUser, admin }) {
  const API = "http://localhost:3000/api/";
  const [recipes, setRecipes] = useState([]);

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchFilter, setSearchFilter] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
    setSearchFilter(filter);
  }, [searchTerm, recipes]);

  useEffect(() => {
    if (selectedTags.length == 0){
      setFilteredRecipes(searchFilter);
    }else{
      const tagNames = selectedTags.map((tag) => {
        return tag.toLowerCase();
      })
      let tagFilter = searchFilter;
      tagNames.forEach((tagName) => {
        tagFilter = tagFilter.filter((recipe) => {
          const foundRecipe = recipe.tags.find((tag) => {
            return (tag.name.toLowerCase() === tagName);
          })
          return foundRecipe;
        });
      });
      setFilteredRecipes(tagFilter);
    }
  }, [selectedTags, recipes, searchFilter]);

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

  return (
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
      <RecipesPageTabs tags={tags} setSelectedTags={setSelectedTags}/>
      </div>
      {filteredRecipes ? (
        filteredRecipes.length >= 1 ? (
          filteredRecipes.map((recipe) => {
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
  );
}

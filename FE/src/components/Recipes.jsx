import { useEffect } from "react";
import { useState } from "react";
import RecipeCard from './RecipeCard';


export default function Recipes({token, currentUser, admin}) {
  const testAPI = 'http://localhost:3000/api/';
  const API = 'https://culinary-chronicle.onrender.com/api/';
  const [recipes, setRecipes] = useState([]);

  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getAllRecipes() {
      try{
        const response = await fetch(`${testAPI}recipes`);
        const result = await response.json();
        setRecipes(result);
      } catch(error) {
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
      const name = tags.map((tag) => tag.name);
      const tagsList = name.join("");
      const search = searchTerm.toLowerCase();
      return (
        title.toLowerCase().includes(search) ||
        tagsList.toLowerCase().includes(search)
      );
    });
    setFilteredRecipes(filter);
  }, [searchTerm, recipes]);

  return (
    <div className="recipesContainer">
      <label htmlFor="search-bar">
        Search Recipes:
        <input
          className="searchBar"
          type="text"
          value={searchTerm}
          onChange={changeSearch}
        />
      </label>
      {filteredRecipes ? (
        filteredRecipes.length >= 1 ? (
          filteredRecipes.map((recipe) => {
            return (
              <div key={recipe.id}>
                <RecipeCard key={recipe.id} recipe={recipe} token={token} currentUser={currentUser} admin={admin}/>
              </div>
            );
          })
        ) : (<p>No recipes match your search</p>)
      ) : (
        recipes.map((recipe) => {
          return (
            <div key={recipe.id}>
              <RecipeCard key={recipe.id} recipe={recipe} token={token} currentUser={currentUser} admin={admin}/>
            </div>
          )
        })
      )}
    </div>
  );
}

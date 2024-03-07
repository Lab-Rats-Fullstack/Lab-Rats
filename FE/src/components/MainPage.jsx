import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import Tabs from "./Tabs";

export default function MainPage({ token }) {
  const [recipes, setRecipes] = useState([]);
  const [featRecipe, setFeatRecipe] = useState({});
  const [tags, setTags] = useState([]);
  const [tagsOutput, setTagsOutput] = useState([]);
  const API = "https://culinary-chronicle.onrender.com/api";
  const navigate = useNavigate();

  useEffect(() => {
    async function getRecipes() {
      try {
        const response = await fetch(`${API}/recipes/`);
        const result = await response.json();
        return result;
      } catch (error) {
        console.error(error);
      }
    }

    async function setState() {
      const someVar = await getRecipes();
      if (someVar) {
        setRecipes(someVar);
      }
    }

    setState();
  }, []);

  useEffect(() => {
    function selectRecipe(array) {
      let randIndex = Math.floor(Math.random() * (array.length - 1));
      let randRecipe = array[randIndex];
      return randRecipe;
    }

    let randRecipeState = selectRecipe(recipes);
    setFeatRecipe(randRecipeState);
  }, [recipes]);

  useEffect(() => {
    async function getTags() {
      try {
        const response = await fetch(`${API}/tags`);
        const result = await response.json();
        setTags(result.rows);
      } catch (error) {
        console.error(error);
      }
    }
    getTags();
  }, []);

  useEffect(() => {
    function rearrange(input, field) {
      let output = [];
      for (let i = 0; i < input.length; i++) {
        output.push(input[i][field]);
      }
      return output;
    }

    let rearrTags = rearrange(tags, "name");
    setTagsOutput(rearrTags);
  }, [tags]);

  function handleTagsClick(e) {
    e.preventDefault();
    let tagFromButton = e.target.value;
    navigate(`/tags/${tagFromButton}/recipes`);
  }

  return (
    <div className="mainPageContainer">
      {" "}
      <Tabs tagsOutput={tagsOutput} handleTagsClick={handleTagsClick} />
      {recipes && featRecipe && featRecipe.tags ? (
        <div className="recipesContainer">
          <RecipeCard key={featRecipe.id} recipe={featRecipe} />
        </div>
      ) : (
        <div>error</div>
      )}
    </div>
  );
}

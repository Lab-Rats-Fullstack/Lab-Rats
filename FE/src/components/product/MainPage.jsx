import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RecipeCard from "../general/RecipeCard";
import Tabs from "../general/Tabs";
import Loading from "../general/Loading";

export default function MainPage({ token, currentUser }) {
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="mainPageContainer">
          {" "}
          <Tabs tagsOutput={tagsOutput} handleTagsClick={handleTagsClick} />
          {recipes && featRecipe && featRecipe.tags ? (
            <div className="recipesContainer">
              <h2 className="featured">Featured Recipe</h2>
              <RecipeCard
                key={featRecipe.id}
                recipe={featRecipe}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <div>error</div>
          )}
        </div>
      )}
    </>
  );
}

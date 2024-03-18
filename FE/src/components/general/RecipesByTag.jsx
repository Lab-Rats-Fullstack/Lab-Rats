import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import RecipePagination from "./RecipePagination";

export default function RenderRecipesByTag({admin}) {
  const [loading, setLoading] = useState(true);
  const API = "https://culinary-chronicle.onrender.com/api";
  const [recipeList, setRecipeList] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const { tagname } = useParams();

  useEffect(() => {
    async function getRecipesByTag() {
      try {
        const response = await fetch(`${API}/tags/` + tagname + `/recipes`);
        const result = await response.json();
        setRecipeList(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getRecipesByTag();
  }, [tagname]);

  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <div className="recipesContainer">
          <RecipePagination
            recipeList={recipeList}
            currentRecipes={currentRecipes}
            setCurrentRecipes={setCurrentRecipes}
            numberPerPage={3}
            admin={admin}
            currentUser={{}}
            token={null}
          />
        </div>
      )}
    </>
  );
}

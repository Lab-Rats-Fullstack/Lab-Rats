import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Pagination from "./Pagination";

export default function RenderRecipesByTag() {
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:3000/api";
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
          <Pagination
            recipeList={recipeList}
            currentRecipes={currentRecipes}
            setCurrentRecipes={setCurrentRecipes}
            numberPerPage={3}
            admin={false}
            currentUser={{}}
            token={null}
          />
          ;
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecipeCard from './RecipeCard'

export default function renderRecipesByTag() {
    const API = "http://localhost:3000/api";
    const [recipeList, setRecipeList] = useState([]);
    const { tagname } = useParams();

    useEffect(() => {
        async function getRecipesByTag() {
            try {
                const response = await fetch(`${API}/tags/` + tagname + `/recipes`);
                const result = await response.json();
                setRecipeList(result);
            } catch(error) {
                console.error(error);
            }
        }
        getRecipesByTag();
    },[])

    return (
        <div>
             {recipeList.map((recipe) => {
               return (
                   <RecipeCard key={recipe.id} recipe={recipe}/>
               )})};
        </div>
    )
}
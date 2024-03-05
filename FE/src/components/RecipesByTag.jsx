import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function renderRecipesByTag() {
    const API = "http://localhost:3000/api";
    const [recipeList, setRecipeList] = useState([]);
    const { tagname } = useParams();

    console.log(tagname);
    useEffect(() => {
        async function getRecipesByTag() {
            try {
                const response = await fetch(`${API}/tags/` + tagname + `/recipes`);
                const result = await response.json();
                setRecipeList(result.recipes);
            } catch(error) {
                console.error(error);
            }
        }
        getRecipesByTag();
    },[])

    return (
        <div>
            <p>hello from { tagname } recipes</p>
            {/* {recipeList.map((recipe) => {
               return (
                   <div className="recipeCard" key={recipe.id}>
                       <h2>{recipe.title}</h2>
                       <h4>{recipe.userName}</h4>
                       <img src={recipe.imgUrl} alt={`A picture of ${recipe.title}`} height="15%" width="22.5%"/>
                       <p><em>{recipe.tags}</em></p>
                       <p>Est. Time: {recipe.estimatedTime}</p>
                       <button onClick={() => {
                           navigate(`/recipes/${recipe.id}`)
                       }}>See Recipe</button>
                   </div>
               )})};  commented out bc it doesn't work without get call*/}
        </div>
    )
}
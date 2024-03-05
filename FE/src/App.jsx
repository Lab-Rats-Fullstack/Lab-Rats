import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MainPage from "./components/MainPage";
import Recipes from "./components/Recipes";
import SingleRecipe from "./components/SingleRecipe";
import NewRecipe from "./components/NewRecipe";
import EditRecipe from "./components/EditRecipe";
import Login from "./components/Login";
import Account from "./components/Account";
import Admin from "./components/Admin";

function App() {
  const [token, setToken] = useState(null);

  const [admin, setAdmin] = useState(false);

  return (
    <><h1>Hello Lab Rats</h1>
    <NavBar token= {token} setToken={setToken} admin={admin}/>
    <Routes>
      <Route path ="/" element={<MainPage token ={token}/>}></Route>
      <Route path ="/recipes" element={<Recipes token ={token}/>}></Route>
      <Route path ="/recipes/:recipeId" element={<SingleRecipe token ={token}/>}></Route>
      <Route path ="/recipes/:recipeId/edit" element={<EditRecipe token ={token}/>}></Route>
      <Route path ="/recipes/new" element={<NewRecipe token ={token}/>}></Route>
      <Route path ="/login" element={<Login token ={token} setToken ={setToken} setAdmin={setAdmin}/>}></Route>
      <Route path ="/account" element={<Account token ={token}/>}></Route>
      <Route path ="/admin" element={<Admin token ={token}/>}></Route>
    </Routes>
    </>
  );
}

export default App;

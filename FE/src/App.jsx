import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/general/NavBar";
import MainPage from "./components/product/MainPage";
import Recipes from "./components/product/Recipes";
import SingleRecipe from "./components/product/SingleRecipe";
import NewRecipe from "./components/product/NewRecipe";
import EditRecipe from "./components/product/EditRecipe";
import Login from "./components/users/Login";
import Account from "./components/users/Account";
import UserProfile from "./components/users/UserProfile";
import Admin from "./components/users/Admin";
import RecipesByTag from "./components/general/RecipesByTag";

function App() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  return (
    <>
      <h1>Culinary Chronicle</h1>
      <NavBar
        token={token}
        setToken={setToken}
        admin={admin}
        setAdmin={setAdmin}
        setCurrentUser={setCurrentUser}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<MainPage token={token} currentUser={currentUser} admin={admin}/>}
          ></Route>

          <Route
            path="/recipes"
            element={
              <Recipes token={token} currentUser={currentUser} admin={admin} />
            }
          ></Route>
          <Route
            path="/recipes/:recipeId"
            element={
              <SingleRecipe
                token={token}
                admin={admin}
                currentUser={currentUser}
              />
            }
          ></Route>
          <Route
            path="/recipes/:recipeId/edit"
            element={<EditRecipe token={token} admin={admin} />}
          ></Route>
          <Route
            path="/tags/:tagname/recipes"
            element={<RecipesByTag admin={admin}/>}
          ></Route>
          <Route
            path="/recipes/new"
            element={<NewRecipe token={token} admin={admin} />}
          ></Route>
          <Route
            path="/login"
            element={
              <Login
                token={token}
                setToken={setToken}
                setAdmin={setAdmin}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="/account/*"
            element={
              <Account token={token} admin={admin} currentUser={currentUser} />
            }
          ></Route>
          <Route
            path="/users/:userId/*"
            element={
              <UserProfile
                token={token}
                admin={admin}
                currentUser={currentUser}
              />
            }
          ></Route>
          <Route
            path="/admin"
            element={
              <Admin token={token} admin={admin} currentUser={currentUser} />
            }
          ></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;

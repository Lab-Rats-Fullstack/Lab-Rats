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
import UserProfile from "./components/UserProfile";
import Admin from "./components/Admin";
import RecipesByTag from "./components/RecipesByTag";

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
            element={<MainPage token={token} currentUser={currentUser} />}
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
            element={<EditRecipe token={token} />}
          ></Route>
          <Route
            path="/tags/:tagname/recipes"
            element={<RecipesByTag />}
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

import { useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import MainPage from './components/MainPage'
import Recipes from './components/Recipes'
import SingleRecipe from './components/SingleRecipe'
import NewRecipe from './components/NewRecipe'
import EditRecipe from './components/EditRecipe'
import Login from './components/Login'
import Account from './components/Account'
import UserRecipes from './components/UserRecipes'
import UserReviews from './components/UserReviews'
import UserComments from './components/UserComments'
import UserProfile from './components/UserProfile'
import Admin from './components/Admin'

function App() {
  const [token, setToken] = useState(null)

  return (
    <><h1>Hello Lab Rats</h1>
    <NavBar token= {token} setToken={setToken}/>
    <Routes>
      <Route path ="/" element={<MainPage token ={token}/>}></Route>
      <Route path ="/recipes" element={<Recipes token ={token}/>}></Route>
      <Route path ="/recipes/:recipeId" element={<SingleRecipe token ={token}/>}></Route>
      <Route path ="/recipes/:recipeId/edit" element={<EditRecipe token ={token}/>}></Route>
      <Route path ="/recipes/new" element={<NewRecipe token ={token}/>}></Route>
      <Route path ="/login" element={<Login token ={token} setToken ={setToken}/>}></Route>
      <Route path ="/account" element={<Account token ={token}/>}>
        <Route path="recipes" element={<UserRecipes/>}/>
        <Route path="reviews" element={<UserReviews/>}/>
        <Route path="comments" element={<UserComments/>}/>
      </Route>
      <Route path ="/users/:userId" element={<UserProfile token ={token}/>}>
        <Route path="recipes" element={<UserRecipes/>}/>
        <Route path="reviews" element={<UserReviews/>}/>
        <Route path="comments" element={<UserComments/>}/>
      </Route>
      <Route path ="/admin" element={<Admin token ={token}/>}></Route>
    </Routes>
    </>
  )
}

export default App;

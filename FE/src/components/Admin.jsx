import {useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AverageStars from './AverageStars'
import altImg from "../assets/Default_pfp.jpeg"
import RecipeInfo from './RecipeCard';
import NavButton from "./NavButton";
const API = "http://localhost:3000/api/";

export default function Admin({ token, admin, currentUser }) {
  const [allUsers, setAllUsers] = useState(true);
  const [reviewedRecipes, setReviewedRecipes] = useState(false);
  const [recipeTags, setrecipeTags] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [reviewedRecipesList, setReviewedRecipesList] = useState([]);
  const [tagsList, setTagsList] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function signIn() {
    navigate("/login");
  }

  useEffect(() => {
    async function allReviewedRecipesFetch() {
      async function allReviewedRecipesCheck() {
        try {
          const response = await fetch(`${API}recipes/reviewedRecipes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          return result;
        } catch (error) {
          setError(error.message);
          throw error;
        }
      }

      const potentialReviewedRecipes = await allReviewedRecipesCheck();

      if (potentialReviewedRecipes.length > 0) {
        setReviewedRecipesList(potentialReviewedRecipes);
      } else {
        setError("No Recipes.");
      }
    }

    allReviewedRecipesFetch();
  }, []);

  useEffect(() => {
    async function allTagsFetch() {
      async function allTagsCheck() {
        try {
          const response = await fetch(`${API}tags`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          return result;
        } catch (error) {
          setError(error.message);
          throw error;
        }
      }

      const potentialAllTags = await allTagsCheck();
      if (potentialAllTags.rows.length > 0) {
        setTagsList(potentialAllTags.rows);
      } else {
        setError("No Tags.");
      }
    }
    allTagsFetch();
  }, []);

  useEffect(() => {
    async function allUsersFetch() {
      async function allUsersCheck() {
        try {
          const response = await fetch(`${API}users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();
          return result;
        } catch (error) {
          setError(error.message);
          throw error;
        }
      }

      const potentialAllUsers = await allUsersCheck();
      if (potentialAllUsers.users.length > 0) {
        setUsersList(potentialAllUsers.users);
      } else {
        setError("No Users.");
      }
    }
    allUsersFetch();
  }, []);

  return (
    <>
      {!token ? (
        <div className="fail">
          <h2>Please Sign In</h2>
          <br />{" "}
          <button type="login" onClick={signIn}>
            Log In
          </button>
        </div>
      ) : (
        <>
          {!admin ? (
            <p>Only admin are granted access to this page.</p>
          ) : (
            <>
              <div className="wrapper">
                <NavButton
                  location={"/recipes/new"}
                  buttonText={"Create New Recipe"}
                />
                <div className="adminNav">
                  <button
                    onClick={() => {
                      setAllUsers(true);
                      setReviewedRecipes(false);
                      setrecipeTags(false);
                    }}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => {
                      setAllUsers(false);
                      setReviewedRecipes(true);
                      setrecipeTags(false);
                    }}
                  >
                    Reviewed Recipes
                  </button>
                  <button
                    onClick={() => {
                      setAllUsers(false);
                      setReviewedRecipes(false);
                      setrecipeTags(true);
                    }}
                  >
                    Recipe Tags
                  </button>
                </div>
                {error ? (
                  <p>{error}</p>
                ) : (
                  <div>
                    {allUsers && (
                      <div className="allUsers">
                        <h2>All Users</h2>
                        {usersList.map((user) => {
                          return (
                            <div className="userCard" key={user.id}>
                              <img
                                src={user.imgurl || altImg}
                                alt={`User account image for ${user.username}`}
                              />
                              <h3>Username:</h3>
                              {user.username === currentUser ? (
                                <Link className="username" to={`/account`}>
                                  @{user.username}
                                </Link>
                              ) : (
                                <Link
                                  className="username"
                                  to={`/users/${user.id}`}
                                >
                                  @{user.username}
                                </Link>
                              )}
                              <p>Name: {user.name}</p>
                              <p>Email: {user.email}</p>
                              <p>Review count: {user.reviewcount}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {reviewedRecipes && (
                      <div className="reviewedRecipes">
                        <h2>All Reviewed Recipes</h2>
                        {reviewedRecipesList.map((reviewedRecipe) => {
                          return (
                            <div
                              className="reviewedRecipeCard"
                              key={reviewedRecipe.id}
                            >
                              <h3>{reviewedRecipe.title}</h3>
                              {reviewedRecipe.user.username === currentUser ? (
                                <Link className="username" to={`/account`}>
                                  @{reviewedRecipe.user.username}
                                </Link>
                              ) : (
                                <Link
                                  className="username"
                                  to={`/users/${reviewedRecipe.user.id}`}
                                >
                                  @{reviewedRecipe.user.username}
                                </Link>
                              )}
                              <div className="averageRating">
                                {reviewedRecipe.avgRating ? (
                                  <AverageStars
                                    starAverage={reviewedRecipe.avgRating}
                                  />
                                ) : (
                                  <p>This recipe has not yet been reviewed.</p>
                                )}
                              </div>
                              <img
                                src={reviewedRecipe.imgurl}
                                alt={`A picture of ${reviewedRecipe.title}`}
                              />
                              {reviewedRecipe.tags.map((tag) => {
                                return (
                                        <RecipeInfo key={reviewedRecipe.id} recipe={reviewedRecipe} admin={admin} currentUser={currentUser}/>
                                )
                            })}
                        </div>}
                        {recipeTags &&
                                <div className ="allTags">
                                    {tagsList.map((tag)=>{
                                        return(
                                            <div className='tag' key ={tag.id}>
                                                <p>{tag.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                    </div>
                        }
                        
                    </div>
                </>
            }
        </>
      )}
    </>
  );
}

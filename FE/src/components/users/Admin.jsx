import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import altImg from "../../assets/Default_pfp.jpeg";
import Pagination from "../general/Pagination";
import Loading from "../general/Loading";

const API = "https://culinary-chronicle.onrender.com/api/";

export default function Admin({ token, admin, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState(true);
  const [reviewedRecipes, setReviewedRecipes] = useState(false);
  const [currentRecipes, setCurrentRecipes] = useState([]);
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
        setLoading(false);
      } else {
        setError("No Users.");
      }
    }
    allUsersFetch();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {" "}
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
                  <div className="adminWrapper">
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
                                  {user.admin ?
                                  <p>Admin Status: Admin</p>
                                  :
                                  <p>Admin Status: User</p>
                                  }
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {reviewedRecipes && (
                          <div className="reviewedRecipes">
                            <h2>All Reviewed Recipes</h2>
                            <Pagination
                              recipeList={reviewedRecipesList}
                              currentRecipes={currentRecipes}
                              setCurrentRecipes={setCurrentRecipes}
                              numberPerPage={3}
                              admin={admin}
                              currentUser={currentUser}
                              token={token}
                            />
                          </div>
                        )}
                        {recipeTags && (
                          <div className="allTags">
                            {tagsList.map((tag) => {
                              return (
                                <div className="tag" key={tag.id}>
                                  <p>{tag.name}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

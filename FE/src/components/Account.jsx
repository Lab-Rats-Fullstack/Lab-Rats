import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";
import UserReviews from "./UserReviews";
import UserComments from "./UserComments";
import NavButton from "./NavButton";

const API = "http://localhost:3000/api/";

export default function Account({ token, admin, currentUser }) {
  const [userData, setUserData] = useState({});
  const {
    recipes: recipeList = [],
    reviews: reviewList = [],
    comments: commentList = [],
  } = userData;

  const [error, setError] = useState(null);
  const [fail, setFail] = useState(true);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);

  const [updatedUser, setUpdatedUser] = useState({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [buttonStatus, setButtonStatus] = useState(true);
  const [userForm, setUserForm] = useState(false);
  const [userBio, setUserBio] = useState(true);

  useEffect(() => {
    async function userCheck() {
      try {
        const response = await fetch(`${API}users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log(result);
        if (token !== null) {
          setUserData(result);
          setFail(false);
        } else {
          setFail(true);
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
    userCheck();
  }, [update]);

  async function signIn() {
    navigate("/login");
  }

  async function userUpdate(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API}users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedUser,
          password,
        }),
      });
      const result = await response.json();
      setUserData(result);
      setUpdate((version) => version + 1);
      setUserForm(false);
      setUserBio(true);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    async function enableButton() {
      try {
        if (password == confirmPassword) {
          setButtonStatus(false);
        } else {
          setButtonStatus(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    enableButton();
  }, [password, confirmPassword]);

  return (
    <>
      <p>This is the Account page</p>
      <div className="wrapper">
        {error && <p>{error}</p>}
        {fail ? (
          <div className="fail">
            <h2>Please Sign In</h2>
            <br />{" "}
            <button type="login" onClick={signIn}>
              Log In
            </button>
          </div>
        ) : (
          <div className="userInfoContainer">
            {userBio && (
              <div className="userInfo">
                <UserInfo
                  key={userData.id}
                  token={token}
                  userData={userData}
                  admin={admin}
                />
                <button
                  onClick={() => {
                    setUserBio(false);
                    setUserForm(true);
                  }}
                >
                  Update Profile
                </button>
              </div>
            )}

            {userForm && (
              <div className="userUpdateForm">
                {/* form could be a component? */}
                <form onSubmit={userUpdate}>
                  <label>
                    Profile Image:
                    <input
                      defaultValue={userData.imgurl}
                      onChange={(e) =>
                        setUpdatedUser((prev) => {
                          return {
                            ...prev,
                            imgurl: e.target.value,
                          };
                        })
                      }
                    />
                  </label>
                  <label>
                    Username:
                    <input
                      defaultValue={userData.username}
                      onChange={(e) =>
                        setUpdatedUser((prev) => {
                          return {
                            ...prev,
                            username: e.target.value,
                          };
                        })
                      }
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      defaultValue={userData.email}
                      onChange={(e) =>
                        setUpdatedUser((prev) => {
                          return {
                            ...prev,
                            email: e.target.value,
                          };
                        })
                      }
                    />
                  </label>
                  <label>
                    Name:
                    <input
                      defaultValue={userData.name}
                      onChange={(e) =>
                        setUpdatedUser((prev) => {
                          return {
                            ...prev,
                            name: e.target.value,
                          };
                        })
                      }
                    />
                  </label>
                  <label>
                    Password:
                    <input
                      type="password"
                      defaultValue={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <label>
                    Confirm Password:
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                  {buttonStatus == true && <p>Passwords must match</p>}
                  <button type="submit" disabled={buttonStatus}>
                    Submit
                  </button>
                </form>
              </div>
            )}

            <div className="userItems">
              <div className="userItemsNav">
                <NavButton
                  location={`/account/recipes`}
                  buttonText={"My Recipes"}
                />
                <NavButton
                  location={`/account/reviews`}
                  buttonText={"My Reviews"}
                />
                <NavButton
                  location={`/account/comments`}
                  buttonText={"My Comments"}
                />
              </div>
              <div className="itemContent">
                <Routes>
                  <Route
                    async
                    path="/"
                    element={
                      <UserRecipes
                        userData={userData}
                        admin={admin}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/recipes"
                    element={
                      <UserRecipes
                        userData={userData}
                        admin={admin}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/reviews"
                    element={
                      <UserReviews
                        userData={userData}
                        admin={admin}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/comments"
                    element={
                      <UserComments
                        userData={userData}
                        admin={admin}
                        currentUser={currentUser}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

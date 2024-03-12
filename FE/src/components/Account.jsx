import { useEffect, useState } from "react";

import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";
import UserReviews from "./UserReviews";
import UserComments from "./UserComments";
import NavButton from "./NavButton";
import UploadImage from "./UploadImage";
import defaultImg from "../assets/Default_pfp.jpeg";
import Loading from "./Loading";

const API = "https://culinary-chronicle.onrender.com/api/";

export default function Account({ token, admin, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const {
    recipes: recipeList = [],
    reviews: reviewList = [],
    comments: commentList = [],
  } = userData;

  const [error, setError] = useState(null);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);

  const [updatedUser, setUpdatedUser] = useState({});
  const [updatedPassword, setUpdatedPassword] = useState({
    password: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [buttonStatus, setButtonStatus] = useState(true);
  const [userForm, setUserForm] = useState(false);
  const [userBio, setUserBio] = useState(true);
  const [encoded, setEncoded] = useState({});

  useEffect(() => {
    setUpdatedUser((prev) => {
      return { ...prev, ...encoded };
    });
  }, [encoded]);

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
        if (token !== null) {
          setUserData(result);
          setUpdatedUser({
            imgurl: result.imgurl,
            username: result.username,
            email: result.email,
            name: result.name,
            admin: result.admin,
          });
          setLoading(false);
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

  useEffect(() => {
    if (token == null) {
      setLoading(false);
      setFail(true);
    }
  }, [userData]);

  async function userUpdate(event) {
    event.preventDefault();
    try {
      if (
        updatedUser.base64 &&
        updatedUser.username == userData.username &&
        updatedUser.email == userData.email &&
        updatedUser.name == userData.name &&
        updatedUser.admin == userData.admin &&
        updatedPassword.password == ""
      ) {
        setUserBio(true);
        setUserForm(false);
        return;
      } else if (updatedPassword.password === "") {
        delete updatedPassword.password;
      } else {
        const response = await fetch(`${API}users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedUser,
            ...updatedPassword,
          }),
        });
        const result = await response.json();
        console.log(result);
        setUserData(result);
        setUpdate((version) => version + 1);
        setUserForm(false);
        setUserBio(true);
      }
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
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <div>
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
                    currentUser={currentUser}
                  />
                  <button
                    onClick={() => {
                      setUserBio(false);
                      setUserForm(true);
                      setPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Update Profile
                  </button>
                </div>
              )}

              {userForm && (
                <div className="userUpdateForm">
                  <form onSubmit={userUpdate}>
                    <label>
                      Profile Image:
                      {userData.imgurl && !encoded.base64 && (
                        <img
                          src={userData.imgurl}
                          alt={
                            userData.username
                              ? `${userData.username}'s profile picture.`
                              : "Profile picture"
                          }
                        />
                      )}
                      {encoded.base64 && (
                        <img
                          src={encoded.base64 || defaultImg}
                          alt={
                            userData.username
                              ? `${userData.username}'s profile picture.`
                              : "Profile picture"
                          }
                        />
                      )}
                      <p>Upload new Profile Image?</p>
                      <UploadImage setEncoded={setEncoded} />
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
                      New Password:
                      <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setUpdatedPassword((prev) => {
                            return {
                              ...prev,
                              password: e.target.value,
                            };
                          });
                        }}
                      />
                    </label>
                    <label>
                      Confirm Password:
                      <input
                        type="password"
                        value={confirmPassword}
                        autoComplete="off"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </label>
                    {buttonStatus == true && <p>Passwords must match</p>}
                    <button type="submit" disabled={buttonStatus}>
                      Submit
                    </button>
                    <button
                      className="cancel"
                      onClick={() => {
                        setUserBio(true);
                        setUserForm(false);
                      }}
                    >
                      Cancel
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
      )}
    </>
  );
}

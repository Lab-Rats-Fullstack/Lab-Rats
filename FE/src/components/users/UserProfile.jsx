import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";
import UserReviews from "./UserReviews";
import UserComments from "./UserComments";
import NavButton from "../general/NavButton";
import UploadImage from "../general/UploadImage";
import defaultImg from "../../assets/Default_pfp.jpeg";
import Loading from "../general/Loading";
import handleUpload from "../general/handleUpload";
const API = "https://culinary-chronicle.onrender.com/api/";

export default function NewRecipe({ token, admin, currentUser }) {
  const [userData, setUserData] = useState({});
  const {
    recipes: recipeList = [],
    reviews: reviewList = [],
    comments: commentList = [],
  } = userData;

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [update, setUpdate] = useState(0);

  const [userForm, setUserForm] = useState(false);
  const [userBio, setUserBio] = useState(true);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    async function userCheck() {
      try {
        if (admin === true) {
          const response = await fetch(`${API}users/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const result = await response.json();

          setUserData(result);
          setLoading(false);
          setUpdatedUser({
            imgurl: result.imgurl,
            username: result.username,
            email: result.email,
            name: result.name,
            admin: result.admin,
          });
        } else {
          const response = await fetch(`${API}users/${userId}`);
          const result = await response.json();

          setUserData(result);
          setLoading(false);
          setUpdatedUser({
            imgurl: result.imgurl,
            username: result.username,
            email: result.email,
            name: result.name,
            admin: result.admin,
          });
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    }
    userCheck();
  }, [update, userId]);

  async function userUpdate(event) {
    event.preventDefault();
    const urlObj = {};
    if (formData) {
      const { url } = await handleUpload(formData);
      urlObj.imgurl = url;
    }
    try {
      if (
        !urlObj.imgurl &&
        updatedUser.username == userData.username &&
        updatedUser.admin == userData.admin
      ) {
        setUserBio(true);
        setUserForm(false);
        return;
      } else {
        const response = await fetch(`${API}users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedUser,
            ...urlObj,
          }),
        });
        const result = await response.json();

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

  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <div>
          {error ? (
            <div className="error">
              <p>{error}</p>
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
                  {admin === true && (
                    <button
                      onClick={() => {
                        setUserBio(false);
                        setUserForm(true);
                      }}
                    >
                      Update Profile
                    </button>
                  )}
                </div>
              )}
              {userForm && (
                <div className="userUpdateForm">
                  <form onSubmit={userUpdate}>
                    <label>
                      Profile Image:
                      {userData.imgurl && !image && (
                        <img
                          src={userData.imgurl}
                          alt={
                            userData.username
                              ? `${userData.username}'s profile picture.`
                              : "Profile picture"
                          }
                        />
                      )}
                      {image && (
                        <img
                          src={image || defaultImg}
                          alt={
                            userData.username
                              ? `${userData.username}'s profile picture.`
                              : "Profile picture"
                          }
                        />
                      )}
                      <p>Upload new Profile Image?</p>
                      <UploadImage
                        setImage={setImage}
                        setFormData={setFormData}
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
                      Admin Status:
                      <select
                        defaultValue={userData.admin}
                        onChange={(e) =>
                          setUpdatedUser((prev) => {
                            return {
                              ...prev,
                              admin: e.target.value,
                            };
                          })
                        }
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                    </label>
                    <button type="submit">Submit</button>
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
                    location={`/users/${userId}/recipes`}
                    buttonText={"Recipes"}
                  />
                  <NavButton
                    location={`/users/${userId}/reviews`}
                    buttonText={"Reviews"}
                  />
                  <NavButton
                    location={`/users/${userId}/comments`}
                    buttonText={"Comments"}
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

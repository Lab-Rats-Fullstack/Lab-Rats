import React from "react";
import altImg from "../assets/Default_pfp.jpeg";

export default function UserInfo({ token, admin, userData, currentUser }) {
  // console.log(userData);
  console.log(admin);
  console.log(currentUser);
  return (
    <div>
      <img
        src={userData.imgurl || altImg}
        alt={`User account image for ${userData.username}`}
      />
      <p className="usersUsername">{userData.username}</p>
      {token !== null && (admin === true || currentUser === userData.username) && (
          <div className="userPersonal">
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
          </div>
        )}
      {admin && (
        <p className="adminStatus">
          {userData.admin ? "Admin Status: Admin" : "Admin Status: User"}
        </p>
      )}
    </div>
  );
}

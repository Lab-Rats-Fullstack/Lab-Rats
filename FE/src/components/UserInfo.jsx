import React from 'react';

export default function UserInfo ({token, adminPriv, userData}) {
    // console.log(userData);
    // console.log(adminPriv);
    return (
        <div className = 'userInfo'>
            <img src={userData.imgurl} alt={`User account image for ${userData.username}`} height="15%" width="22.5%"/>
            <h2>{userData.username}</h2>
            {token !== null && 
            <div className= 'userPersonal'>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
            </div>
            }
            {adminPriv && <p>{userData.admin ? "Admin Status: Admin" : "Admin Status: User"}</p>}
        </div>
    )
}
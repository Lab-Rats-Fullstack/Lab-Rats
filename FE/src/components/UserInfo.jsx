import React from 'react';

export default function UserInfo ({token, admin, userData}) {
    // console.log(userData);
    // console.log(adminPriv);
    return (
        <div className = 'userInfo'>
            <img src={userData.imgurl} alt={`User account image for ${userData.username}`}/>
            <p className="usersUsername">{userData.username}</p>
            {token !== null && 
            <div className= 'userPersonal'>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
            </div>
            }
            {admin && <p className="adminStatus">{userData.admin ? "Admin Status: Admin" : "Admin Status: User"}</p>}
        </div>
    )
}
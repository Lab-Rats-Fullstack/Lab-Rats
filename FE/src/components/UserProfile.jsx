import {useEffect, useState} from 'react'
import { Routes, Route, useNavigate, useParams} from 'react-router-dom'
import { Link } from 'react-router-dom'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import UserReviews from './UserReviews'
import UserComments from './UserComments'
import NavButton from './NavButton'

const API = 'http://localhost:3000/api/';

export default function NewRecipe ({token, admin, currentUser}) {
    const [userData, setUserData] = useState({}); 
    const {recipes: recipeList =[], reviews: reviewList=[], comments: commentList=[]} = userData;

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { userId } = useParams();
    const [update, setUpdate] =useState(0);

    const [userForm, setUserForm] = useState(false);
    const [userBio, setUserBio] = useState(true);

    const [updatedUser, setUpdatedUser] =useState({});

    useEffect(()=>{
        async function userCheck () {
            try {
                if (admin === true){
                    const response = await fetch(`${API}users/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const result = await response.json();
                    console.log(result);
                    setUserData(result);
                    setUpdatedUser({
                        imgurl:result.imgurl,
                        username:result.username,
                        email:result.email,
                        name:result.name,
                        admin:result.admin
                    });
                }else {
                    const response = await fetch(`${API}users/${userId}`);
                    const result = await response.json();
                    console.log(result);
                    setUserData(result);
                    setUpdatedUser({
                        imgurl:result.imgurl,
                        username:result.username,
                        email:result.email,
                        name:result.name,
                        admin:result.admin
                    });
                }
                
            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }userCheck();
    }, [update])

    async function userUpdate(event) {
        event.preventDefault();
        try {
            if (updatedUser.imgurl == userData.imgurl
                && updatedUser.username == userData.username 
                && updatedUser.admin == userData.admin){
                setUserBio(true);
                setUserForm(false);
                return;
            }else {
                const response = await fetch(`${API}users/${userId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                        body: JSON.stringify({
                            ...updatedUser,
                        })
                });
                const result = await response.json()
                console.log(result);          
                setUserData(result);
                setUpdate((version) => version +1);
                setUserForm(false);
                setUserBio(true);
            }
            
        } catch (error) {
            setError(error.message);
            console.log( error );
        }
    }

    return (
        <div className = 'wrapper'>
            {error ? <div className="error"><p>{error}</p></div> :
            <div className="userInfoContainer">
                {userBio && 
                    <div className="userInfo">
                        <UserInfo
                            key ={userData.id}
                            token={token}
                            userData={userData}
                            admin={admin}
                            currentUser={currentUser}/>
                        {admin === true && <button onClick={() => {setUserBio(false); setUserForm(true);}}>Update Profile</button>}
                    </div>
                }
                {userForm &&
                <div className = 'userUpdateForm'>
                    <form onSubmit = {userUpdate}>
                        <label>
                            Profile Image:
                            <input
                                defaultValue = {userData.imgurl}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        imgurl: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <label>
                            Username:
                            <input
                                defaultValue = {userData.username}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        username: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                defaultValue = {userData.email}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        email: e.target.value
                                    }
                                })}
                            />
                        </label>
                        <label>
                            Name:
                            <input
                                defaultValue = {userData.name}
                                onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        name: e.target.value
                                }})}
                            />
                        </label>
                        <label>
                            Admin Status:
                            <select value={userData.admin} onChange = {(e)=> setUpdatedUser((prev)=>{
                                    return {
                                    ...prev,
                                        admin: e.target.value
                                    }
                                })}>
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        </label>
                        <button type='submit'>Submit</button>
                        <button onClick={() => {setUserBio(true); setUserForm(false);}} >Cancel</button>
                    </form>
                </div>
                }

                <div className = 'userItems'>
                    <div className='userItemsNav'>
                        <NavButton location ={`/users/${userId}/recipes`} buttonText={"Recipes"}/>
                        <NavButton location ={`/users/${userId}/reviews`} buttonText={"Reviews"}/>
                        <NavButton location ={`/users/${userId}/comments`} buttonText={"Comments"}/>
                    </div>
                    <div className='itemContent'>
                        <Routes>
                            <Route async path="/" element={<UserRecipes userData={userData} admin={admin} currentUser={currentUser}/>}/>
                            <Route path="/recipes" element={<UserRecipes userData={userData} admin={admin} currentUser={currentUser}/>}/>
                            <Route path="/reviews" element={<UserReviews userData={userData} admin={admin} currentUser={currentUser}/>}/>
                            <Route path="/comments" element={<UserComments userData={userData} admin={admin} currentUser={currentUser}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>}
        </div>
    )
}
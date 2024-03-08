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
    console.log(userId);

    useEffect(()=>{
        async function userCheck () {
            try {
                const response = await fetch(`${API}users/${userId}`);
                const result = await response.json();
                console.log(result);
                setUserData(result);

            } catch (error) {
                setError(error.message);
                console.log( error );
            }
        }userCheck();
    }, [])

    return (
        <div className = 'wrapper'>
            {/* {error && <p>{error}</p>} */}
            {error ? <div className="error"><p>{error}</p></div> :
            <div className="userInfoContainer">
                <div className="userInfo">
                    <UserInfo
                        key ={userData.id}
                        token={token}
                        userData={userData}
                        admin={admin}/>
                </div>

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
                            Password:
                            <input
                                type = "password"
                                value = {password}
                                autoComplete='off'
                                onChange = {(e)=> {setPassword(e.target.value);
                                    setUpdatedPassword((prev)=>{
                                    return {
                                    ...prev,
                                        password: e.target.value
                                }})}}
                            />
                        </label>
                        <label>
                            Confirm Password:
                            <input
                                type = "password"
                                value = {confirmPassword}
                                autoComplete='off'
                                onChange = {(e)=> setConfirmPassword(e.target.value)}
                            />
                        </label>
                        {buttonStatus == true && <p>Passwords must match</p>}
                        <button type='submit' disabled = {buttonStatus} >Submit</button>
                        <button onClick={() => {setUserBio(true); setUserForm(false);}} >Cancel</button>
                    </form>
                </div>
                }

                <div className = 'userItems'>
                    <div className='userItemsNav'>
                        <NavButton location ={`/users/${userId}/recipes`} buttonText={"My Recipes"}/>
                        <NavButton location ={`/users/${userId}/reviews`} buttonText={"My Reviews"}/>
                        <NavButton location ={`/users/${userId}/comments`} buttonText={"My Comments"}/>
                    </div>
                    <div className='itemContent'>
                        <Routes>
                            <Route async path="/" element={<UserRecipes userData={userData} admin={admin}/>}/>
                            <Route path="/recipes" element={<UserRecipes userData={userData} admin={admin} />}/>
                            <Route path="/reviews" element={<UserReviews userData={userData} admin={admin} />}/>
                            <Route path="/comments" element={<UserComments userData={userData} admin={admin} />}/>
                        </Routes>
                    </div>
                </div>
            </div>}
        </div>
    )
}
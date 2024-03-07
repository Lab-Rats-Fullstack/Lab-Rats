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

    useEffect(()=>{
        async function userCheck () {
            try {
                const response = await fetch(`${API}users/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        // "Authorization": `Bearer ${token}`,
                    },
                });
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
            <div>
                <div>
                    <UserInfo
                        key ={userData.id}
                        token={token}
                        userData={userData}
                        admin={admin}/>
                </div>
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
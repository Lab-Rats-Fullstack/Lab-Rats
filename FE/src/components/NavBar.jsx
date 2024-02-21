import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function NavBar ({token, setToken}) {
    const navigate = useNavigate();

    function renderNav () {
        let admin = false;
        let token = true;
 
 
        if (admin && token) {
            return <div>
            <Link to="/account">Account</Link>
            <Link to="/admin">Admin</Link>
            <button onClick={() => {
                    setToken(null);
                    navigate("/");
                }}>Log Out</button>
            </div>
        } else if (!admin && token) {
            return <div>
                <Link to ="/account">Account</Link>
                <button onClick={() => {
                    setToken(null);
                    navigate("/");
                }}>Log Out</button>
            </div>
        } else {
            return <div>
                <Link to="/login">Login or Register</Link>
            </div>
        };
    };
 
    return (
        <div className="navbar">
           <Link to="/">Home</Link>
           <Link to="/recipes">Recipes</Link>
           {renderNav()}
       </div>
    );
}
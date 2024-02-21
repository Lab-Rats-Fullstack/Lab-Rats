import { Link } from 'react-router-dom'

export default function NavBar () {
// will need to pass token, admin as props and as args to renderUserNav() when functionality is available

    function renderNav () {
        let admin = false;
        let token = true;
 
 
        if (admin && token) {
            return <div>
            <Link to="/account">Account</Link>
            <Link to="/admin">Admin</Link>
            </div>
        } else if (!admin && token) {
            return <div>
                <Link to ="/account">Account</Link>
                <button onClick={() => {
                    localStorage.clear();
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
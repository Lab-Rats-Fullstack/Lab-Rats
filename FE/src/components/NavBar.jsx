import { Link } from 'react-router-dom'

export default function NavBar () {
// will need to pass token, admin as props and as args to renderUserNav() when functionality is available

    function renderUserNav () {
        let admin = false;
        let token = false;
 
 
        if (admin && token) {
            return <div>
            <Link to="/account">Account</Link>
            <Link to="/admin">Admin</Link>
            </div>
        } else if (!admin && token) {
            return <div>
                <Link to ="/account">Account</Link>
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
           {renderUserNav()}
       </div>
    );
}
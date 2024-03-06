import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar({ token, setToken, admin, setAdmin, setCurrentUser }) {
  const navigate = useNavigate();

  function renderNav() {
    if (admin && token) {
      return (
        <div className="account">
          <Link to="/account">Account</Link>
          <Link to="/admin">Admin</Link>
          <button
            className="logout"
            onClick={() => {
              setToken(null);
              setAdmin(false);
              setCurrentUser('');
              navigate("/");
            }}
          >
            Log Out
          </button>
        </div>
      );
    } else if (!admin && token) {
      return (
        <div className="account">
          <Link to="/account">Account</Link>
          <button
            className="logout"
            onClick={() => {
              setToken(null);
              navigate("/");
            }}
          >
            Log Out
          </button>
        </div>
      );
    } else {
      return (
        <div className="account">
          <Link to="/login">Login or Register</Link>
        </div>
      );
    }
  }

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/recipes">Recipes</Link>
      {renderNav()}
    </div>
  );
}

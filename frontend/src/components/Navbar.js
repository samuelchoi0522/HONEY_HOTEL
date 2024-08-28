import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* logo or sm */}
      </div>
      <div className="navbar-links">
        <Link to="/signin">
            <button className="sign-in-button">Sign In</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

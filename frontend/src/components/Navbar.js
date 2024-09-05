import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src="/uploads/HONEY_HOTEL_LOGO.png" alt="Logo" className="navbar-logo" style={{ height: '70px', width: 'auto' }}/>
        </Link>
      <div className="navbar-links">
        <Link to="/Login">
            <button className="sign-in-button">FIND YOUR HIVE</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

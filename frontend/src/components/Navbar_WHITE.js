import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar_WHITE.css';

function Navbar_WHITE() {
    return (
        <nav className="navbar_white">
            <Link to="/" className="navbar-brand">
                <img src="/uploads/HONEY_HOTEL_LOGO_BLACK.png" alt="Logo" className="navbar-logo" style={{ height: '70px', width: 'auto' }} />
            </Link>

        </nav>
    );
}

export default Navbar_WHITE;

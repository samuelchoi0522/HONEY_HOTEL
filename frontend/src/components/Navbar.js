import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Modal from './Modal.js';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
    const [userName, setUserName] = useState(''); // State to store user's name
    const [hover, setHover] = useState(false); // State to track if the account icon is hovered


    useEffect(() => {
        // Check if the user is logged in by fetching session data
        const checkSession = async () => {
            console.log("checking session");
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                console.log(data);

                if (response.ok && data.isLoggedIn) {
                    setIsLoggedIn(true);
                    console.log("User is logged in:", data);
                    setUserName(data.firstname.toUpperCase()); // Use firstname from backend response in all caps
                } else {
                    console.log("No active session found.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, []);

    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent to invalidate the session
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserName('');
            } else {
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging out:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <nav className="navbar">
            <Link to="/">
                <img src="/uploads/HONEY_HOTEL_LOGO.png" alt="Logo" className="navbar-logo" style={{ height: '70px', width: 'auto' }} />
            </Link>

            <div className="navbar-links">
                <Link to="/view-all-hotels" className="navbar-link-items">
                    HOTELS & RESORTS
                </Link>
                <Link to="/amenities" className="navbar-link-items">
                    AMENITIES
                </Link>
                <Link to="/dining" className="navbar-link-items">
                    DINING
                </Link>
                <Link to="/shop" className="navbar-link-items">
                    SHOP
                </Link>
                <Link to="/activities" className="navbar-link-items">
                    ACTIVITIES
                </Link>
                <Link to="/about-us" className="navbar-link-items">
                    ABOUT US
                </Link>
                <Link to="/account" className="navbar-link-items">
                    ACCOUNT
                </Link>
            </div>

            <div className="navbar-user">
                {isLoggedIn ? (
                    <div
                        className="account-link"
                        onClick={handleLogout}
                        style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)} // Set hover state on mouse events
                    >
                        {hover ? (
                            <LogoutIcon style={{ fontSize: 20, marginBottom: "-10px" }} />
                        ) : (
                            <PersonIcon style={{ fontSize: 20, marginBottom: "-10px" }} />
                        )}
                        <p>HI, {userName}!</p>
                    </div>
                ) : (
                    <div className="login-link">
                        <Link to="/login" className="login-link">
                            <PersonIcon style={{ fontSize: 20, marginBottom: "-10px" }} />
                            <p>LOGIN</p>
                        </Link>
                    </div>
                )}
            </div>

            <button className="sign-in-button" onClick={handleModalOpen}>
                FIND YOUR HIVE
            </button>

            <Modal open={showModal} handleClose={handleModalClose} />
        </nav>
    );
}

export default Navbar;

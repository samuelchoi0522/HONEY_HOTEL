import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import Modal from './Modal.js';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        //check if the user is logged in by fetching session data
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/auth/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok && data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserName(data.firstname.toUpperCase());
                } else {
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
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserName('');
                localStorage.removeItem("isLoggedIn");
                navigate("/");
            } else {
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging out:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    const handleAccountClick = () => {
        if (isLoggedIn) {
            navigate("/account");
        } else {
            navigate("/login");
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
                <div
                    className="navbar-link-items"
                    onClick={handleAccountClick}
                    style={{cursor: 'pointer'}}
                >
                    ACCOUNT
                </div>
            </div>

            <div className="navbar-user">
                {isLoggedIn ? (
                    <div
                        className="account-link"
                        onClick={handleLogout}
                        style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {hover ? (
                            <LogoutIcon style={{ fontSize: 20, marginBottom: "-10px" }} />
                        ) : (
                            <PersonIcon style={{ fontSize: 20, marginBottom: "-10px" }} />
                        )}

                        {hover ? (
                            <p>LOGOUT</p>
                        ) : (
                            <p>HI, {userName}!</p>
                        )}
                        
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Modal from './Modal.js';

function Navbar() {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent to invalidate the session
            });

            if (response.ok) {
                alert("Logged out successfully.");
                // Redirect to login page after successful logout
                window.location.href = "/login";
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
            <Link to="/" className="navbar-brand">
                <img src="/uploads/HONEY_HOTEL_LOGO.png" alt="Logo" className="navbar-logo" style={{ height: '70px', width: 'auto' }} />
            </Link>
            <Link to="/" className="navbar-link-items">
                HOME
            </Link>
            <button className="navbar-link-items" onClick={handleLogout} >Log Out</button>
            <div className="navbar-links">


                <button className="sign-in-button" onClick={handleModalOpen}>
                    FIND YOUR HIVE
                </button>

                
            </div>

            <Modal open={showModal} handleClose={handleModalClose} />
        </nav>
    );
}

export default Navbar;

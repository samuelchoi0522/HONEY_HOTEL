import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Modal from './Modal.js';

function Navbar() {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/uploads/HONEY_HOTEL_LOGO.png" alt="Logo" className="navbar-logo" style={{ height: '70px', width: 'auto' }} />
            </Link>
            <div className="navbar-links">
                {/* Use onClick to trigger the modal */}
                <button className="sign-in-button" onClick={handleModalOpen}>
                    FIND YOUR HIVE
                </button>
            </div>

            {/* Modal Component */}
            <Modal open={showModal} handleClose={handleModalClose} />
        </nav>
    );
}

export default Navbar;

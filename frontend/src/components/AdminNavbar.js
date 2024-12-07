import React, { useState } from 'react';
import "../styles/AdminNavbar.css";

const AdminNavbar = ({ onSelect }) => {
    const [selectedItem, setSelectedItem] = useState("Bookings");

    const handleItemClick = (item) => {
        setSelectedItem(item);
        onSelect(item);
    };

    return (
        <div className="admin-navbar">
            <div
                className={`admin-navbar-item ${selectedItem === "Bookings" ? "selected" : ""}`}
                onClick={() => handleItemClick("Bookings")}
            >
                <img
                    src="./icons/bookings.png"
                    alt="Bookings"
                    className="admin-navbar-icon"
                />
                <span className="admin-label">Bookings</span>
            </div>
            <div
                className={`admin-navbar-item ${selectedItem === "Users" ? "selected" : ""}`}
                onClick={() => handleItemClick("Users")}
            >
                <img
                    src="./icons/user.png"
                    alt="User"
                    className="admin-navbar-icon"
                />
                <span className="admin-label">Users</span>
            </div>
            <div
                className={`admin-navbar-item ${selectedItem === "Administrator" ? "selected" : ""}`}
                onClick={() => handleItemClick("Administrator")}
            >
                <img
                    src="./icons/administrator.png"
                    alt="Administrator"
                    className="admin-navbar-icon"
                />
                <span className="admin-label">Administrator</span>
            </div>
        </div>
    );
};

export default AdminNavbar;
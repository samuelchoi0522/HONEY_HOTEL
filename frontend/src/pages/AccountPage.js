import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/AccountPage.css"

const AccountPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        navigate('/home');
    };

    return (
        <div className="account-page">
            <div className="form-container">
                {/* Left Section: Reset Password */}
                <div className="left-section">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Please enter email associated with your account"
                            required
                            className="input-field"
                        />

                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                            className="input-field"
                        />

                        <label htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Match/No Match"
                            required
                            className="input-field"
                        />
                    </form>
                </div>

                {/* Right Section: Reservations */}
                <div className="right-section">
                    <h2>Reservations</h2>
                    <div className="reservations-container">
                        <h3>Active Bookings</h3>
                        <div className="booking-box">
                            {/* Active Bookings will be dynamically loaded here */}
                        </div>

                        <h3>Previous Bookings</h3>
                        <div className="booking-box">
                            {/* Previous Bookings will be dynamically loaded here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;

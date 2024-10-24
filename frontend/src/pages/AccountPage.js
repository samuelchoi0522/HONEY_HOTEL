import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";

const AccountPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
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
                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password*"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password*"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Match/No Match"
                            required
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'black', color: 'white', marginTop: '16px' }} // Make the button black
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'darkgray')} // Change color on hover
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')} // Reset color on mouse out
                        >
                            Submit
                        </Button>
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";

const AccountPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
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
                    console.log("User is logged in:", data);
                    navigate("/account");
                } else {
                    console.log("No active session found.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };
        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/account/reset-password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    newPassword: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.text(); // Use .text() for non-JSON responses
                console.error("Error resetting password:", errorResponse);
                setErrorMessage(errorResponse); // Set error message
                return;
            }

            const data = await response.text();
            console.log(data.message);

            if (response.ok) {
                alert("Password changed successfully!");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="account-page">
            <div className="form-container">
                {/* Left Section: Reset Password */}
                <div className="left-section">
                    <h2>Reset Password</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                '& label': {
                                    color: 'gray',
                                },
                                '& label.Mui-focused': {
                                    color: 'gray',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'gray',
                                },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                '& label': {
                                    color: 'gray',
                                },
                                '& label.Mui-focused': {
                                    color: 'gray',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'gray',
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: 'black', color: 'white', marginTop: '16px' }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'darkgray')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')}
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
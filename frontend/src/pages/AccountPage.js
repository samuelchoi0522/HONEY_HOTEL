import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const AccountPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const handleClickShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };

    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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
                    oldPassword: formData.oldPassword,
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
                formData.oldPassword = '';
                formData.password = '';
                formData.confirmPassword = '';
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
                            label="Old Password"
                            type={showOldPassword ? "text" : "password"}
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Old Password"
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowOldPassword}
                                        >
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
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
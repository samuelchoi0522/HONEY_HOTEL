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
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                if (response.ok && data.isLoggedIn) {
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reservations", {
                    method: "GET",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    console.error("Failed to fetch reservations.");
                }
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };


        checkSession();
        fetchReservations();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

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
                const errorResponse = await response.text();
                setErrorMessage(errorResponse);
                return;
            }


            const data = await response.text();

            if (response.ok) {
                alert("Password changed successfully!");
                formData.oldPassword = '';
                formData.password = '';
                formData.confirmPassword = '';
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred.');
        }
    };

    //TODO: Find a way to display the user's reservations that were placed together as one box

    return (
        <div className="account-page">
            <div className="form-container">
                <div className="left-section">
                    <h2>Reset Password</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'black' },
                                    '&:hover fieldset': { borderColor: 'black' },
                                    '&.Mui-focused fieldset': { borderColor: 'black' },
                                },
                                '& label': { color: 'gray' },
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
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'black' },
                                    '&:hover fieldset': { borderColor: 'black' },
                                    '&.Mui-focused fieldset': { borderColor: 'black' },
                                },
                                '& label': { color: 'gray' },
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

                <div className="right-section">
                    <h2>Reservations</h2>
                    <div className="reservations-container">
                        <h3>Active Bookings</h3>
                        {reservations.filter(res => new Date(res.checkOutDate) >= new Date()).map((reservation, index) => (
                            <div key={index} className="booking-box">
                                <p><strong>Room Type:</strong> {reservation.roomType}</p>
                                <p><strong>Bed:</strong> {reservation.bedType}</p>
                                <p><strong>Smoking:</strong> {reservation.smokingAllowed ? 'Yes' : 'No'}</p>
                                <p><strong>Check-In:</strong> {reservation.checkInDate}</p>
                                <p><strong>Check-Out:</strong> {reservation.checkOutDate}</p>
                                <p><strong>Adults:</strong> {reservation.adults}</p>
                                <p><strong>Children:</strong> {reservation.children}</p>
                                <p><strong>Promo Code:</strong> {reservation.promoCode}</p>
                                <p><strong>Rate Option:</strong> {reservation.rateOption}</p>
                                <p><strong>Total Price:</strong> ${reservation.totalPrice}</p>
                            </div>
                        ))}

                        <h3>Previous Bookings</h3>
                        {reservations.filter(res => new Date(res.checkOutDate) < new Date()).map((reservation, index) => (
                            <div key={index} className="booking-box">
                                <p><strong>Room Type:</strong> {reservation.roomType}</p>
                                <p><strong>Bed:</strong> {reservation.bedType}</p>
                                <p><strong>Smoking:</strong> {reservation.smokingAllowed ? 'Yes' : 'No'}</p>
                                <p><strong>Check-In:</strong> {reservation.checkInDate}</p>
                                <p><strong>Check-Out:</strong> {reservation.checkOutDate}</p>
                                <p><strong>Adults:</strong> {reservation.adults}</p>
                                <p><strong>Children:</strong> {reservation.children}</p>
                                <p><strong>Promo Code:</strong> {reservation.promoCode}</p>
                                <p><strong>Rate Option:</strong> {reservation.rateOption}</p>
                                <p><strong>Total Price:</strong> ${reservation.totalPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AccountPage;

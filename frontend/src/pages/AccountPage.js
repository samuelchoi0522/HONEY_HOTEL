import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";

const AccountPage = () => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [reservations, setReservations] = useState([]); // State for user's reservations
    const navigate = useNavigate();

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
                if (response.ok && data.isLoggedIn) {
                    console.log("User is logged in:", data);
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
                    setReservations(data); // Update reservations state with fetched data
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
                body: JSON.stringify({ newPassword: formData.password }),
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                setErrorMessage(errorResponse);
                return;
            }

            alert("Password changed successfully!");
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
                            label="New Password"
                            type="password"
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
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            type="password"
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

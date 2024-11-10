import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AccountNavbar from "../components/AccountNavbar";

const AccountPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [reservations, setReservations] = useState([]);
    const [selectedView, setSelectedView] = useState('upcoming');

    useEffect(() => {
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

        fetchReservations();
    }, []);

    const groupedReservations = reservations.reduce((acc, reservation) => {
        const { bookingId } = reservation;
        if (!acc[bookingId]) acc[bookingId] = [];
        acc[bookingId].push(reservation);
        return acc;
    }, {});

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

            alert("Password changed successfully!");
            setFormData({ oldPassword: '', password: '', confirmPassword: '' });
        } catch (error) {
            setErrorMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="account-page">
            <p className="account-title">YOUR RESERVATIONS</p>
            <AccountNavbar setSelectedView={setSelectedView} />
            <div className="account-form-container">
                {selectedView === 'upcoming' && (
                    <div className="account-reservations-container">
                        <h3>UPCOMING RESERVATIONS</h3>
                        {Object.entries(groupedReservations).map(([bookingId, reservations]) => (
                            new Date(reservations[0].checkOutDate) >= new Date() && (
                        <div className="account-booking-box" key={bookingId}>
                            {/* Booking Details Section */}
                            <div className="account-booking-info-top">
                                <div className="account-checkin-checkout">
                                    <p style={{ paddingLeft: "20px" }}>CHECK-IN <br></br><strong>{new Date(reservations[0].checkInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
                                    <p>CHECK-OUT <br></br><strong>{new Date(reservations[0].checkOutDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
                                </div>
                                <p className="account-booking-id">Booking ID: {bookingId}</p>
                            </div>


                            {/* Room Details */}
                            {reservations.map((room, index) => (
                                <div key={index}>
                                    <div className="account-room-details-container">
                                        <img src={room.photo_path} alt={`${room.roomType} Room`} className="account-room-image" />
                                        <div className="account-room-details-text">
                                            <p>{room.hotelLocation.toUpperCase()}</p>
                                            <p>{room.roomType.toUpperCase()} ROOM</p>
                                            <p>{room.bedType.toUpperCase()} BED</p>
                                            <p>TOTAL: ${room.totalPrice}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons for each room */}
                                    <div className="account-action-buttons">
                                        <button className="account-action-button">CANCEL ROOM</button>
                                        <button className="account-action-button">REQUEST EARLY CHECK-IN</button>
                                    </div>

                                    {/* Divider between rooms if not the last room */}
                                    {index < reservations.length - 1 && <hr className="account-divider-line" />}
                                </div>
                            ))}
                        </div>


                            )
                        ))}
                    </div>
                )}

                {selectedView === 'past' && (
                    <div className="account-reservations-container">
                        <h3>PAST RESERVATIONS</h3>
                        {Object.entries(groupedReservations).map(([bookingId, reservations]) => (
                            new Date(reservations[0].checkOutDate) < new Date() && (
                                <div className="account-booking-box" key={bookingId}>
                                    {/* Booking Details Section */}
                                    <div className="account-booking-info-top">
                                        <div className="account-checkin-checkout">
                                            <p style={{ paddingLeft: "20px" }}>CHECK-IN <br /><strong>{new Date(reservations[0].checkInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
                                            <p>CHECK-OUT <br /><strong>{new Date(reservations[0].checkOutDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
                                        </div>
                                        <p className="account-booking-id">Booking ID: {bookingId}</p>
                                    </div>

                                    {/* Room Details */}
                                    {reservations.map((room, index) => (
                                        <div key={index}>
                                            <div className="account-room-details-container">
                                                <img src={room.photo_path} alt={`${room.roomType} Room`} className="account-room-image" />
                                                <div className="account-room-details-text">
                                                    <p>{room.hotelLocation.toUpperCase()}</p>
                                                    <p>{room.roomType.toUpperCase()} ROOM</p>
                                                    <p>{room.bedType.toUpperCase()} BED</p>
                                                    <p>TOTAL: ${room.totalPrice}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons for each room */}
                                            <div className="account-action-buttons">
                                                <button className="account-action-button">VIEW RECEIPT</button>
                                                <button className="account-action-button">BOOK AGAIN</button>
                                            </div>

                                            {/* Divider between rooms if not the last room */}
                                            {index < reservations.length - 1 && <hr className="account-divider-line" />}
                                        </div>
                                    ))}
                                </div>
                            )
                        ))}
                    </div>
                )}

                {selectedView === 'settings' && (
                    <div className="left-section">
                        <h2>Account Settings</h2>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Old Password"
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;

import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AccountNavbar from "../components/AccountNavbar";
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

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
                console.log(data);

                if (response.ok && data.isLoggedIn) {
                    formData.firstName = data.firstname;
                    formData.lastName = data.lastname;
                    formData.email = data.email;
                } else {
                    console.log("No active session found.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        const getUserInfo = async () => {
            console.log("getting user info");
            try {
                const response = await fetch("http://localhost:8080/api/account", {
                    method: "GET",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                    });
                } else {
                    console.error("Failed to fetch user info.");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
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
        getUserInfo();
    }, []);

    const groupedReservations = reservations.reduce((acc, reservation) => {
        const { bookingId } = reservation;
        if (!acc[bookingId]) acc[bookingId] = [];
        acc[bookingId].push(reservation);
        return acc;
    }, {});

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({ ...prevData, [name]: value }));
    // };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            if (hasChanges) {
                if (formData.firstName || formData.lastName) {
                    await fetch('/api/update-name', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                        }),
                    });
                }

                if (isEmailEditable) {
                    await fetch('/api/update-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email }),
                    });
                }

                if (isPasswordEditable) {
                    await fetch('/api/update-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: formData.password }),
                    });
                }

                alert("Profile updated successfully!");
                setHasChanges(false);
                setIsEmailEditable(false);
                setIsPasswordEditable(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="account-page">
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
                    <div className="account-settings-container">
                        <h3>ACCOUNT SETTINGS</h3>
                        <div className="account-settings-bottom-container">
                            <div className="account-settings-field-container">
                                <div className="account-settings-first-name">
                                    <p>FIRST NAME</p>
                                    <TextField
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        variant='filled'
                                        size='small'
                                        inputProps={{
                                            style: {
                                                padding: '10px',
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                                width: "300px",
                                            },
                                        }}
                                    />
                                </div>

                                <div className="account-settings-last-name">
                                    <p>LAST NAME</p>
                                    <TextField
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        variant='filled'
                                        size='small'
                                        inputProps={{
                                            style: {
                                                padding: '10px',
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px", // Change to desired radius
                                                overflow: "hidden",
                                                width: "300px",
                                                marginLeft: "85px",
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='account-settings-email'>
                                <p>EMAIL</p>
                                <div className="account-settings-text-field-container">
                                    <TextField
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEmailEditable}
                                        variant='filled'
                                        size='small'
                                        inputProps={{
                                            style: {
                                                padding: '10px',
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px", // Change to desired radius
                                                overflow: "hidden",
                                                width: "300px",
                                            },
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="account-settings-change-button"
                                        onClick={() => setIsEmailEditable(!isEmailEditable)}
                                    >
                                        Change Email
                                    </button>
                                </div>
                            </div>

                            {isPasswordEditable ? (
                                <form onSubmit={handleSave}>
                                    <TextField
                                        label="Old Password"
                                        type={showOldPassword ? "text" : "password"}
                                        name="oldPassword"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        variant='filled'
                                        size='small'
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
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        variant='filled'
                                        size='small'
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
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        variant='filled'
                                        size='small'
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
                                </form>
                            ) : (
                                <div className="account-settings-password">
                                    <p>PASSWORD</p>
                                    <div className="account-settings-text-field-container">
                                        <TextField
                                            type="password"
                                            value="********"
                                            variant='filled'
                                            size='small'
                                            disabled
                                            inputProps={{
                                                style: {
                                                    padding: '10px',
                                                },
                                            }}
                                            sx={{
                                                "& .MuiFilledInput-root": {
                                                    borderRadius: "0px", // Change to desired radius
                                                    overflow: "hidden",
                                                    width: "300px",
                                                },
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="account-settings-change-button"
                                            onClick={() => setIsPasswordEditable(true)}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="account-settings-save-button-container">
                                <button
                                    className={`account-settings-save-button ${hasChanges ? "has-changes" : ""}`}
                                    onClick={hasChanges ? handleSave : null}
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;

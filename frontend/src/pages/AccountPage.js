import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import "../styles/AccountPage.css";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AccountNavbar from "../components/AccountNavbar";
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";

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
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            console.log("checking session");
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:8080/auth/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    if (data.isLoggedIn) {
                        setFormData((prevData) => ({
                            ...prevData,
                            firstName: data.firstname,
                            lastName: data.lastname,
                            email: data.email,
                        }));
                    } else {
                        console.log("No active session found.");
                        navigate("/login");
                    }
                } else {
                    console.error("Failed to verify session.");
                }
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchReservations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:8080/api/reservations", {
                    method: "GET",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.length, "reservations fetched.");
                    setReservations(data);
                } else {
                    console.error("Failed to fetch reservations.");
                    setReservations([]);
                }
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
        fetchReservations();
    }, [navigate]);

    const groupedReservations = reservations.reduce((acc, reservation) => {
        const { bookingId } = reservation;
        if (!acc[bookingId]) acc[bookingId] = [];
        acc[bookingId].push(reservation);
        return acc;
    }, {});

    const handleCancelRoom = async (roomId, bookingId) => {
        console.log("Canceling room with roomId:", roomId, "and bookingId:", bookingId);
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ roomId, bookingId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to cancel the room:", errorText);
                alert("Failed to cancel the room. Please try again.");
                return;
            }

            alert("Room canceled successfully!");

            setReservations((prevReservations) =>
                prevReservations.filter(
                    (reservation) => !(reservation.roomId === roomId && reservation.bookingId === bookingId)
                )
            );

            window.location.reload();
        } catch (error) {
            console.error("Error canceling room:", error);
            alert("An unexpected error occurred. Please try again.");
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
                    await fetch('http://localhost:8080/api/account/update-name', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                        }),
                    });
                }

                if (isEmailEditable) {
                    await fetch('http://localhost:8080/api/account/update-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ email: formData.email }),
                    });
                }

                if (isPasswordEditable) {
                    setErrorMessage('');
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
                }

                alert("Profile updated successfully!");
                window.location.reload();
                setHasChanges(false);
                setIsEmailEditable(false);
                setIsPasswordEditable(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const upcomingReservations = reservations.filter((reservation) =>
        new Date(reservation.checkInDate) >= new Date()
    );
    const pastReservations = reservations.filter((reservation) =>
        new Date(reservation.checkOutDate) < new Date()
    );

    return (
        <div className="account-page">
            <AccountNavbar setSelectedView={setSelectedView} />
            <div className="account-form-container">
                {selectedView === 'upcoming' && (
                    <div className="account-reservations-container">
                        <h3>UPCOMING RESERVATIONS</h3>
                        {isLoading ? (
                            <div className="account-loader-container">
                                <ThreeDots color="#000000" height={40} width={40} className="account-loader" />
                            </div>
                        ) : upcomingReservations.length === 0 ? (
                            <div className="account-error-box">
                                <img
                                    src="../icons/warning_icon.png"
                                    alt="No upcoming reservations"
                                    className="account-error-icon"
                                />
                                <p>No upcoming reservations found.<br /> Please make a reservation to view it here.</p>
                            </div>
                        ) : (
                            Object.entries(groupedReservations).map(([bookingId, reservations]) => (
                                new Date(reservations[0].checkOutDate) >= new Date() && (
                                    <div className="account-booking-box" key={bookingId}>
                                        {/* Booking Details Section */}
                                        <div className="account-booking-info-top">
                                            <div className="account-checkin-checkout">
                                                <p style={{ paddingLeft: "20px" }}>
                                                    CHECK-IN <br />
                                                    <strong>{new Date(reservations[0].checkInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                                                </p>
                                                <p>
                                                    CHECK-OUT <br />
                                                    <strong>{new Date(reservations[0].checkOutDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                                                </p>
                                            </div>
                                            <p className="account-booking-id">Booking ID: {bookingId}</p>
                                            <p className="account-total-price">
                                                Total: <span style={{ color: "black", fontWeight: "bold" }}>
                                                    ${reservations.reduce((total, room) => total + parseFloat(room.roomPrice || 0), 0).toFixed(2)}
                                                </span>
                                            </p>
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
                                                        <p>TOTAL: ${room.roomPrice}</p>
                                                    </div>
                                                </div>
                                                {/* Action Buttons for each room */}
                                                <div className="account-action-buttons">
                                                    <button
                                                        className="account-action-button"
                                                        onClick={() => handleCancelRoom(room.roomId, room.bookingId)}
                                                    >
                                                        CANCEL ROOM
                                                    </button>
                                                    <button className="account-action-button">REQUEST EARLY CHECK-IN</button>
                                                </div>
                                                {/* Divider between rooms if not the last room */}
                                                {index < reservations.length - 1 && <hr className="account-divider-line" />}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>

            <div className="account-form-container">
                {selectedView === 'past' && (
                    <div className="account-reservations-container">
                        <h3>PAST RESERVATIONS</h3>
                        {isLoading ? (
                            <div className="account-loader-container">
                                <ThreeDots color="#000000" height={40} width={40} className="account-loader" />
                            </div>
                        ) : pastReservations.length === 0 ? (
                            <div className="account-error-box">
                                <img
                                    src="../icons/warning_icon.png"
                                    alt="No past reservations"
                                    className="account-error-icon"
                                />
                                <p>No past reservations found.</p>
                            </div>
                        ) : (
                            Object.entries(groupedReservations).map(([bookingId, reservations]) => (
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
                                                        <p>TOTAL: ${room.roomPrice}</p>
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
                                ))
                            ))}
                    </div>
                )}
            </div>

            <div className="account-form-container">
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
                                                borderRadius: "0px",
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
                                                borderRadius: "0px",
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
                                        {isEmailEditable ? "Cancel" : "Change Email"}
                                    </button>
                                </div>
                            </div>

                            {isPasswordEditable ? (
                                <form className="account-reset_password-text-fields" onSubmit={handleSave}>
                                    <p>PASSWORD</p>
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
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                                width: "300px",
                                            },
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
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                                width: "300px",
                                            },
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
                                        sx={{
                                            "& .MuiFilledInput-root": {
                                                borderRadius: "0px",
                                                overflow: "hidden",
                                                width: "300px",
                                            },
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="account-settings-change-button"
                                        onClick={() => setIsPasswordEditable(false)} // Set back to non-editable state
                                    >
                                        Cancel
                                    </button>
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
                                                    borderRadius: "0px",
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

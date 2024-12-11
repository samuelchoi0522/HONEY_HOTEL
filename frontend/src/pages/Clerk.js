import React, { useEffect, useState } from 'react';
import {Button, TextField} from "@mui/material";

const ClerkReservationPage = () => {
    const [customerEmail, setCustomerEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8080/auth/check-session", {
                    method: 'POST',
                    credentials: "include",
                    headers: {'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.isLoggedIn && data.email) {
                        setIsLoggedIn(true);
                        setUserEmail(data.email);
                    } else {
                        setIsLoggedIn(false);
                        setMessage("Session expired. Please log in again.");
                    }
                } else {
                    setMessage("Unable to verify session.");
                }
            } catch (error) {
                console.error('Error checking session:', error);
                setMessage("An error occurred while verifying your session.");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const handleEmailChange = (e) => {
        setCustomerEmail(e.target.value);
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();

        if (!customerEmail || !userEmail) {
            setMessage("Both customer email and logged-in user's email are required.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/clerk/dashboard', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerEmail: customerEmail,
                    clerkEmail: userEmail,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Backend Response:', data);

                const createdEmail = data.customerEmail || customerEmail;
                setMessage(`Reservation successfully created for ${createdEmail}`);

                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error || 'An unexpected error occurred.'}`);
            }
        } catch (error) {
            console.error('Error submitting reservation:', error);
            setMessage('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="account-page" style={{ textAlign: 'center', width: 'auto', padding: '20px' }}>
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    marginBottom: '50px',
                }}>
                    Create Reservation for Customer
                </h2>
                {!isLoggedIn ? (
                    <p>Please log in to create a reservation.</p>
                ) : (
                    <form onSubmit={handleReservationSubmit}>
                        <div className="input-group" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p>EMAIL</p>
                            <div className="account-settings-text-field-container">
                                <TextField
                                    name="email"
                                    value={customerEmail}
                                    onChange={handleEmailChange}
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
                                            width: "300px", // Keep the original width
                                        },
                                    }}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                style={{
                                    padding: '10px',
                                    marginTop: '20px',
                                }}
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    padding: '12px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'grey',
                                        color: 'black',
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#ccc',
                                        color: '#888',
                                    },
                                }}
                            >
                                {loading ? 'Creating Reservation...' : 'Create Reservation'}
                            </Button>
                        </div>
                    </form>
                )}

                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
}

export default ClerkReservationPage;
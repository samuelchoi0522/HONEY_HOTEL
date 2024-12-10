import React, { useEffect, useState } from 'react';

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
                    headers: { 'Content-Type': 'application/json' },
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
        <div className="account-page">
            <h2>Create Reservation for Customer</h2>

            {!isLoggedIn ? (
                <p>Please log in to create a reservation.</p>
            ) : (
                <form onSubmit={handleReservationSubmit}>
                    <div className="input-group">
                        <label htmlFor="customerEmail">Customer Email:</label>
                        <input
                            type="email"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Reservation...' : 'Create Reservation'}
                    </button>
                </form>
            )}

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ClerkReservationPage;
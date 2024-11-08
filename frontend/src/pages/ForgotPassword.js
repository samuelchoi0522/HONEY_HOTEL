import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailAlert, setShowFailAlert] = useState(false);
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
                    navigate("/");
                } else {
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/forgot-password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setShowSuccessAlert(true);
                setShowFailAlert(false);
            } else {
                setShowFailAlert(true);
                setShowSuccessAlert(false);
            }
        } catch (error) {
            console.error("Error sending password reset request:", error);
            setShowFailAlert(true);
            setShowSuccessAlert(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-left">
                <h2 style={{ fontWeight: 100, textAlign: "center", fontSize: "3em" }}>RESET PASSWORD</h2>
                <p style={{ fontWeight: 100, textAlign: "center", fontSize: "1.3em", marginBottom: "40px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>Enter the email associated with your account and we’ll
                    send you an email to reset your password</p>

                {showSuccessAlert && (
                    <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                        sx={{
                            maxWidth: "570px",
                            margin: "0 auto",
                            textAlign: "center",
                            marginBottom: "20px"
                        }}
                    >
                        Email successfully sent. Check your inbox for further instructions.
                    </Alert>
                )}

                {showFailAlert && !showSuccessAlert && (
                    <Alert
                        severity="error"
                        sx={{
                            maxWidth: "570px",
                            margin: "0 auto",
                            textAlign: "center",
                            marginBottom: "20px"
                        }}
                    >
                        System error. Please try again later.
                    </Alert>
                )}

                <form className="signin-form" onSubmit={handleSubmit}>
                    <TextField
                        id="standard-basic"
                        label="Email"
                        variant="standard"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                        sx={{
                            '& label.Mui-focused': {
                                color: 'black',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: 'black',
                            },
                            '& .MuiInputLabel-asterisk': {
                                color: 'red',
                            }
                        }}
                    />

                    <button type="submit" className="sendemail-button"><strong>SUBMIT</strong></button>

                    <p className="rememberaccount-link" style={{ fontWeight: 100, fontSize: "1.2em" }}>
                        Remember your account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>

            <div className="register-right" style={{ backgroundImage: "url('/uploads/FORGOT_PASSWORD_LANDING_PHOTO.jpg')" }}>
            </div>
        </div>
    );
}

export default ForgotPassword;

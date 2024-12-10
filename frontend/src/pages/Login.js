import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailAlert, setShowFailAlert] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const checkSession = async () => {
            console.log("checking session");
            try {
                const response = await fetch("http://localhost:8080/auth/check-session", {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                console.log(data);

                if (response.ok && data.isLoggedIn) {
                    console.log("User is logged in:", data);
                    navigate("/");
                } else {
                    console.log("No active session found.");
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            setShowSuccessAlert(true);

            setTimeout(() => {
                const reservationData = sessionStorage.getItem("reservationData");
                if (reservationData) {
                    navigate("/checkout", { state: JSON.parse(reservationData) });
                    sessionStorage.removeItem("reservationData");
                } else {
                    navigate("/account");
                }
            }, 2500);
        } else {
            setShowFailAlert(true);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-left">
                <h2 style={{ fontWeight: 100, textAlign: "center", fontSize: "3em" }}>SIGN IN</h2>
                <p style={{ fontWeight: 100, textAlign: "center", fontSize: "1.6em", marginBottom: "60px" }}>View and edit your account to customize your preferences.</p>

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
                        Login successful! Redirecting to homepage...
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
                        Login Failed. Incorrect email or password.
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

                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        style={{ marginTop: "30px", marginBottom: "30px" }}
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <button type="submit" className="signin-button"><strong>SIGN IN</strong></button>

                    <p className="register-link" style={{ fontWeight: 100, fontSize: "1.2em" }}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                    <p className="forgot-link" style={{ fontWeight: 100, fontSize: "1.2em" }}>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </p>
                </form>
            </div>

            <div className="signin-right" style={{ backgroundImage: "url('/uploads/LOGIN_LANDING_PHOTO.jpeg')" }}>
            </div>
        </div>
    );
}

export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "POST",
                    credentials: "include",  // This ensures cookies are sent
                    headers: { 'Content-Type': 'application/json' }
                });
        
                const data = await response.text();
        
                if (response.ok && data.includes("is already logged in")) {
                    console.log("User is already logged in, redirecting to homepage");
                    navigate("/"); // Redirect to homepage
                } else {
                    console.log("No active session found.");
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",  // Include credentials for login request
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            alert("Login successful!");
            console.log(`${email} logged in successfully.`);
            navigate("/"); // Redirect to homepage after successful login
        } else {
            const errorMessage = await response.text();
            alert("Login failed: " + errorMessage);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-left">
                <h2 style={{ fontWeight: 100, textAlign: "center", fontSize: "3em" }}>SIGN IN</h2>
                <p style={{ fontWeight: 100, textAlign: "center", fontSize: "1.6em", marginBottom: "60px" }}>View and edit your account to customize your preferences.</p>

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
                                color: 'black',  // Change label color when focused
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: 'black',  // Change underline color when focused
                            },
                            '& .MuiInputLabel-asterisk': {
                                color: 'red',  // Change color of required asterisk
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
                                color: 'red',// Change color of required asterisk
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
                </form>
            </div>

            <div className="signin-right" style={{ backgroundImage: "url('/uploads/LOGIN_LANDING_PHOTO.jpeg')" }}>
            </div>
        </div>
    );
}

export default Login;

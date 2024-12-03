import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import '../styles/ResetPassword.css';

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showFirstPassword, setShowFirstPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailAlert, setShowFailAlert] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const token = new URLSearchParams(location.search).get("token");

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                navigate("/invalid-token");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/validate-token?token=${token}`);
                if (!response.ok) {
                    navigate("/invalid-token");
                }
            } catch (error) {
                console.error("Error validating token:", error);
                navigate("/invalid-token");
            }
        };

        validateToken();
    }, [token, navigate]);

    const handleClickShowPassword = () => {
        setShowFirstPassword(!showFirstPassword);
        setShowSecondPassword(!showSecondPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        const response = await fetch("http://localhost:8080/api/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword: password, confirmPassword, token }),
        });

        if (response.ok) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                navigate("/login");
            }, 2500);
        } else {
            setShowFailAlert(true);
        }
    };


    return (
        <div className="resetpassword-container">
            <div className="resetpassword-left">
                <h2 style={{ fontWeight: 100, textAlign: "center", fontSize: "3em" }}>RESET PASSWORD</h2>
                <p style={{ fontWeight: 100, textAlign: "center", fontSize: "1.6em", marginBottom: "40px" }}>Enter your new password to reset it.</p>

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
                        Password reset successful! Redirecting to login page...
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
                        Password reset failed. Please try again.
                    </Alert>
                )}

                {!passwordsMatch && (
                    <Alert
                        severity="warning"
                        sx={{
                            maxWidth: "570px",
                            margin: "0 auto",
                            textAlign: "center",
                            marginBottom: "20px"
                        }}
                    >
                        Passwords do not match. Please try again.
                    </Alert>
                )}

                <form className="resetpassword-form" onSubmit={handleSubmit}>
                    <TextField
                        id="new-password-input"
                        label="New Password"
                        type={showFirstPassword ? "text" : "password"}
                        variant="standard"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
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
                                        {showFirstPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        id="confirm-password-input"
                        label="Confirm New Password"
                        type={showSecondPassword ? "text" : "password"}
                        variant="standard"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        style={{ marginBottom: "30px" }}
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
                                        {showSecondPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <button type="submit" className="resetpassword-button"><strong>RESET PASSWORD</strong></button>
                </form>
            </div>

            <div className="resetpassword-right" style={{ backgroundImage: "url('/uploads/RESET_PASSWORD_LANDING_PHOTO.jpg')" }}>
            </div>
        </div>
    );
}

export default ResetPassword;

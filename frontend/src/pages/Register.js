import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import "../styles/Register.css";
import { useNavigate } from 'react-router-dom';

function Register() {
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const response = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: title, firstname: firstName, lastname: lastName, email, password }),
        });

        if (response.ok) {
            const loginResponse = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (loginResponse.ok) {
                alert("Registration and login successful!");
                navigate("/");
            } else {
                alert("Registration successful, but automatic login failed. Please log in manually.");
                navigate("/login");
            }
        } else {
            const errorData = await response.text();

            if (errorData === "User with this email already exists.") {
                setErrorMessage("An account with this email already exists.");
            } else {
                setErrorMessage("Registration failed. Please try again.");
            }
        }
    };

    //TODO: fix the title not being inputted into the database


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

    return (
        <div className="register-container">
            <div className="register-left">
                <h2 style={{ fontWeight: 100, textAlign: "center", fontSize: "3em" }}>CREATE PROFILE</h2>
                <p style={{ fontWeight: 100, textAlign: "center", fontSize: "1.6em", marginBottom: "60px" }}>Create an account to personalize your experience</p>

                <form className="register-form" onSubmit={handleSubmit}>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="form-row">
                        <FormControl style={{ width: 100 }} variant="standard">
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">Title</InputLabel>
                            <NativeSelect
                                onChange={(e) => setTitle(e.target.value)}
                                inputProps={{ name: 'title', id: 'uncontrolled-native' }}
                                defaultValue={"Mr"}
                                sx={{
                                    '& .MuiNativeSelect-root': { fontWeight: 'bold' },
                                    '& .MuiInputLabel-root': { color: 'black' },
                                    '& .MuiNativeSelect-icon': { color: 'black' },
                                    '&:before': { borderBottomColor: 'black' },
                                    '&:after': { borderBottomColor: 'black' },
                                }}
                            >
                                <option value={"Mr"}>Mr</option>
                                <option value={"Mrs"}>Mrs</option>
                                <option value={"Miss"}>Miss</option>
                                <option value={"Ms"}>Ms</option>
                                <option value={"Dr"}>Dr</option>
                            </NativeSelect>
                        </FormControl>

                        <TextField
                            id="standard-basic"
                            label="First Name"
                            variant="standard"
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            sx={{
                                '& label.Mui-focused': { color: 'black' },
                                '& .MuiInput-underline:after': { borderBottomColor: 'black' },
                                '& .MuiInputLabel-asterisk': { color: 'red' },
                                marginLeft: "20px"
                            }}
                        />
                    </div>

                    <TextField
                        id="standard-basic"
                        label="Last Name"
                        variant="standard"
                        fullWidth
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        sx={{
                            '& label.Mui-focused': { color: 'black' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'black' },
                            '& .MuiInputLabel-asterisk': { color: 'red' },
                            marginBottom: "20px"
                        }}
                    />

                    <TextField
                        id="standard-basic"
                        label="Email"
                        variant="standard"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            '& label.Mui-focused': { color: 'black' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'black' },
                            '& .MuiInputLabel-asterisk': { color: 'red' },
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
                        style={{ marginTop: "20px", marginBottom: "30px" }}
                        sx={{
                            '& label.Mui-focused': { color: 'black' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'black' },
                            '& .MuiInputLabel-asterisk': { color: 'red' },
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

                    <button type="submit" className="register-button"><strong>CREATE PROFILE</strong></button>
                </form>
            </div>

            <div className="register-right" style={{ backgroundImage: "url('/uploads/LOGIN_LANDING_PHOTO.jpeg')" }}>
            </div>
        </div>
    );
}

export default Register;

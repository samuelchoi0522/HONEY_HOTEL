import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            alert("Login successful!");
            // Redirect to homepage or perform other actions
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
                    <label htmlFor="email" style={{ fontWeight: 100 }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password" style={{ fontWeight: 100 }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit"><strong>SIGN IN</strong></button> 
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

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sign-in.css';

function SignIn() {
  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Sign In</button>
      </form>
      <p className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default SignIn;

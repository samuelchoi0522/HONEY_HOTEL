import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/Sign-in.css';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) =>{
      e.preventDefault();
  
      const response = await fetch("http://localhost:8080/api/login", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({email, password}),
      });
  
      if(response.ok){
          alert("Login successful!");
      }
      else{
          alert("Login failed. Please try again.");
      }
  };

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

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        newEmail: '',
        phone: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form Submitted:', formData);
        navigate('/home'); // Example navigation
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                {/* Left Section: Reset Password and Change Email */}
                <div style={{ width: '45%', padding: '20px' }}>
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Please enter email associated with your account"
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />

                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />

                        <label htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Match/No Match"
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </form>

                    <h2>Change Email</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="newEmail">New Email*</label>
                        <input
                            type="email"
                            id="newEmail"
                            name="newEmail"
                            value={formData.newEmail}
                            onChange={handleChange}
                            placeholder="Please enter new email"
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />

                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Please enter password associated with your account"
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />

                        <label htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
                        />
                    </form>
                </div>

                {/* Right Section: Reservations */}
                <div style={{ width: '45%', padding: '20px' }}>
                    <h2>Reservations</h2>
                    <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{color: 'black'}}>Active Bookings</h3>
                        <div style={{ backgroundColor: '#eaeaea', minHeight: '100px', marginBottom: '20px', padding: '10px' }}>
                            {/* Active Bookings will be dynamically loaded here */}
                        </div>

                        <h3 style={{color: 'black'}}>Previous Bookings</h3>
                        <div style={{ backgroundColor: '#eaeaea', minHeight: '100px', marginBottom: '20px', padding: '10px' }}>
                            {/* Previous Bookings will be dynamically loaded here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;

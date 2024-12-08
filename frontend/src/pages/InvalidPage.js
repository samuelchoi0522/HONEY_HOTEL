import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InvalidPage.css';

const InvalidPage = () => {
    return (
        <div className="invalid-page-container">
            <div className="invalid-page-content">
                <h1 className="invalid-page-title">404</h1>
                <h2 className="invalid-page-subtitle">Page Not Found</h2>
                <p className="invalid-page-message">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <Link to="/" className="invalid-page-home-button">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default InvalidPage;

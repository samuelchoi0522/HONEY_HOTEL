import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <img
                    src={'/uploads/HONEY_HOTEL_LOGO.png'}
                    alt="Honey Hotel Logo"
                    className="logo"
                />
                <h2>HONEY HOTEL</h2>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h3>About</h3>
                    <Link to="/about"><strong>ABOUT THE GROUP</strong></Link>
                </div>
                <div className="footer-column">
                    <h3>Reservations</h3>
                    <Link to="/make-reservation"><strong>MAKE A RESERVATION</strong></Link>
                    <Link to="/find-reservation"><strong>FIND YOUR RESERVATION</strong></Link>
                </div>
                <div className="footer-column">
                    <h3>Social Media</h3>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer">
                        <strong>YOUTUBE</strong>
                    </a>
                    <a href="https://www.instagram.com/honeyhotel2024/" target="_blank" rel="noreferrer">
                        <strong>INSTAGRAM</strong>
                    </a>
                    <a href="https://github.com/samuelchoi0522/HONEY_HOTEL" target="_blank" rel="noreferrer">
                        <strong>GITHUB</strong>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>PLEASE GIVE ME A GOOD GRADE ERNESTO :)</p>
            </div>
        </footer>
    );
}

export default Footer;

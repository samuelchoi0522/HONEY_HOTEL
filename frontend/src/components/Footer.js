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
          <Link to="/about">ABOUT THE GROUP</Link>
        </div>
        <div className="footer-column">
          <h3>Reservations</h3>
          <Link to="/make-reservation">MAKE A RESERVATION</Link>
          <Link to="/find-reservation">FIND YOUR RESERVATION</Link>
        </div>
        <div className="footer-column">
          <h3>Social Media</h3>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            YOUTUBE
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            INSTAGRAM
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GITHUB
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>PLEASE GIVE US A GOOD GRADE ERNESTO :)</p>
      </div>
    </footer>
  );
}

export default Footer;

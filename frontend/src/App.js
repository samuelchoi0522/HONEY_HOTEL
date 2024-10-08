import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NavbarWhite from './components/Navbar_WHITE';
import Footer from './components/Footer';
import Reservation from './pages/Reservation';

import './styles/App.css';

function Layout() {
    const location = useLocation();

    // Conditionally render Navbar and Footer only on specific pages
    const showNavbarAndFooter = location.pathname.toLowerCase() !== '/login' && location.pathname.toLowerCase() !== '/register';
    const showNavbarForLoginAndRegister = location.pathname.toLowerCase() === '/login' || location.pathname.toLowerCase() === '/register';

    return (
        <div className="app-container">
            {showNavbarAndFooter && <Navbar />}
            {showNavbarForLoginAndRegister && <NavbarWhite />}
            <Routes>
                <Route path="/" exact element={<Homepage />} />
                <Route path="/login" element={<Login />} /> {/* Login page without Navbar and Footer */}
                <Route path="/register" element={<Register />} /> {/* Register page without Navbar and Footer */}
                <Route path="/reservation" element={<Reservation/>}/>
            </Routes>
            {showNavbarAndFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NavbarWhite from './components/Navbar_WHITE';
import NavbarFindHives from './components/Navbar_FindHives';
import CheckRatesBar from './components/CheckRatesBar';
import Footer from './components/Footer';
import AccountPage from './pages/AccountPage'
import Reservation from './pages/Reservation';
import FindHive from './pages/FindHive';
import RoomDetails from './pages/RoomDetails';
import AddVacationPackage from './pages/AddVacationPackage';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import './styles/App.css';

function Layout() {
    const location = useLocation();

    const showNavbarAndFooter =
        location.pathname.toLowerCase() !== '/login' &&
        location.pathname.toLowerCase() !== '/register' &&
        location.pathname.toLowerCase() !== '/forgot-password' &&
        location.pathname.toLowerCase() !== '/reset-password';
    
    const showEmptyNavbar =
        location.pathname.toLowerCase() === '/login' ||
        location.pathname.toLowerCase() === '/register' ||
        location.pathname.toLowerCase() === '/forgot-password' ||
        location.pathname.toLowerCase() === '/reset-password';
    
    const showNavbarForFindHive = location.pathname.toLowerCase() === '/find-hive';
    return (
        <div className="app-container">
            {showNavbarAndFooter && <Navbar />}
            {showEmptyNavbar && <NavbarWhite />}
            {showNavbarForFindHive && <NavbarFindHives />}
            {showNavbarForFindHive && <CheckRatesBar />}
            <Routes>
                <Route path="/" exact element={<Homepage />} />
                <Route path="/login" element={<Login />} /> {/* Login page without Navbar and Footer */}
                <Route path="/register" element={<Register />} /> {/* Register page without Navbar and Footer */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/find-hive" element={<FindHive />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/room-details" element={<RoomDetails />} />
                <Route path="/add-vacation-package" element={<AddVacationPackage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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

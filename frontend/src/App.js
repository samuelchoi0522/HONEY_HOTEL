import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NavbarWhite from './components/Navbar_WHITE';
import NavbarFindHives from './components/Navbar_FindHives';
import CheckRatesBar from './components/CheckRatesBar';
import Footer from './components/Footer';
import AccountPage from './pages/AccountPage'
import FindHive from './pages/FindHive';
import RoomDetails from './pages/RoomDetails';
import AddVacationPackage from './pages/AddVacationPackage';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import ReservationDetails from './pages/ReservationDetails';
import UserDetails from './pages/UserDetails';
import InvalidPage from './pages/InvalidPage';
import Confirmation from './pages/Confirmation';

import './styles/App.css';
import Clerk from "./pages/Clerk";
import ClerkReservationPage from "./pages/Clerk";

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
                <Route path="/room-details" element={<RoomDetails />} />
                <Route path="/add-vacation-package" element={<AddVacationPackage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-dashboard/view/:id/:bookingId" element={<ReservationDetails />} />
                <Route path="/admin-dashboard/view/user/:id" element={<UserDetails />} />
                <Route path="/invalid-page" element={<InvalidPage />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/clerk/dashboard" element={<ClerkReservationPage />} />

                <Route path="*" element={<Navigate to="/invalid-page" />} />
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

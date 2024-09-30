import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" exact element={<Homepage />} />
                    <Route path="/Login" element={<Login />} /> {/* Route for SignIn */}
                    <Route path="/register" element={<Register />} /> {/* Route for Register */}
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

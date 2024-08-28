import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Homepage from './pages/Homepage';
import SignIn from './pages/Sign-in';
import Register from './pages/Register';
import Navbar from './components/Navbar';


import './styles/App.css';

function App() {
  return (
    <Router>
        <Navbar />
         <Routes>
            <Route path="/" exact element={<Homepage />} />
            <Route path="/signin" element={<SignIn />} /> {/* Route for SignIn */}
            <Route path="/register" element={<Register />} /> {/* Route for Register */}
         </Routes>
    </Router>
  );
}

export default App;

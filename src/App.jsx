 import React, { useState } from 'react'; // useEffect ki zaroorat nahi ab
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';


const App = () => {
    // FIX: State initialize karte waqt hi LocalStorage check kar lo (No useEffect needed)
    const [user, setUser] = useState(() => {
        return localStorage.getItem('username') || null;
    });

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleLoginSuccess = (username, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setUser(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <div className="App">
                    <Navbar user={user} onLogout={handleLogout} />
                    
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
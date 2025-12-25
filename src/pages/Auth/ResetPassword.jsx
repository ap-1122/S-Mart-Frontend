import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Wahi purani styling use karenge

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // URL se token nikalo (e.g., ?token=abcdef...)
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        
        if (!token) {
            alert("Invalid Link! Token missing.");
            return;
        }

        try {
            // Backend ko Token + New Password bhejo
            await axios.post("http://localhost:8080/auth/reset-password", {
                token: token,
                newPassword: newPassword
            });
            
            alert("Success! Password has been reset.");
            navigate('/login'); // Login page par bhej do
        } catch (err) {
            console.error(err);
            setMessage("Failed: Link expired or invalid.");
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side */}
            <div className="auth-left">
                <h1>New Password</h1>
                <p>Create a strong password for your S-MART account.</p>
            </div>

            {/* Right Side */}
            <div className="auth-right">
                <div className="auth-box">
                    <h2>Set New Password</h2>
                    
                    {/* Error Message if any */}
                    {message && <p style={{color:'red', textAlign:'center'}}>{message}</p>}

                    {!token ? (
                        <p style={{color:'red', textAlign:'center'}}>
                            Invalid URL. Please check your email link again.
                        </p>
                    ) : (
                        <form onSubmit={handleReset}>
                            <input 
                                className="auth-input" 
                                type="password" 
                                placeholder="Enter New Password" 
                                value={newPassword}
                                onChange={(e)=>setNewPassword(e.target.value)} 
                                required 
                                style={{marginTop:'20px'}}
                            />

                            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'20px'}}>
                                UPDATE PASSWORD
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
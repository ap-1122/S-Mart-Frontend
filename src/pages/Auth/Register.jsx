 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import '../../pages/Auth/Auth.css'; // Path check karlena

const Register = () => {
    const navigate = useNavigate();
    
    // Initial State
    const [form, setForm] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        phone: '' // <-- Check Backend DTO: 'phone' or 'phoneNumber'?
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Sending Data:", form); // Console me dekho kya ja raha hai

        try {
            const res = await axios.post("http://localhost:8080/auth/register", form);
            console.log("Server Response:", res);
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error("Register Error:", err);
            
            // Error Details Padhna
            if (err.code === "ERR_NETWORK") {
                alert("Server nahi chal raha hai ya CORS Error hai! (Check Console)");
            } else {
                alert("Registration Failed: " + (err.response?.data || "Something went wrong"));
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <h1>Join S-MART</h1>
                <p>Experience the best shopping platform.</p>
            </div>
            <div className="auth-right">
                <div className="auth-box">
                    <h2>Create Account</h2>
                    <form onSubmit={handleRegister}>
                        <input name="username" placeholder="Full Name" className="auth-input" onChange={handleChange} required />
                        <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
                        
                        {/* Phone Field */}
                        <input name="phone" placeholder="Phone (+91...)" className="auth-input" onChange={handleChange} required />
                        
                        <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
                        
                        <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>REGISTER</button>
                    </form>
                    
                    <div className="top-right-link">
                        Already User? <Link to="/login" className="auth-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register;
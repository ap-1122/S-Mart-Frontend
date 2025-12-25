import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    // States
    const [method, setMethod] = useState('email'); 
    const [val, setVal] = useState('');
    
    // Steps: 1 = Send Code, 2 = Enter OTP & New Password
    const [step, setStep] = useState(1); 
    
    const [otp, setOtp] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(600); 

    useEffect(() => {
        let timer;
        if (step === 2 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // STEP 1: Send OTP
    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        const cleanVal = val.trim();
        
        try {
            // FIX: Null bhejne ki jagah sirf relevant field bhejo
            const payload = {};
            if (method === 'email') {
                payload.email = cleanVal;
            } else {
                payload.phoneNumber = cleanVal;
            }

            console.log("Sending OTP Request:", payload);
            await axios.post("http://localhost:8080/auth/send-otp", payload);
            
            alert(`Code sent to ${cleanVal}!`);
            setStep(2); 
            setTimeLeft(600);
        } catch (err) { 
            console.error(err);
            alert("Failed: " + (err.response?.data || "User not found")); 
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify & Reset
    const handleFinalReset = async (e) => {
        e.preventDefault();
        
        if(newPass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }
        if(otp.length < 4) {
             alert("Please enter valid OTP");
             return;
        }

        setLoading(true);
        const cleanVal = val.trim();

        try {
            // FIX: DTO match karne ke liye Payload Construction
            const payload = {
                otp: otp.trim(),
                newPassword: newPass
            };

            // Sirf wahi field add karo jo method hai (Null mat bhejo)
            if (method === 'email') {
                payload.email = cleanVal;
            } else {
                payload.phoneNumber = cleanVal;
            }

            console.log("Sending Final Reset Payload:", payload); // F12 dabakar Console check karna

            // Note: URL wahi hona chahiye jo tumhare PasswordController me mapped hai
            await axios.post("http://localhost:8080/auth/reset-password", payload);
            
            alert("Password Reset Successful! Login now.");
            navigate('/login');
        } catch (err) {
             console.error("Reset Failed Full Error:", err);
             const errMsg = err.response?.data?.message || err.response?.data || "Invalid OTP or Request Data";
             alert("Failed: " + errMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-left">
                <h1>Security Check</h1>
                <p>Recover your S-MART account safely.</p>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
                    
                    {step === 1 && (
                        <>
                            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                                <button type="button" onClick={()=>setMethod('email')} className="btn" style={{flex:1, background: method==='email'?'#0f172a':'#eee', color: method==='email'?'white':'black'}}>Email</button>
                                <button type="button" onClick={()=>setMethod('phone')} className="btn" style={{flex:1, background: method==='phone'?'#0f172a':'#eee', color: method==='phone'?'white':'black'}}>Phone</button>
                            </div>
                            <form onSubmit={handleSendCode}>
                                <input className="auth-input" placeholder={method==='email'?"Enter Email":"Phone (+91..)"} onChange={(e)=>setVal(e.target.value)} required />
                                <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}} disabled={loading}>
                                    {loading ? "Sending..." : "SEND CODE"}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleFinalReset}>
                            <div style={{marginBottom:'10px', textAlign:'center', color:'red', fontWeight:'bold'}}>
                                Expires in: {formatTime(timeLeft)}
                            </div>
                            
                            <input className="auth-input" placeholder="Enter OTP Code" onChange={(e)=>setOtp(e.target.value)} required maxLength="6"/>
                            <input className="auth-input" type="password" placeholder="New Password" onChange={(e)=>setNewPass(e.target.value)} required style={{marginTop:'15px'}}/>
                            <input className="auth-input" type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPass(e.target.value)} required style={{marginTop:'10px'}}/>
                            
                            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}} disabled={loading}>
                                {loading ? "Processing..." : "RESET PASSWORD"}
                            </button>
                            
                            <p style={{textAlign:'center', marginTop:'15px', cursor:'pointer', color:'#666'}} onClick={() => {setStep(1); setTimeLeft(600);}}>
                                Resend / Change Method?
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ForgotPassword;
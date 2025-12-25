//problemwirth this code 
// Issue 2: Phone OTP Password Reset Fails ("Invalid")
// Deep Analysis (Problem ki Jad): 🕵️‍♂️
// Tumhare current flow mein ek bahut badi Logical Galti hai jo maine pakdi hai. Dekho kya ho raha hai:
// Step 1 (UI): Tumne Phone number dala -> Backend ne OTP bheja (Redis mein save hua).
// Step 2 (UI - Verify): Tumne OTP dala aur "VERIFY OTP" dabaya.
// Frontend ne backend ke /verify-otp ko call kiya.
// Backend ne check kiya: "Haan OTP sahi hai."
// 👉 CRITICAL POINT: Backend ne security ke liye wo OTP Redis se DELETE kar diya (kyunki wo use ho chuka hai).

// Step 3 (UI - New Password): Tumne Naya Password dala aur "UPDATE" dabaya.
// Frontend ne backend ke /reset-password ko call kiya aur wahi same OTP dobara bheja.
// Backend ne Redis check kiya: "Arey, ye OTP to hai hi nahi (kyunki Step 2 mein delete ho gaya)".
// Result: Backend ne return kiya "Invalid OTP".
// Solution (Sahi Tareeka): Humein Step 2 (Verify) aur Step 3 (Update) ko milakar ek step banana hoga. User 
// OTP aur Naya Password ek sath dalega, aur hum seedha final API hit karenge. Beech mein verify karne ki zaroorat nahi hai.
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// const ForgotPassword = () => {
//     const navigate = useNavigate();
    
//     // States
//     const [method, setMethod] = useState('email'); 
//     const [val, setVal] = useState('');
    
//     // Steps: 1 = Send, 2 = Verify OTP, 3 = New Password
//     const [step, setStep] = useState(1); 
    
//     const [otp, setOtp] = useState('');
//     const [newPass, setNewPass] = useState('');
//     const [confirmPass, setConfirmPass] = useState('');
    
//     // Timer Logic (10 Minutes)
//     const [timeLeft, setTimeLeft] = useState(600); 

//     useEffect(() => {
//         let timer;
//         if (step === 2 && timeLeft > 0) {
//             timer = setInterval(() => {
//                 setTimeLeft((prev) => prev - 1);
//             }, 1000);
//         } else if (timeLeft === 0) {
//             clearInterval(timer);
//         }
//         return () => clearInterval(timer);
//     }, [step, timeLeft]);

//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//     };

//     // STEP 1: Code Bhejo
//     const handleSendCode = async (e) => {
//         e.preventDefault();
//         try {
//             const payload = method === 'email' ? { email: val } : { phoneNumber: val };
//             await axios.post("http://localhost:8080/auth/send-otp", payload);
//             alert(`Code sent to ${val}!`);
//             setStep(2); // Step 2 par bhejo (Sirf OTP mangne ke liye)
//             setTimeLeft(600);
//         } catch (err) { 
//             alert("Failed: " + (err.response?.data || "User not found")); 
//         }
//     };

//     // STEP 2: OTP Verify Karo
//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         try {
//             // Hum verify-otp call karenge check karne ke liye ki OTP sahi hai ya nahi
//             await axios.post("http://localhost:8080/auth/verify-otp", { 
//                 email: method === 'email' ? val : null,
//                 phoneNumber: method === 'phone' ? val : null,
//                 otp: otp
//             });
            
//             // Agar koi error nahi aaya, matlab OTP sahi hai
//             alert("OTP Verified Successfully!");
//             setStep(3); // Ab Step 3 par bhejo (Password Change ke liye)
//         } catch (err) { 
//             console.error(err);
//             alert("Wrong OTP! Please try again."); 
//         }
//     };
    
//     // STEP 3: Password Update Karo
//     const handleUpdatePassword = async (e) => {
//         e.preventDefault();
        
//         if(newPass !== confirmPass) {
//             alert("Passwords do not match!");
//             return;
//         }

//         try {
//             // Final API call to change password
//             await axios.post("http://localhost:8080/auth/reset-password", { 
//                 email: method === 'email' ? val : null,
//                 phoneNumber: method === 'phone' ? val : null,
//                 otp: otp, // OTP wapas bhejna padega security ke liye
//                 newPassword: newPass
//             });
//             alert("Password Reset Successful! Login now.");
//             navigate('/login');
//         } catch (err) {
//              console.error(err);
//              alert("Failed: " + (err.response?.data || "Error updating password"));
//         }
//     }

//     return (
//         <div className="auth-container">
//             <div className="auth-left">
//                 <h1>Security Check</h1>
//                 <p>Recover your S-MART account safely.</p>
//             </div>

//             <div className="auth-right">
//                 <div className="auth-box">
//                     <h2>
//                         {step === 1 && "Forgot Password"}
//                         {step === 2 && "Verify OTP"}
//                         {step === 3 && "Set New Password"}
//                     </h2>
                    
//                     {/* Step 1: Input Email/Phone */}
//                     {step === 1 && (
//                         <>
//                             <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
//                                 <button type="button" onClick={()=>setMethod('email')} className="btn" style={{flex:1, background: method==='email'?'#0f172a':'#eee', color: method==='email'?'white':'black'}}>Email</button>
//                                 <button type="button" onClick={()=>setMethod('phone')} className="btn" style={{flex:1, background: method==='phone'?'#0f172a':'#eee', color: method==='phone'?'white':'black'}}>Phone</button>
//                             </div>
//                             <form onSubmit={handleSendCode}>
//                                 <input className="auth-input" placeholder={method==='email'?"Enter Email":"Phone (+91..)"} onChange={(e)=>setVal(e.target.value)} required />
//                                 <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}}>SEND CODE</button>
//                             </form>
//                         </>
//                     )}

//                     {/* Step 2: Input OTP Only */}
//                     {step === 2 && (
//                         <form onSubmit={handleVerifyOtp}>
//                             <div style={{marginBottom:'10px', textAlign:'center', color:'red', fontWeight:'bold'}}>
//                                 Expires in: {formatTime(timeLeft)}
//                             </div>
//                             <input className="auth-input" placeholder="Enter 6-digit OTP" onChange={(e)=>setOtp(e.target.value)} required maxLength="6"/>
//                             <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}}>VERIFY OTP</button>
//                             <p style={{textAlign:'center', marginTop:'15px', cursor:'pointer', color:'#666'}} onClick={() => setStep(1)}>Wrong Email? Back</p>
//                         </form>
//                     )}

//                     {/* Step 3: Input New Password (OTP verified hone ke baad) */}
//                     {step === 3 && (
//                         <form onSubmit={handleUpdatePassword}>
//                             <input className="auth-input" type="password" placeholder="New Password" onChange={(e)=>setNewPass(e.target.value)} required />
//                             <input className="auth-input" type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPass(e.target.value)} required style={{marginTop:'10px'}}/>
//                             <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}}>UPDATE PASSWORD</button>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default ForgotPassword;
























//without new password create feature
//  import React, { useState } from 'react';
// import axios from 'axios';
// import './Auth.css'; // CSS Import zaroori hai

// const ForgotPassword = () => {
//     const [method, setMethod] = useState('email'); 
//     const [val, setVal] = useState('');
//     const [step, setStep] = useState(1);
//     const [otp, setOtp] = useState('');
//     const [newPass, setNewPass] = useState('');

//     const handleRequest = async (e) => {
//         e.preventDefault();
//         try {
//             const payload = method === 'email' ? { email: val } : { phoneNumber: val };
//             await axios.post("http://localhost:8080/auth/forgot-password", payload);
//             alert(`Sent to ${method}!`);
//             if(method === 'phone') setStep(2);
//         } catch (err) { alert("Failed: " + (err.response?.data || "Error")); }
//     };

//     const handleReset = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost:8080/auth/reset-password", { 
//                 phoneNumber: val, 
//                 otp: otp, 
//                 newPassword: newPass 
//             });
//             alert("Password Changed! Go to Login.");
//         } catch (err) { 
//             // FIX: 'err' ko use kiya taaki warning hat jaye
//             console.error("Reset Error:", err); 
//             alert("Reset Failed: " + (err.response?.data || "Something went wrong")); 
//         }
//     };

//     return (
//         <div className="auth-container">
//             {/* LEFT SIDE (Ye missing tha isliye ganda dikh raha tha) */}
//             <div className="auth-left">
//                 <h1>Security Check</h1>
//                 <p>Recover your S-MART account safely.</p>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="auth-right">
//                 <div className="auth-box">
//                     <h2>Forgot Password</h2>
                    
//                     <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
//                         <button type="button" onClick={()=>setMethod('email')} className="btn" style={{flex:1, background: method==='email'?'#0f172a':'#eee', color: method==='email'?'white':'black'}}>Email</button>
//                         <button type="button" onClick={()=>setMethod('phone')} className="btn" style={{flex:1, background: method==='phone'?'#0f172a':'#eee', color: method==='phone'?'white':'black'}}>Phone</button>
//                     </div>

//                     {step === 1 ? (
//                         <form onSubmit={handleRequest}>
//                             <input className="auth-input" placeholder={method==='email'?"Enter Email":"Phone (+91..)"} onChange={(e)=>setVal(e.target.value)} required />
//                             <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}}>SEND CODE</button>
//                         </form>
//                     ) : (
//                         <form onSubmit={handleReset}>
//                             <input className="auth-input" placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)} required />
//                             <input className="auth-input" type="password" placeholder="New Password" onChange={(e)=>setNewPass(e.target.value)} required />
//                             <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'15px'}}>RESET PASSWORD</button>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default ForgotPassword;
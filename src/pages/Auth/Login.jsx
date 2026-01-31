import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import '../../pages/Auth/Auth.css';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Attempting Login with:", form);

        try {
            const res = await axios.post("http://localhost:8080/auth/login", form);
            console.log("Login Success Data:", res.data);

            // ✅ 1. Save Token & Username
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            
            // ✅ 2. MOST IMPORTANT: Save Role for Protected Route
            // Agar backend se role null aaye to default "USER" maan lo
            const userRole = res.data.role || "USER";
            localStorage.setItem("role", userRole);

            // App.jsx state update (Agar zaroorat ho)
            if(onLoginSuccess) {
                onLoginSuccess(res.data.username, res.data.token);
            }

            // ✅ 3. Redirect Logic
            if (userRole === "ADMIN") {
                navigate('/admin/dashboard'); // Admin ko dashboard bhejo
            } else {
                navigate('/'); // User ko home bhejo
            }
            
        } catch (err) {
            console.error("Login Error Details:", err);
            if (err.response?.status === 404) {
                alert("Account nahi mila! Pehle Register karo.");
            } else if (err.response?.status === 401) {
                alert("Password Galat hai!");
            } else {
                alert("Login Failed: " + (err.response?.data?.message || "Error"));
            }
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axios.post("http://localhost:8080/auth/google", { token: response.credential });
            
            // ✅ Same logic for Google Login
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            
            const userRole = res.data.role || "USER";
            localStorage.setItem("role", userRole);

            if(onLoginSuccess) {
                onLoginSuccess(res.data.username, res.data.token);
            }
            
            if (userRole === "ADMIN") {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Google Login Failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <h1>Welcome Back</h1>
                <p>Login to access your S-MART account.</p>
            </div>
            <div className="auth-right">
                <div className="auth-box">
                    <h2>Sign In</h2>
                    <form onSubmit={handleLogin}>
                        <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
                        <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>LOGIN</button>
                    </form>

                    <div style={{marginTop:'15px', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: '0.9rem'}}>
                        <Link to="/forgot-password" style={{color:'var(--accent)', textDecoration:'none'}}>Forgot Password?</Link>
                        <Link to="/register" style={{color:'var(--accent)', fontWeight:'bold', textDecoration:'none'}}>Create Account</Link>
                    </div>

                    <div style={{marginTop:'20px', display:'flex', justifyContent:'center'}}>
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Failed")} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
























//updating to  role based 
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import '../../pages/Auth/Auth.css';

// const Login = ({ onLoginSuccess }) => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ email: '', password: '' });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         console.log("Attempting Login with:", form);

//         try {
//             const res = await axios.post("http://localhost:8080/auth/login", form);
//             console.log("Login Success Data:", res.data);

//             // Yahan backend se aaya username use ho raha hai
//             onLoginSuccess(res.data.username, res.data.token);
//             navigate('/');
            
//         } catch (err) {
//             console.error("Login Error Details:", err);

//             if (err.response?.status === 404) {
//                 alert("Account nahi mila! Pehle Register karo.");
//             } else if (err.response?.status === 401) {
//                 alert("Password Galat hai!");
//             } else if (err.code === "ERR_NETWORK") {
//                 alert("Connection Error: Backend server check karo ya CORS issue hai.");
//             } else {
//                 alert("Login Failed: " + (err.response?.data?.message || "Error"));
//             }
//         }
//     };

//     const handleGoogleSuccess = async (response) => {
//         try {
//             const res = await axios.post("http://localhost:8080/auth/google", { token: response.credential });
            
//             // FIX: "Google User" hata kar backend se aaya naam (res.data.username) laga diya
//             onLoginSuccess(res.data.username, res.data.token);
            
//             navigate('/');
//         } catch (err) {
//             console.error("Google Login Error:", err);
//             alert("Google Login Failed check console");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-left">
//                 <h1>Welcome Back</h1>
//                 <p>Login to access your S-MART account.</p>
//             </div>
//             <div className="auth-right">
//                 <div className="auth-box">
//                     <h2>Sign In</h2>
//                     <form onSubmit={handleLogin}>
//                         <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
//                         <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
//                         <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>LOGIN</button>
//                     </form>

//                     {/* --- UPDATE: Links for Forgot Pass & Create Account --- */}
//                     <div style={{
//                         marginTop:'15px', 
//                         display:'flex', 
//                         justifyContent:'space-between', 
//                         alignItems:'center',
//                         fontSize: '0.9rem'
//                     }}>
//                         <Link to="/forgot-password" style={{color:'var(--accent)', textDecoration:'none'}}>
//                             Forgot Password?
//                         </Link>
                        
//                         <Link to="/register" style={{color:'var(--accent)', fontWeight:'bold', textDecoration:'none'}}>
//                             Create Account
//                         </Link>
//                     </div>
//                     {/* ---------------------------------------------------- */}

//                     <div style={{marginTop:'20px', display:'flex', justifyContent:'center'}}>
//                         <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Failed")} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Login;














// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import '../../pages/Auth/Auth.css';

// const Login = ({ onLoginSuccess }) => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ email: '', password: '' });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         console.log("Attempting Login with:", form);

//         try {
//             const res = await axios.post("http://localhost:8080/auth/login", form);
//             console.log("Login Success Data:", res.data);

//             // Yahan backend se aaya username use ho raha hai
//             onLoginSuccess(res.data.username, res.data.token);
//             navigate('/');
            
//         } catch (err) {
//             console.error("Login Error Details:", err);

//             if (err.response?.status === 404) {
//                 alert("Account nahi mila! Pehle Register karo.");
//             } else if (err.response?.status === 401) {
//                 alert("Password Galat hai!");
//             } else if (err.code === "ERR_NETWORK") {
//                 alert("Connection Error: Backend server check karo ya CORS issue hai.");
//             } else {
//                 alert("Login Failed: " + (err.response?.data?.message || "Error"));
//             }
//         }
//     };

//     const handleGoogleSuccess = async (response) => {
//         try {
//             const res = await axios.post("http://localhost:8080/auth/google", { token: response.credential });
            
//             // FIX: "Google User" hata kar backend se aaya naam (res.data.username) laga diya
//             onLoginSuccess(res.data.username, res.data.token);
            
//             navigate('/');
//         } catch (err) {
//             console.error("Google Login Error:", err);
//             alert("Google Login Failed check console");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-left">
//                 <h1>Welcome Back</h1>
//                 <p>Login to access your S-MART account.</p>
//             </div>
//             <div className="auth-right">
//                 <div className="auth-box">
//                     <h2>Sign In</h2>
//                     <form onSubmit={handleLogin}>
//                         <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
//                         <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
//                         <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>LOGIN</button>
//                     </form>

//                     <div style={{marginTop:'15px', textAlign:'center'}}>
//                         <Link to="/forgot-password" style={{color:'var(--accent)', textDecoration:'none'}}>Forgot Password?</Link>
//                     </div>

//                     <div style={{marginTop:'20px', display:'flex', justifyContent:'center'}}>
//                         <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Failed")} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Login;





//is code me login karne per welcome google user bolta hai  so upper part ko update karke hamne email ya username dikhaya hai

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import '../../pages/Auth/Auth.css';

// const Login = ({ onLoginSuccess }) => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ email: '', password: '' });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         console.log("Attempting Login with:", form);

//         try {
//             const res = await axios.post("http://localhost:8080/auth/login", form);
//             console.log("Login Success Data:", res.data);

//             // App.jsx ko update karo
//             onLoginSuccess(res.data.username, res.data.token);
//             navigate('/');
            
//         } catch (err) {
//             console.error("Login Error Details:", err);

//             if (err.response?.status === 404) {
//                 alert("Account nahi mila! Pehle Register karo.");
//             } else if (err.response?.status === 401) {
//                 alert("Password Galat hai!");
//             } else if (err.code === "ERR_NETWORK") {
//                 alert("Connection Error: Backend server check karo ya CORS issue hai.");
//             } else {
//                 alert("Login Failed: " + (err.response?.data?.message || "Error"));
//             }
//         }
//     };

//     const handleGoogleSuccess = async (response) => {
//         try {
//             const res = await axios.post("http://localhost:8080/auth/google", { token: response.credential });
//             onLoginSuccess("Google User", res.data.token);
//             navigate('/');
//         } catch (err) {
//             console.error("Google Login Error:", err);
//             alert("Google Login Failed check console");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-left">
//                 <h1>Welcome Back</h1>
//                 <p>Login to access your S-MART account.</p>
//             </div>
//             <div className="auth-right">
//                 <div className="auth-box">
//                     <h2>Sign In</h2>
//                     <form onSubmit={handleLogin}>
//                         <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
//                         <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
//                         <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>LOGIN</button>
//                     </form>

//                     <div style={{marginTop:'15px', textAlign:'center'}}>
//                         <Link to="/forgot-password" style={{color:'var(--accent)', textDecoration:'none'}}>Forgot Password?</Link>
//                     </div>

//                     <div style={{marginTop:'20px', display:'flex', justifyContent:'center'}}>
//                         <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Failed")} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Login;








// // src/pages/Auth/Login.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import './Auth.css';
// import logo from '../../assets/logo.jpg';


// const Login = ({ onLoginSuccess }) => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({ email: '', password: '' });
//     const [error, setError] = useState('');

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post("http://localhost:8080/auth/login", form);
//             onLoginSuccess(res.data.username, res.data.token); // App.jsx ko update karo
//             navigate('/');
//         } catch (err) {
//             if (err.response?.status === 404) setError("User not found! Please Register.");
//             else if (err.response?.status === 401) setError("Wrong Password!");
//             else setError("Login failed. Try again.");
//         }
//     };

//     return (
//         <div className="auth-container">
//           <div className="auth-left">
//             {/* TEXT HATA KAR IMAGE LAGAYI */}
//             <img src={logo} alt="S-MART" style={{width: '180px', marginBottom: '20px'}} />
//             <p style={{fontSize: '1.2rem'}}>The smartest way to shop online.</p>
//         </div>
//             <div className="auth-right">
//                 <div className="top-right-link">
//                     New? <Link to="/register" className="auth-link">Create Account</Link>
//                 </div>
//                 <div className="auth-box">
//                     <h2>Sign In</h2>
//                     {error && <p style={{color:'red', marginBottom:'10px'}}>{error}</p>}
                    
//                     <form onSubmit={handleLogin}>
//                         <input name="email" type="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
//                         <input name="password" type="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
//                         <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>LOGIN</button>
//                     </form>

//                     <div style={{marginTop:'15px', textAlign:'center'}}>
//                         <Link to="/forgot-password" style={{color:'#666', fontSize:'0.9rem'}}>Forgot Password?</Link>
//                     </div>
                    
//                     <div style={{marginTop:'20px', display:'flex', justifyContent:'center'}}>
//                         <GoogleLogin onSuccess={(res) => console.log(res)} onError={() => setError("Google Failed")} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Login;
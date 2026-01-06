// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // --- YOUR ORIGINAL IMPORTS ---
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';

// // --- NEW ADMIN IMPORTS ---
// import AdminLayout from './layouts/AdminLayout';
// import AddProduct from './pages/admin/AddProduct'; 
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AdminDashboard from './pages/admin/AdminDashboard';

// const App = () => {
//     // YOUR ORIGINAL STATE LOGIC
//     const [user, setUser] = useState(() => {
//         return localStorage.getItem('username') || null;
//     });

//     const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//     const handleLoginSuccess = (username, token) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('username', username);
//         setUser(username);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('username');
//         setUser(null);
//     };

//     return (
//         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             <Router>
//                 <div className="App">
//                     {/* Navbar will show on all pages as per your original code */}
//                     <Navbar user={user} onLogout={handleLogout} />
                    
//                     <Routes>
//                         {/* --- YOUR ORIGINAL ROUTES (UNCHANGED) --- */}
//                         <Route path="/" element={<Home user={user} />} />
//                         <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
//                         <Route path="/register" element={<Register />} />
//                         <Route path="/forgot-password" element={<ForgotPassword />} />
//                         <Route path="/reset-password" element={<ResetPassword />} />

//                         {/* --- NEW ADMIN ROUTES (NESTED IN LAYOUT) --- */}
//                         <Route path="/admin" element={<AdminLayout />}>
//                             <Route index element={<AdminDashboard />} />
//                             <Route path="dashboard" element={<AdminDashboard />} />
//                             <Route path="add-product" element={<AddProduct />} />
//                             <Route path="brands" element={<AdminBrands />} />
//                             <Route path="categories" element={<AdminCategories />} />
//                         </Route>
//                     </Routes>
//                 </div>
//             </Router>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;








// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// // --- 1. Layouts ---
// // Screenshot image_0b1af3.png ke hisab se ye sahi hai:
// import AdminLayout from './layouts/AdminLayout';

// // --- 2. Public Pages ---
// // Screenshot image_0b1b6c.png ke hisab se:
// import Home from './pages/public/Home'; 

// // --- 3. Auth Pages ---
// // ⚠️ DHYAN DE: Tumhara folder 'Auth' (Capital A) hai.
// import Login from './pages/Auth/Login'; 

// // --- 4. Admin Pages ---
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AddProduct from './pages/admin/AddProduct';

// function App() {
//   return (
//     <div className="app-container">
//       <Routes>
//         {/* --- PUBLIC ROUTES --- */}
//         <Route path="/" element={<Home />} />
        
//         {/* --- AUTH ROUTES --- */}
//         <Route path="/login" element={<Login />} />
        
//         {/* --- ADMIN ROUTES --- */}
//         <Route path="/admin" element={<AdminLayout />}>
//           {/* Default Dashboard */}
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
          
//           {/* Other Admin Pages */}
//           <Route path="brands" element={<AdminBrands />} />
//           <Route path="categories" element={<AdminCategories />} />
//           <Route path="add-product" element={<AddProduct />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;



























// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// // Layouts
// import AdminLayout from './layouts/AdminLayout';

// // Public Pages
// import Home from './pages/public/Home'; // (Agar folder change kiya to path badal lena)
// import Login from './pages/auth/Login'; // (Ya jahan bhi login file hai)

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard'; // (Placeholder bana lena)
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AddProduct from './pages/admin/AddProduct'; // (Jo hum banayenge)

// function App() {
//   return (
//     <Routes>
//       {/* --- PUBLIC ROUTES (No Sidebar) --- */}
//       {/* Login bilkul safe rahega, uspe koi naya layout nahi lagega */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<h2>Register Page</h2>} />

//       {/* --- ADMIN ROUTES (With Sidebar Layout) --- */}
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route index element={<h2>Welcome Admin! Select an option from sidebar.</h2>} />
//         <Route path="dashboard" element={<h2>Dashboard Coming Soon</h2>} />
        
//         {/* Naye Pages jo abhi banaye */}
//         <Route path="brands" element={<AdminBrands />} />
//         <Route path="categories" element={<AdminCategories />} />
//         <Route path="add-product" element={<AddProduct />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;






















//after product listing optimization this is not needed
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
import AddProduct from './pages/admin/AddProduct'; 

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
                        
                        {/* Login Route */}
                        <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                        
                        {/* UPDATE: Register Route (Removed !user check to allow easy access) */}
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/admin/add-product" element={<AddProduct />} />
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;

//  import React, { useState } from 'react'; // useEffect ki zaroorat nahi ab
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Imports
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';


// const App = () => {
//     // FIX: State initialize karte waqt hi LocalStorage check kar lo (No useEffect needed)
//     const [user, setUser] = useState(() => {
//         return localStorage.getItem('username') || null;
//     });

//     const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//     const handleLoginSuccess = (username, token) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('username', username);
//         setUser(username);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('username');
//         setUser(null);
//     };

//     return (
//         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             <Router>
//                 <div className="App">
//                     <Navbar user={user} onLogout={handleLogout} />
                    
//                     <Routes>
//                         <Route path="/" element={<Home user={user} />} />
//                         <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
//                         <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
//                         <Route path="/forgot-password" element={<ForgotPassword />} />
//                         <Route path="/reset-password" element={<ResetPassword />} />
//                     </Routes>
//                 </div>
//             </Router>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;
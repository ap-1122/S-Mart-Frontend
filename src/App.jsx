 import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ProtectedRoute from './pages/Auth/ProtectedRoute'; 

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import CreateProductLayout from './components/admin/CreateProductLayout';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage'; // ✅ IMPORT
import AdminUsersPage from './pages/admin/AdminUsersPage';

import ProductDetailsPage from './components/pages/user/ProductDetailsPage';
import { CartProvider } from './components/pages/user/CartContext';
import CartPage from './components/pages/user/CartPage';
import CheckoutPage from "./components/pages/user/CheckoutPage";
import AddAddressPage from "./components/pages/user/AddAddressPage";
import MyOrdersPage from "./components/pages/user/MyOrdersPage";
import ProfilePage from "./components/pages/user/ProfilePage";

const App = () => {
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
        localStorage.removeItem('role'); 
        setUser(null);
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <CartProvider>
                <Router>
                    <div className="App">
                        <Navbar user={user} onLogout={handleLogout} />
                        
                        <Routes>
                            <Route path="/" element={<Home user={user} />} />
                            <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                        
                            {/* --- ADMIN ROUTES --- */}
                            {/* ✅ 1. Main Gate: ADMIN aur SELLER dono aa sakte hain */}
                            <Route path="/admin" element={
                                <ProtectedRoute allowedRoles={["ADMIN", "SELLER"]}>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }>
                                
                                <Route index element={
                                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="users" element={
                                   <ProtectedRoute allowedRoles={["ADMIN"]}>
                                      <AdminUsersPage />
                                </ProtectedRoute>
                                 } />
                                <Route path="dashboard" element={
                                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="brands" element={
                                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                                        <AdminBrands />
                                    </ProtectedRoute>
                                } />

                                <Route path="categories" element={
                                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                                        <AdminCategories />
                                    </ProtectedRoute>
                                } />

                                <Route path="add-product" element={<CreateProductLayout />} />

                                {/* ✅ FIXED LOCATION: Ab ye '/admin' ke andar hai */}
                                <Route path="orders" element={
                                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                                        <AdminOrdersPage />
                                    </ProtectedRoute>
                                } />
                                
                            </Route> 
                            {/* ⬆️ Yahan Admin ka bracket band ho raha hai. Iske andar hi sab kuch hona chahiye */}


                            {/* --- PUBLIC ROUTES --- */}
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            
                            {/* --- USER ROUTES --- */}
                            <Route path="/cart" element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}><CartPage /></ProtectedRoute>} />
                            <Route path="/checkout" element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}><CheckoutPage /></ProtectedRoute>} />
                            <Route path="/add-address" element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}><AddAddressPage /></ProtectedRoute>} />
                            <Route path="/my-orders" element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}><MyOrdersPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}><ProfilePage /></ProtectedRoute>} />
                            


                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </GoogleOAuthProvider>
    );
};

export default App;

















//update this to protect admin page from user  in upper code but seller and admin can access admin page but some feture are desable for seller 
// import React, { useState } from 'react'; 
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Imports
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';
// import ProtectedRoute from './pages/Auth/ProtectedRoute'; // ✅ 1. IMPORT ADDED

// // --- NEW ADMIN IMPORTS ---
// import AdminLayout from './layouts/AdminLayout';
// import CreateProductLayout from './components/admin/CreateProductLayout';
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AdminDashboard from './pages/admin/AdminDashboard';

// import ProductDetailsPage from './components/pages/user/ProductDetailsPage';

// // ✅ 1. Cart Imports Added
// import { CartProvider } from './components/pages/user/CartContext';
// import CartPage from './components/pages/user/CartPage';

// // ✅ 2. Checkout and Add Address Imports
// import CheckoutPage from "./components/pages/user/CheckoutPage";
// import AddAddressPage from "./components/pages/user/AddAddressPage";

// //MyOrder page
// import MyOrdersPage from "./components/pages/user/MyOrdersPage";

// //Profile Page
// import ProfilePage from "./components/pages/user/ProfilePage";

// const App = () => {
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
//         localStorage.removeItem('role'); // Role bhi clear karna chahiye
//         setUser(null);
//     };

//     return (
//         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             {/* ✅ 2. Wrap Application with CartProvider */}
//             <CartProvider>
//                 <Router>
//                     <div className="App">
//                         <Navbar user={user} onLogout={handleLogout} />
                        
//                         <Routes>
//                             <Route path="/" element={<Home user={user} />} />
                            
//                             {/* Login Route */}
//                             <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                            
//                             <Route path="/register" element={<Register />} />
//                             <Route path="/forgot-password" element={<ForgotPassword />} />
//                             <Route path="/reset-password" element={<ResetPassword />} />
                        
//                             {/* --- ADMIN ROUTES (SECURED) --- */}
//                             {/* ✅ Yahan humne Guard lagaya hai. Agar ADMIN nahi hai, to andar ke pages nahi khulenge */}
//                             <Route path="/admin" element={
//                                 <ProtectedRoute allowedRoles={["ADMIN"]}>
//                                     <AdminLayout />
//                                 </ProtectedRoute>
//                             }>
//                                 <Route index element={<AdminDashboard />} />
//                                 <Route path="dashboard" element={<AdminDashboard />} />
//                                 <Route path="add-product" element={<CreateProductLayout />} />
//                                 <Route path="brands" element={<AdminBrands />} />
//                                 <Route path="categories" element={<AdminCategories />} />
//                             </Route>

//                             {/* --- PUBLIC ROUTES --- */}
//                             <Route path="/product/:id" element={<ProductDetailsPage />} />
                            
//                             {/* --- USER SECURED ROUTES --- */}
//                             {/* ✅ Niche ke pages ke liye Login zaroori hai (USER, ADMIN, SELLER sab chalenge) */}
                            
//                             {/* ✅ 3. Cart Page Route Added */}
//                             <Route path="/cart" element={
//                                 <ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}>
//                                     <CartPage />
//                                 </ProtectedRoute>
//                             } />

//                             {/* ✅ 4. Checkout and Add Address Routes */}
//                             <Route path="/checkout" element={
//                                 <ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}>
//                                     <CheckoutPage />
//                                 </ProtectedRoute>
//                             } />
                            
//                             <Route path="/add-address" element={
//                                 <ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}>
//                                     <AddAddressPage />
//                                 </ProtectedRoute>
//                             } />

//                             {/* My Orders Page */}
//                             <Route path="/my-orders" element={
//                                 <ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}>
//                                     <MyOrdersPage />
//                                 </ProtectedRoute>
//                             } />

//                             {/* Profile Page */}
//                             <Route path="/profile" element={
//                                 <ProtectedRoute allowedRoles={["USER", "ADMIN", "SELLER"]}>
//                                     <ProfilePage />
//                                 </ProtectedRoute>
//                             } />
                            
//                         </Routes>
//                     </div>
//                 </Router>
//             </CartProvider>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;










//update this code protect admin page from user  in upper code

// import React, { useState } from 'react'; 
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Imports
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';

// // --- NEW ADMIN IMPORTS ---
// import AdminLayout from './layouts/AdminLayout';
// import CreateProductLayout from './components/admin/CreateProductLayout';
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AdminDashboard from './pages/admin/AdminDashboard';

// import ProductDetailsPage from './components/pages/user/ProductDetailsPage';

// // ✅ 1. Cart Imports Added
// import { CartProvider } from './components/pages/user/CartContext';
// import CartPage from './components/pages/user/CartPage';

// // ✅ 2. Checkout and Add Address Imports
// import CheckoutPage from "./components/pages/user/CheckoutPage";
// import AddAddressPage from "./components/pages/user/AddAddressPage";

// //MyOrder page
// import MyOrdersPage from "./components/pages/user/MyOrdersPage";

// //Profile Page
// import ProfilePage from "./components/pages/user/ProfilePage";

// const App = () => {
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
//             {/* ✅ 2. Wrap Application with CartProvider */}
//             <CartProvider>
//                 <Router>
//                     <div className="App">
//                         <Navbar user={user} onLogout={handleLogout} />
                        
//                         <Routes>
//                             <Route path="/" element={<Home user={user} />} />
                            
//                             {/* Login Route */}
//                             <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                            
//                             <Route path="/register" element={<Register />} />
//                             <Route path="/forgot-password" element={<ForgotPassword />} />
//                             <Route path="/reset-password" element={<ResetPassword />} />
                        
//                             {/* --- ADMIN ROUTES --- */}
//                             <Route path="/admin" element={<AdminLayout />}>
//                                 <Route index element={<AdminDashboard />} />
//                                 <Route path="dashboard" element={<AdminDashboard />} />
//                                 <Route path="add-product" element={<CreateProductLayout />} />
//                                 <Route path="brands" element={<AdminBrands />} />
//                                 <Route path="categories" element={<AdminCategories />} />
//                             </Route>

//                             {/* --- PUBLIC ROUTES --- */}
//                             <Route path="/product/:id" element={<ProductDetailsPage />} />
                            
//                             {/* ✅ 3. Cart Page Route Added */}
//                             <Route path="/cart" element={<CartPage />} />

//                             {/* ✅ 4. Checkout and Add Address Routes */}
//                             <Route path="/checkout" element={<CheckoutPage />} />
//                             <Route path="/add-address" element={<AddAddressPage />} />

//                             {/* My Orders Page */}
//                             <Route path="/my-orders" element={<MyOrdersPage />} />

//                             {/* Profile Page */}
//                             <Route path="/profile" element={<ProfilePage />} />
                            
//                         </Routes>
//                     </div>
//                 </Router>
//             </CartProvider>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;




















//adding cart functionality in upper code now add to cart are working 
// //after product listing optimization this is not needed
// import React, { useState } from 'react'; // useEffect ki zaroorat nahi ab
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Imports
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';
 



// // --- NEW ADMIN IMPORTS ---
// import AdminLayout from './layouts/AdminLayout';
// //import AddProduct from './pages/admin/AddProduct'; 
// import CreateProductLayout from './components/admin/CreateProductLayout';
// import AdminBrands from './pages/admin/AdminBrands';
// import AdminCategories from './pages/admin/AdminCategories';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ProductDetailsPage from './components/pages/user/ProductDetailsPage';
// //import UserHomePage from "./components/pages/user/UserHomePage";
 
// // --- NEW PUBLIC IMPORTS ---
// //import ProductDetails from './pages/public/ProductDetails';
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
                        
//                         {/* Login Route */}
//                         <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                        
//                         {/* UPDATE: Register Route (Removed !user check to allow easy access) */}
//                         <Route path="/register" element={<Register />} />
                        
//                         <Route path="/forgot-password" element={<ForgotPassword />} />
//                         <Route path="/reset-password" element={<ResetPassword />} />
                     
//                      {/* --- NEW ADMIN ROUTES (NESTED IN LAYOUT) --- */}
//                         <Route path="/admin" element={<AdminLayout />}>
//                             <Route index element={<AdminDashboard />} />
//                             <Route path="dashboard" element={<AdminDashboard />} />
//                             {/* <Route path="add-product" element={<AddProduct />} /> */}
//                             {/* ✅ Naya Wizard yahan connect kar diya */}
//                          <Route path="add-product" element={<CreateProductLayout />} />

//                             <Route path="brands" element={<AdminBrands />} />
//                             <Route path="categories" element={<AdminCategories />} />
//                         </Route>

//                         {/* --- NEW PUBLIC ROUTES --- */}
//                         {/* <Route path="/product/:id" element={<ProductDetails />} /> */}

//                         <Route path="/product/:id" element={<ProductDetailsPage />} />
                        
//                     </Routes>
//                 </div>
//             </Router>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;







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





















// but is milestone it is working fine 


//after product listing optimization this is not needed
// import React, { useState } from 'react'; // useEffect ki zaroorat nahi ab
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Imports
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Auth/Login';
// import Register from './pages/Auth/Register';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import ResetPassword from './pages/Auth/ResetPassword';
// import AddProduct from './pages/admin/AddProduct'; 

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
                        
//                         {/* Login Route */}
//                         <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                        
//                         {/* UPDATE: Register Route (Removed !user check to allow easy access) */}
//                         <Route path="/register" element={<Register />} />
                        
//                         <Route path="/forgot-password" element={<ForgotPassword />} />
//                         <Route path="/reset-password" element={<ResetPassword />} />
//                         <Route path="/admin/add-product" element={<AddProduct />} />
//                     </Routes>
//                 </div>
//             </Router>
//         </GoogleOAuthProvider>
//     );
// };

// export default App;

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
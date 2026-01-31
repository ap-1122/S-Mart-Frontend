 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, 
    FaTimes, FaRocket, FaCrown, FaStar // ✅ Star Icon import kiya
} from 'react-icons/fa'; 
import api from '../services/api'; 
import './UserSidebar.css';

const UserSidebar = ({ isOpen, onClose, user, onLogout }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    
    // Default false rakho
    const [isPrime, setIsPrime] = useState(false); 

    useEffect(() => {
        if (isOpen) {
            // ✅ FIX: Sidebar khulte hi pehle PURANA status hatao
            

            const checkPrimeStatus = async () => {
                try {
                    const res = await api.get('/subscription/status');
                    // ✅ Strict Checking
                    if (res.data && res.data.isPremium === true) {
                        setIsPrime(true);
                    } else {
                        setIsPrime(false);
                    }
                } catch (err) {
                    console.log("Sidebar Prime Check Failed", err);
                    setIsPrime(false); // Error aaye to bhi Crown hata do
                }
            };
            checkPrimeStatus();
        }
    }, [isOpen, user]); // ✅ 'user' change hone par bhi check karega

    if (!isOpen) return null;

    const handleNavigation = (path) => {
        onClose(); 
        navigate(path); 
    };

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>

            <div className="sidebar-drawer">
                
                <div className="sidebar-header">
                    <div style={{alignSelf: 'flex-end', cursor: 'pointer'}} onClick={onClose}>
                        <FaTimes size={20} />
                    </div>
                    
                    {/* User Icon logic */}
                    <div className="sidebar-user-icon">
                        {isPrime ? (
                             // 👑 SIRF PRIME MEMBER KE LIYE CROWN
                             <div style={{position:'relative', display:'inline-block'}}>
                                <FaUser />
                                <FaCrown style={{
                                    position:'absolute', 
                                    top: '-15px', 
                                    right: '-10px', 
                                    color: '#FFD700', // Gold
                                    fontSize: '2rem',
                                    filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))',
                                    transform: 'rotate(15deg)' // Thoda style
                                }} />
                             </div>
                        ) : (
                             // 👤 NORMAL USER
                             <FaUser />
                        )}
                    </div>

                    <div className="sidebar-username">
                        <small style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Hello,</small><br/>
                        {user} 
                        
                        {/* 🏷️ Badge sirf Prime walo ko */}
                        {isPrime && (
                            <span style={{
                                marginLeft:'8px', fontSize:'0.7rem', 
                                background:'linear-gradient(45deg, #ea580c, #f59e0b)', 
                                color:'white', padding:'2px 8px', borderRadius:'10px',
                                verticalAlign: 'middle'
                            }}>
                                PRIME
                            </span>
                        )}
                    </div>
                </div>

                <div className="sidebar-menu">
                    
                    {(role === "ADMIN" || role === "SELLER") && (
                        <div 
                            className="sidebar-link admin-special-link" 
                            onClick={() => handleNavigation(role === 'ADMIN' ? '/admin/dashboard' : '/admin/add-product')}
                        >
                            <FaRocket /> 
                            {role === 'ADMIN' ? 'Admin Dashboard' : 'Sell Product'}
                        </div>
                    )}

                    {/* ✅ Menu Item Logic */}
                    <div className="sidebar-link" onClick={() => handleNavigation('/prime')} 
                         style={{
                             color: isPrime ? '#166534' : '#ea580c', 
                             fontWeight: isPrime ? 'bold' : 'normal'
                         }}
                    >
                        {isPrime ? (
                            // Agar Member hai -> Crown Icon
                            <><FaCrown /> My Membership</>
                        ) : (
                            // Agar Member nahi hai -> Star Icon (Crown hata diya)
                            <><FaStar /> Join S-Mart Prime</>
                        )}
                    </div>

                    <div className="sidebar-link" onClick={() => handleNavigation('/profile')}>
                        <FaUser /> My Profile
                    </div>

                    <div className="sidebar-link" onClick={() => handleNavigation('/my-orders')}>
                        <FaBoxOpen /> My Orders
                    </div>

                    <div className="sidebar-link" onClick={() => handleNavigation('/checkout')}>
                        <FaMapMarkerAlt /> Manage Addresses
                    </div>

                </div>

                <div className="sidebar-footer">
                    <button className="btn-logout-sidebar" onClick={() => { onClose(); onLogout(); }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

            </div>
        </>
    );
};

export default UserSidebar;













///update  this in upper code to add premium subscription button 


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, FaTimes, FaRocket } from 'react-icons/fa'; // FaRocket import kiya
// import './UserSidebar.css';

// const UserSidebar = ({ isOpen, onClose, user, onLogout }) => {
//     const navigate = useNavigate();

//     // 1. Role check karne ke liye
//     const role = localStorage.getItem("role");

//     if (!isOpen) return null;

//     const handleNavigation = (path) => {
//         onClose(); 
//         navigate(path); 
//     };

//     return (
//         <>
//             <div className="sidebar-overlay" onClick={onClose}></div>

//             <div className="sidebar-drawer">
                
//                 {/* Header */}
//                 <div className="sidebar-header">
//                     <div style={{alignSelf: 'flex-end', cursor: 'pointer'}} onClick={onClose}>
//                         <FaTimes size={20} />
//                     </div>
//                     <div className="sidebar-user-icon">
//                         <FaUser />
//                     </div>
//                     <div className="sidebar-username">
//                         <small style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Hello,</small><br/>
//                         {user}
//                     </div>
//                 </div>

//                 {/* Menu Options */}
//                 <div className="sidebar-menu">
                    
//                     {/* 🚀 ADMIN / SELLER SPECIAL BUTTON */}
//                     {/* Ye sirf tab dikhega jab user ADMIN ya SELLER ho */}
//                     {(role === "ADMIN" || role === "SELLER") && (
//                         <div 
//                             className="sidebar-link admin-special-link" 
//                             // ✅ CHANGE HERE: Admin ko Dashboard bhejo, Seller ko Add Product
//                             onClick={() => handleNavigation(role === 'ADMIN' ? '/admin/dashboard' : '/admin/add-product')}
//                         >
//                             <FaRocket /> 
//                             {role === 'ADMIN' ? 'Admin Dashboard' : 'Sell Product'}
//                         </div>
//                     )}

//                     {/* My Profile */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/profile')}>
//                         <FaUser /> My Profile
//                     </div>

//                     {/* My Orders */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/my-orders')}>
//                         <FaBoxOpen /> My Orders
//                     </div>

//                     {/* Manage Addresses */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/checkout')}>
//                         <FaMapMarkerAlt /> Manage Addresses
//                     </div>

//                 </div>

//                 {/* Footer (Logout) */}
//                 <div className="sidebar-footer">
//                     <button className="btn-logout-sidebar" onClick={() => { onClose(); onLogout(); }}>
//                         <FaSignOutAlt /> Logout
//                     </button>
//                 </div>

//             </div>
//         </>
//     );
// };

// export default UserSidebar;











//in uper code we added a special button for admin and seller to add products directly from sidebar

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';
// import './UserSidebar.css';

// const UserSidebar = ({ isOpen, onClose, user, onLogout }) => {
//     const navigate = useNavigate();

//     // Agar sidebar band hai to kuch mat dikhao (Performance)
//     if (!isOpen) return null;

//     // Link click hone par sidebar band ho jana chahiye
//     const handleNavigation = (path) => {
//         onClose(); // Sidebar band karo
//         navigate(path); // Page par jao
//     };

//     return (
//         <>
//             {/* 1. Background Overlay (Bahar click karne se band hoga) */}
//             <div className="sidebar-overlay" onClick={onClose}></div>

//             {/* 2. Main Sidebar Drawer */}
//             <div className="sidebar-drawer">
                
//                 {/* Header */}
//                 <div className="sidebar-header">
//                     <div style={{alignSelf: 'flex-end', cursor: 'pointer'}} onClick={onClose}>
//                         <FaTimes size={20} />
//                     </div>
//                     <div className="sidebar-user-icon">
//                         <FaUser />
//                     </div>
//                     <span className="sidebar-username">Hi, {user}</span>
//                 </div>

//                 {/* Menu Options */}
//                 <div className="sidebar-menu">
                    
//                     {/* My Profile */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/profile')}>
//                         <FaUser /> My Profile
//                     </div>

//                     {/* My Orders */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/my-orders')}>
//                         <FaBoxOpen /> My Orders
//                     </div>

//                     {/* Manage Addresses */}
//                     <div className="sidebar-link" onClick={() => handleNavigation('/checkout')}>
//                          {/* Abhi ke liye Checkout page par bhej rahe hain jahan address dikhte hain */}
//                          {/* Future me /manage-addresses bana denge */}
//                         <FaMapMarkerAlt /> Manage Addresses
//                     </div>

//                 </div>

//                 {/* Footer (Logout) */}
//                 <div className="sidebar-footer">
//                     <button className="btn-logout-sidebar" onClick={() => { onClose(); onLogout(); }}>
//                         <FaSignOutAlt /> Logout
//                     </button>
//                 </div>

//             </div>
//         </>
//     );
// };

// export default UserSidebar;
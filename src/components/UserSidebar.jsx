import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, FaTimes, FaRocket } from 'react-icons/fa'; // FaRocket import kiya
import './UserSidebar.css';

const UserSidebar = ({ isOpen, onClose, user, onLogout }) => {
    const navigate = useNavigate();

    // 1. Role check karne ke liye
    const role = localStorage.getItem("role");

    if (!isOpen) return null;

    const handleNavigation = (path) => {
        onClose(); 
        navigate(path); 
    };

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>

            <div className="sidebar-drawer">
                
                {/* Header */}
                <div className="sidebar-header">
                    <div style={{alignSelf: 'flex-end', cursor: 'pointer'}} onClick={onClose}>
                        <FaTimes size={20} />
                    </div>
                    <div className="sidebar-user-icon">
                        <FaUser />
                    </div>
                    <div className="sidebar-username">
                        <small style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Hello,</small><br/>
                        {user}
                    </div>
                </div>

                {/* Menu Options */}
                <div className="sidebar-menu">
                    
                    {/* 🚀 ADMIN / SELLER SPECIAL BUTTON */}
                    {/* Ye sirf tab dikhega jab user ADMIN ya SELLER ho */}
                    {(role === "ADMIN" || role === "SELLER") && (
                        <div 
                            className="sidebar-link admin-special-link" 
                            // ✅ CHANGE HERE: Admin ko Dashboard bhejo, Seller ko Add Product
                            onClick={() => handleNavigation(role === 'ADMIN' ? '/admin/dashboard' : '/admin/add-product')}
                        >
                            <FaRocket /> 
                            {role === 'ADMIN' ? 'Admin Dashboard' : 'Sell Product'}
                        </div>
                    )}

                    {/* My Profile */}
                    <div className="sidebar-link" onClick={() => handleNavigation('/profile')}>
                        <FaUser /> My Profile
                    </div>

                    {/* My Orders */}
                    <div className="sidebar-link" onClick={() => handleNavigation('/my-orders')}>
                        <FaBoxOpen /> My Orders
                    </div>

                    {/* Manage Addresses */}
                    <div className="sidebar-link" onClick={() => handleNavigation('/checkout')}>
                        <FaMapMarkerAlt /> Manage Addresses
                    </div>

                </div>

                {/* Footer (Logout) */}
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
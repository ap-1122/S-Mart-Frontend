import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const links = [
    { path: "/admin/dashboard", label: "📊 Dashboard" },
    { path: "/admin/brands", label: "🏷️ Brands" },
    { path: "/admin/categories", label: "🗂️ Categories" },
    { path: "/admin/add-product", label: "➕ Add Product" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <h2 style={{color: 'white'}}>S-<span style={{color: '#f97316'}}>MART</span></h2>
        <small>Admin Portal</small>
      </div>
      <nav>
        {links.map(link => (
          <NavLink key={link.path} to={link.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;














// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import './AdminSidebar.css'; // Iski CSS niche hai

// const AdminSidebar = () => {
//   const location = useLocation();

//   // Menu Items config
//   const menuItems = [
//     { path: '/admin/dashboard', label: '📊 Dashboard' },
//     { path: '/admin/brands', label: '🏷️ Brands' },
//     { path: '/admin/categories', label: '🗂️ Categories' },
//     { path: '/admin/attributes', label: '🎨 Attributes' }, // Color/Size
//     { path: '/admin/add-product', label: '📦 Add Product' }, // Main Logic
//     { path: '/admin/products', label: '📋 All Products' },
//   ];

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h2>S-MART <span className="admin-badge">Admin</span></h2>
//       </div>
//       <nav className="sidebar-nav">
//         {menuItems.map((item) => (
//           <Link 
//             key={item.path} 
//             to={item.path}
//             className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//       <div className="sidebar-footer">
//         <button className="logout-btn">Log Out</button>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;
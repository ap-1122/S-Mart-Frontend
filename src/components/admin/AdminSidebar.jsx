import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  // 1. Current Role nikalo
  const userRole = localStorage.getItem("role");

  // 2. Links define karo
  const allLinks = [
    { path: "/admin/dashboard", label: "📊 Dashboard", roles: ["ADMIN"] },
    { path: "/admin/orders", label: "📦 Orders", roles: ["ADMIN"] }, // ✅ NEW LINK ADDED
    { path: "/admin/users", label: "👥 Users", roles: ["ADMIN"] },
    { path: "/admin/brands", label: "🏷️ Brands", roles: ["ADMIN"] },
    { path: "/admin/categories", label: "🗂️ Categories", roles: ["ADMIN"] },
    { path: "/admin/add-product", label: "➕ Add Product", roles: ["ADMIN", "SELLER"] },
  ];

  // 3. Role ke hisab se filter karo
  const allowedLinks = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <h2 style={{color: 'white'}}>S-<span style={{color: '#f97316'}}>MART</span></h2>
        <small>{userRole === 'ADMIN' ? 'Admin Portal' : 'Seller Portal'}</small>
      </div>
      <nav>
        {allowedLinks.map(link => (
          <NavLink key={link.path} to={link.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;











//its working good but we update in upper code jisse admin sare orders access kar sake .

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import './AdminSidebar.css';

// const AdminSidebar = () => {
//   // 1. Current Role nikalo
//   const userRole = localStorage.getItem("role");

//   // 2. Links define karo aur batao kaun kisko dikhega
//   const allLinks = [
//     { path: "/admin/dashboard", label: "📊 Dashboard", roles: ["ADMIN"] },
//     { path: "/admin/brands", label: "🏷️ Brands", roles: ["ADMIN"] },
//     { path: "/admin/categories", label: "🗂️ Categories", roles: ["ADMIN"] },
//     { path: "/admin/add-product", label: "➕ Add Product", roles: ["ADMIN", "SELLER"] }, // ✅ Seller Allowed
//   ];

//   // 3. Role ke hisab se filter karo
//   // Agar role "ADMIN" hai to sab dikhega, agar "SELLER" hai to sirf Add Product
//   const allowedLinks = allLinks.filter(link => link.roles.includes(userRole));

//   return (
//     <div className="admin-sidebar">
//       <div className="sidebar-logo">
//         <h2 style={{color: 'white'}}>S-<span style={{color: '#f97316'}}>MART</span></h2>
//         <small>{userRole === 'ADMIN' ? 'Admin Portal' : 'Seller Portal'}</small>
//       </div>
//       <nav>
//         {allowedLinks.map(link => (
//           <NavLink key={link.path} to={link.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
//             {link.label}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;
















///adding role based special button for admin and seller in user sidebar
// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import './AdminSidebar.css';

// const AdminSidebar = () => {
//   const links = [
//     { path: "/admin/dashboard", label: "📊 Dashboard" },
//     { path: "/admin/brands", label: "🏷️ Brands" },
//     { path: "/admin/categories", label: "🗂️ Categories" },
//     { path: "/admin/add-product", label: "➕ Add Product" },
//   ];

//   return (
//     <div className="admin-sidebar">
//       <div className="sidebar-logo">
//         <h2 style={{color: 'white'}}>S-<span style={{color: '#f97316'}}>MART</span></h2>
//         <small>Admin Portal</small>
//       </div>
//       <nav>
//         {links.map(link => (
//           <NavLink key={link.path} to={link.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
//             {link.label}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;














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
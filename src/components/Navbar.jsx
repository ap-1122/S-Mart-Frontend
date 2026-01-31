import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaBars } from 'react-icons/fa'; 
import logo from '../assets/logo.jpg'; 
import UserSidebar from './UserSidebar'; 

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    
    // Sidebar Control
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ✅ 1. Search State
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ 2. Handle Search Logic
    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                // Home page par bhejo query param ke sath
                navigate(`/?search=${searchTerm}`);
            } else {
                // Agar khali hai to normal Home par bhejo
                navigate('/');
            }
        }
    };

    const styles = {
        nav: {
            background: '#0f172a', 
            padding: '10px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative' 
        },
        logoImg: { height: '50px', cursor: 'pointer', borderRadius: '5px' },
        search: {
            background: 'white', 
            padding: '8px 15px', 
            borderRadius: '25px', 
            display: 'flex', 
            alignItems: 'center', 
            maxWidth: '500px', 
            width: '100%',
            margin: '0 20px' 
        },
        input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', color: '#333' },
        actions: { display: 'flex', gap: '25px', alignItems: 'center' },
        btnInit: {
            display: 'flex', alignItems: 'center', gap: '5px', 
            background: '#f97316', color: 'white', border:'none', 
            padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold'
        },
        menuIcon: {
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'background 0.2s'
        }
    };

    return (
        <>
            <nav style={styles.nav}>
                <Link to="/">
                    <img src={logo} alt="S-MART" style={styles.logoImg} />
                </Link>

                <div style={styles.search}>
                    {/* ✅ Search Icon par click se bhi search hoga */}
                    <FaSearch color="#888" onClick={handleSearch} style={{cursor: 'pointer'}} />
                    
                    {/* ✅ Input Field Connected to State */}
                    <input 
                        type="text" 
                        placeholder="Search for products..." 
                        style={styles.input} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch} // Enter key support
                    />
                </div>

                <div style={styles.actions}>
                    {/* Cart Icon */}
                    <FaShoppingCart 
                        size={24} 
                        cursor="pointer" 
                        title="Cart" 
                        onClick={() => navigate('/cart')} 
                    />
                    
                    {user ? (
                        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                            
                            {/* User Name */}
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <FaUserCircle size={24} />
                                <span style={{fontWeight:'600'}}>{user}</span>
                            </div>

                            {/* Menu Icon */}
                            <div 
                                style={styles.menuIcon} 
                                onClick={() => setIsSidebarOpen(true)}
                                title="Menu"
                            >
                                <FaBars size={24} color="white" />
                            </div>

                        </div>
                    ) : (
                        <button style={styles.btnInit} onClick={() => navigate('/login')}>
                            <FaUserCircle size={18} /> Login
                        </button>
                    )}
                </div>
            </nav>

            <UserSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                user={user} 
                onLogout={onLogout} 
            />
        </>
    );
};

export default Navbar;




























//activating search bar in upper code 

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaSearch, FaUserCircle, FaBars } from 'react-icons/fa'; // FaBars naya icon hai
// import logo from '../assets/logo.jpg'; 
// import UserSidebar from './UserSidebar'; // Sidebar Import

// const Navbar = ({ user, onLogout }) => {
//     const navigate = useNavigate();
    
//     // Sidebar ko control karne ke liye State
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const styles = {
//         nav: {
//             background: '#0f172a', 
//             padding: '10px 40px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             color: 'white',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             position: 'relative' // Z-index ke liye safe side
//         },
//         logoImg: { height: '50px', cursor: 'pointer', borderRadius: '5px' },
//         search: {
//             background: 'white', 
//             padding: '8px 15px', 
//             borderRadius: '25px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             maxWidth: '500px', 
//             width: '100%',
//             margin: '0 20px' 
//         },
//         input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', color: '#333' },
//         actions: { display: 'flex', gap: '25px', alignItems: 'center' },
//         btnInit: {
//             display: 'flex', alignItems: 'center', gap: '5px', 
//             background: '#f97316', color: 'white', border:'none', 
//             padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold'
//         },
//         // Menu Icon ka style (Jo logout ki jagah aayega)
//         menuIcon: {
//             cursor: 'pointer',
//             padding: '8px',
//             borderRadius: '50%',
//             transition: 'background 0.2s'
//         }
//     };

//     return (
//         <>
//             <nav style={styles.nav}>
//                 <Link to="/">
//                     <img src={logo} alt="S-MART" style={styles.logoImg} />
//                 </Link>

//                 <div style={styles.search}>
//                     <FaSearch color="#888" />
//                     <input type="text" placeholder="Search for products..." style={styles.input} />
//                 </div>

//                 <div style={styles.actions}>
//                     {/* Cart Icon */}
//                     <FaShoppingCart 
//                         size={24} 
//                         cursor="pointer" 
//                         title="Cart" 
//                         onClick={() => navigate('/cart')} 
//                     />
                    
//                     {user ? (
//                         <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                            
//                             {/* User Name & Small Icon (Non-Clickable, sirf display) */}
//                             <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
//                                 <FaUserCircle size={24} />
//                                 <span style={{fontWeight:'600'}}>{user}</span>
//                             </div>

//                             {/* ✅ NEW: Menu Icon (Clickable) - Opens Sidebar */}
//                             <div 
//                                 style={styles.menuIcon} 
//                                 onClick={() => setIsSidebarOpen(true)}
//                                 title="Menu"
//                             >
//                                 <FaBars size={24} color="white" />
//                             </div>

//                         </div>
//                     ) : (
//                         <button style={styles.btnInit} onClick={() => navigate('/login')}>
//                             <FaUserCircle size={18} /> Login
//                         </button>
//                     )}
//                 </div>
//             </nav>

//             {/* ✅ Sidebar Component ko yahan inject kiya */}
//             <UserSidebar 
//                 isOpen={isSidebarOpen} 
//                 onClose={() => setIsSidebarOpen(false)} 
//                 user={user} 
//                 onLogout={onLogout} 
//             />
//         </>
//     );
// };

// export default Navbar;















//adding more fetures in navbar like complete profile section with logout and my orders and manage address  in Hamburger Menu
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import logo from '../assets/logo.jpg'; 

// const Navbar = ({ user, onLogout }) => {
//     const navigate = useNavigate();

//     const styles = {
//         nav: {
//             background: '#0f172a', 
//             padding: '10px 40px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             color: 'white',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         },
//         logoImg: { height: '50px', cursor: 'pointer', borderRadius: '5px' },
//         search: {
//             background: 'white', 
//             padding: '8px 15px', 
//             borderRadius: '25px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             maxWidth: '500px', 
//             width: '100%',
//             margin: '0 20px' 
//         },
//         input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', color: '#333' },
//         actions: { display: 'flex', gap: '25px', alignItems: 'center' },
//         btnInit: {
//             display: 'flex', alignItems: 'center', gap: '5px', 
//             background: '#f97316', color: 'white', border:'none', 
//             padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold'
//         }
//     };

//     return (
//         <nav style={styles.nav}>
//             <Link to="/">
//                 <img src={logo} alt="S-MART" style={styles.logoImg} />
//             </Link>

//             <div style={styles.search}>
//                 <FaSearch color="#888" />
//                 <input type="text" placeholder="Search for products..." style={styles.input} />
//             </div>

//             <div style={styles.actions}>
//                 {/* ✅ FIX: Added onClick to navigate to /cart */}
//                 <FaShoppingCart 
//                     size={24} 
//                     cursor="pointer" 
//                     title="Cart" 
//                     onClick={() => navigate('/cart')} 
//                 />
                
//                 {user ? (
//                     <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
//                         <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
//                             <FaUserCircle size={24} />
//                             <span style={{fontWeight:'600'}}>{user}</span>
//                         </div>
//                         <FaSignOutAlt onClick={onLogout} cursor="pointer" title="Logout" size={20} color="#ccc"/>
//                     </div>
//                 ) : (
//                     <button style={styles.btnInit} onClick={() => navigate('/login')}>
//                         <FaUserCircle size={18} /> Login
//                     </button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
















//adding working cart navbar clicable logo

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
// import logo from '../assets/logo.jpg'; 

// const Navbar = ({ user, onLogout }) => {
//     const navigate = useNavigate();

//     const styles = {
//         nav: {
//             background: '#0f172a', 
//             padding: '10px 40px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             color: 'white',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         },
//         logoImg: { height: '50px', cursor: 'pointer', borderRadius: '5px' },
//         search: {
//             background: 'white', 
//             padding: '8px 15px', 
//             borderRadius: '25px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             // ✅ UPDATED: Width control karne ke liye
//             maxWidth: '500px', 
//             width: '100%',
//             margin: '0 20px' 
//         },
//         input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', color: '#333' },
//         actions: { display: 'flex', gap: '25px', alignItems: 'center' },
//         btnInit: {
//             display: 'flex', alignItems: 'center', gap: '5px', 
//             background: '#f97316', color: 'white', border:'none', 
//             padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold'
//         }
//     };

//     return (
//         <nav style={styles.nav}>
//             <Link to="/">
//                 <img src={logo} alt="S-MART" style={styles.logoImg} />
//             </Link>

//             <div style={styles.search}>
//                 <FaSearch color="#888" />
//                 <input type="text" placeholder="Search for products..." style={styles.input} />
//             </div>

//             <div style={styles.actions}>
//                 <FaShoppingCart size={24} cursor="pointer" title="Cart" />
                
//                 {user ? (
//                     <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
//                         <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
//                             <FaUserCircle size={24} />
//                             <span style={{fontWeight:'600'}}>{user}</span>
//                         </div>
//                         <FaSignOutAlt onClick={onLogout} cursor="pointer" title="Logout" size={20} color="#ccc"/>
//                     </div>
//                 ) : (
//                     <button style={styles.btnInit} onClick={() => navigate('/login')}>
//                         <FaUserCircle size={18} /> Login
//                     </button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
























// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

// // Logo Import (Tumne kaha jpg hai)
// import logo from '../assets/logo.jpg'; 

// const Navbar = ({ user, onLogout }) => {
//     const navigate = useNavigate();

//     const styles = {
//         nav: {
//             background: '#0f172a', // Brand Blue
//             padding: '10px 40px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             color: 'white',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//         },
//         logoImg: { height: '50px', cursor: 'pointer', borderRadius: '5px' },
//         search: {
//             background: 'white', padding: '8px 15px', borderRadius: '25px', 
//             display: 'flex', alignItems: 'center', width: '35%'
//         },
//         input: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%' },
//         actions: { display: 'flex', gap: '25px', alignItems: 'center' },
//         btnInit: {
//             display: 'flex', alignItems: 'center', gap: '5px', 
//             background: '#f97316', color: 'white', border:'none', 
//             padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold'
//         }
//     };

//     return (
//         <nav style={styles.nav}>
//             <Link to="/">
//                 <img src={logo} alt="S-MART" style={styles.logoImg} />
//             </Link>

//             <div style={styles.search}>
//                 <FaSearch color="#888" />
//                 <input type="text" placeholder="Search for products..." style={styles.input} />
//             </div>

//             <div style={styles.actions}>
//                 <FaShoppingCart size={24} cursor="pointer" title="Cart" />
                
//                 {user ? (
//                     <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
//                         <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
//                             <FaUserCircle size={24} />
//                             <span style={{fontWeight:'600'}}>{user}</span>
//                         </div>
//                         <FaSignOutAlt onClick={onLogout} cursor="pointer" title="Logout" size={20} color="#ccc"/>
//                     </div>
//                 ) : (
//                     // Login Button with Icon
//                     <button style={styles.btnInit} onClick={() => navigate('/login')}>
//                         <FaUserCircle size={18} /> Login
//                     </button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
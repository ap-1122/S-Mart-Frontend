import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.jpg'; 

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const styles = {
        nav: {
            background: '#0f172a', 
            padding: '10px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
        }
    };

    return (
        <nav style={styles.nav}>
            <Link to="/">
                <img src={logo} alt="S-MART" style={styles.logoImg} />
            </Link>

            <div style={styles.search}>
                <FaSearch color="#888" />
                <input type="text" placeholder="Search for products..." style={styles.input} />
            </div>

            <div style={styles.actions}>
                {/* ✅ FIX: Added onClick to navigate to /cart */}
                <FaShoppingCart 
                    size={24} 
                    cursor="pointer" 
                    title="Cart" 
                    onClick={() => navigate('/cart')} 
                />
                
                {user ? (
                    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                            <FaUserCircle size={24} />
                            <span style={{fontWeight:'600'}}>{user}</span>
                        </div>
                        <FaSignOutAlt onClick={onLogout} cursor="pointer" title="Logout" size={20} color="#ccc"/>
                    </div>
                ) : (
                    <button style={styles.btnInit} onClick={() => navigate('/login')}>
                        <FaUserCircle size={18} /> Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
















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
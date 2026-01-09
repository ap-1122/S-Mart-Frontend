 import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';
// ✅ CHANGE: Added useLocation
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // ✅ CHANGE: Initialize location
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
            api.get('/products'),
            api.get('/categories/root')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ CHANGE: Check agar koi category lekar aaya hai
  useEffect(() => {
    if (location.state && location.state.category) {
        setActiveTab(location.state.category);
    }
  }, [location]);

  // ✅ NEW FILTER LOGIC (Bas ye add kiya hai)
  // Agar "All" hai to sab dikhao, nahi to categoryName match karo
  const filteredProducts = activeTab === "All" 
    ? products 
    : products.filter(prod => prod.categoryName === activeTab);

  return (
    <div className="home-container">
      
      {/* Hero Banner (Same as before) */}
      <div className="hero-banner">
        <h1>Welcome to <span style={{color:'#f97316'}}>S-MART</span></h1>
        <p>India's smartest shopping destination.</p>
      </div>

      {/* Filter Tabs (Same as before) */}
      <div className="filter-tabs">
         <button 
            className={`tab ${activeTab === "All" ? "active" : ""}`} 
            onClick={() => setActiveTab("All")}
         >
            All
         </button>
         
         {categories.map((cat) => (
            <button 
                key={cat.id} 
                className={`tab ${activeTab === cat.name ? "active" : ""}`} 
                onClick={() => setActiveTab(cat.name)}
            >
                {cat.name}
            </button>
         ))}
      </div>

      {/* Product Grid */}
      <div className="products-grid">
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length > 0 ? (  // ✅ CHANGE: 'products' ki jagah 'filteredProducts' use kiya
          filteredProducts.map((prod) => (
            <div 
                key={prod.id} 
                onClick={() => navigate(`/product/${prod.id}`)} 
                style={{cursor: 'pointer'}}
            >
                <ProductCard product={prod} />
            </div>
          ))
        ) : (
          <div className="no-products">No products found in {activeTab}.</div>
        )}
      </div>
    </div>
  );
};

export default Home;











//without filter logic
// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import ProductCard from '../components/ProductCard';
// import './Home.css';
// // ✅ 1. Import useNavigate
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeTab, setActiveTab] = useState("All");
//   const [loading, setLoading] = useState(true);

//   // ✅ 2. Initialize Hook
//   const navigate = useNavigate();

//   useEffect(() => {
//     // ... (Tumhara pura useEffect code same rahega, usme koi change nahi) ...
//     const fetchData = async () => {
//       try {
//         const [prodRes, catRes] = await Promise.all([
//             api.get('/products'),
//             api.get('/categories/root')
//         ]);
//         setProducts(prodRes.data);
//         setCategories(catRes.data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="home-container">
//       {/* ... (Hero Banner aur Filter Tabs same rahenge) ... */}
      
//       <div className="hero-banner">
//         <h1>Welcome to <span style={{color:'#f97316'}}>S-MART</span></h1>
//         <p>India's smartest shopping destination.</p>
//       </div>

//       <div className="filter-tabs">
//          {/* ... (Tabs code same rahega) ... */}
//          <button className={`tab ${activeTab === "All" ? "active" : ""}`} onClick={() => setActiveTab("All")}>All</button>
//          {categories.map((cat) => (
//             <button key={cat.id} className={`tab ${activeTab === cat.name ? "active" : ""}`} onClick={() => setActiveTab(cat.name)}>{cat.name}</button>
//          ))}
//       </div>

//       {/* Product Grid */}
//       <div className="products-grid">
//         {loading ? (
//           <p>Loading...</p>
//         ) : products.length > 0 ? (
//           products.map((prod) => (
//             // ✅ 3. Yahan 'div' add kiya hai click ke liye. 'key' yahan shift hogi.
//             <div 
//                 key={prod.id} 
//                 onClick={() => navigate(`/product/${prod.id}`)} 
//                 style={{cursor: 'pointer'}}
//             >
//                 {/* Tumhara Card component uske andar */}
//                 <ProductCard product={prod} />
//             </div>
//           ))
//         ) : (
//           <div className="no-products">No products found.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;











// import React, { useEffect, useState } from 'react';
//  import api from '../services/api';
//  import ProductCard from '../components/ProductCard'; // Import Card
// import './Home.css';

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]); // ✅ NEW: Categories State
//   const [activeTab, setActiveTab] = useState("All"); // ✅ NEW: To track active tab
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Parallel Fetching (Fast loading)
//         const [prodRes, catRes] = await Promise.all([
//             api.get('/products'),        // Sare products lao
//             api.get('/categories/root')  // ✅ Sare Main Categories lao
//         ]);

//         setProducts(prodRes.data);
//         setCategories(catRes.data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="home-container">
//       {/* Hero Banner */}
//       <div className="hero-banner">
//         <h1>Welcome to <span style={{color:'#f97316'}}>S-MART</span></h1>
//         <p>India's smartest shopping destination.</p>
//       </div>

//       {/* --- DYNAMIC FILTER TABS --- */}
//       <div className="filter-tabs">
//         {/* 1. 'All' Button Hamesha rahega */}
//         <button 
//             className={`tab ${activeTab === "All" ? "active" : ""}`}
//             onClick={() => setActiveTab("All")}
//         >
//             All
//         </button>

//         {/* 2. Backend se aayi hui Categories */}
//         {categories.map((cat) => (
//             <button 
//                 key={cat.id} 
//                 className={`tab ${activeTab === cat.name ? "active" : ""}`}
//                 onClick={() => setActiveTab(cat.name)}
//             >
//                 {cat.name}
//             </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="products-grid">
//         {loading ? (
//           <p>Loading...</p>
//         ) : products.length > 0 ? (
//           products.map((prod) => (
//             <ProductCard key={prod.id} product={prod} />
//           ))
//         ) : (
//           <div className="no-products">No products found.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;























//this is the new home page design with product fetching and display 
// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import ProductCard from '../components/ProductCard'; // Import Card
// import './Home.css'; // Ensure CSS exists

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- Fetch Products from Backend ---
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // Yeh wo GET endpoint hai jo humne check kiya tha
//         const res = await api.get('/products'); 
//         console.log("Fetched Products:", res.data); // Console me check karna data kaisa dikh raha hai
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="home-container">
//       {/* Hero Section (Banner) */}
//       <div className="hero-banner">
//         <h1>Welcome to <span style={{color:'#f97316'}}>S-MART</span></h1>
//         <p>India's smartest shopping destination.</p>
//       </div>

//       {/* Filter Tabs (Static for now) */}
//       <div className="filter-tabs">
//         <button className="tab active">All</button>
//         <button className="tab">Electronics</button>
//         <button className="tab">Mobiles</button>
//       </div>

//       {/* --- Product Grid Area --- */}
//       <div className="products-grid">
//         {loading ? (
//           <p style={{textAlign:'center', width:'100%'}}>Loading amazing products...</p>
//         ) : products.length > 0 ? (
//           products.map((prod) => (
//             <ProductCard key={prod.id} product={prod} />
//           ))
//         ) : (
//           <div className="no-products">
//             <h3>No products found properly.</h3>
//             <p>Admin panel se product add karo ya Backend check karo.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

















//last working code before new home page design
// // new home page with product and category display
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Backend se data lane ke liye
// import ProductCard from '../components/ProductCard'; // Product ko card design me dikhane ke liye
// import './Home.css'; // Styling file

// const Home = () => {
//   // --- 1. STATE MANAGEMENT (Data Store karne ki jagah) ---
  
//   // Saare products yahan store honge
//   const [products, setProducts] = useState([]);
  
//   // Saari categories (Electronics, Fashion) yahan store hongi
//   const [categories, setCategories] = useState([]);
  
//   // User ne abhi kaunsi category select ki hai? (Default: "All")
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- 2. DATA FETCHING (Backend se baat karna) ---
//   // Ye code tab chalega jab page pehli baar load hoga
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Step A: Public API se saare products mangwana
//         const prodRes = await axios.get("http://localhost:8080/public/products");
//         setProducts(prodRes.data);

//         // Step B: Admin API se categories mangwana (Dropdown/List ke liye)
//         const catRes = await axios.get("http://localhost:8080/admin/products/categories");
//         setCategories(catRes.data);
//       } catch (error) {
//         console.error("Error loading home data:", error);
//       }
//     };
//     // Function ko call kiya
//     loadData();
//   }, []);

//   // --- 3. FILTERING LOGIC (Product Chhatna) ---
//   // Agar "All" select hai to saare products dikhao
//   // Agar koi specific category select hai, to sirf uske products filter karo
//   const displayedProducts = selectedCategory === "All" 
//     ? products 
//     : products.filter(p => p.category && p.category.name === selectedCategory);

//   return (
//     <div className="home-container">
      
//       {/* --- SECTION 1: HERO BANNER (Welcome Screen) --- */}
//       {/* Ye tumhare S-MART theme (White/Orange) ke hisab se hai */}
//       <div className="hero-section">
//         <h1>Welcome to <span className="highlight-text">S-MART</span></h1>
//         <p className="sub-text">India's smartest shopping destination.</p>
//         <p className="greeting-text">Happy Shopping! 🛍️</p>
//       </div>

//       {/* --- SECTION 2: CATEGORY BAR (Filter Buttons) --- */}
//       <div className="category-section">
//         <div className="category-bar">
          
//           {/* 'All' Button - Ispe click karne se filter reset ho jayega */}
//           <button 
//             className={`cat-btn ${selectedCategory === "All" ? "active" : ""}`}
//             onClick={() => setSelectedCategory("All")}
//           >
//             All
//           </button>

//           {/* Dynamic Categories - Backend se jitni categories aayengi, utne buttons banenge */}
//           {categories.map((cat) => (
//             <button 
//               key={cat.id} 
//               // Agar ye category selected hai, to 'active' class add karo (Orange color ke liye)
//               className={`cat-btn ${selectedCategory === cat.name ? "active" : ""}`}
//               onClick={() => setSelectedCategory(cat.name)}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- SECTION 3: PRODUCT GRID (Main Content) --- */}
//       <div className="products-grid">
//         {/* Check karo: Products hain ya nahi? */}
//         {displayedProducts.length > 0 ? (
//           // Agar hain, to har product ke liye 'ProductCard' component banao
//           displayedProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))
//         ) : (
//           // Agar filter karne ke baad koi product nahi bacha
//           <div className="no-products">
//             <p>No products found in this category.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;













//old home page without product nad category display ,just basic welcome page
// // src/pages/Home.jsx
// import React from 'react';

// const Home = ({ user }) => {
//     return (
//         <div style={{ padding: '50px', textAlign: 'center' }}>
//             <h1 style={{fontSize:'3rem', color:'var(--primary)'}}>
//                 Welcome to <span style={{color:'var(--accent)'}}>S-MART</span>
//             </h1>
//             <p style={{fontSize:'1.2rem', marginTop:'10px', color:'#666'}}>
//                 India's smartest shopping destination.
//             </p>
//             {user && <h3 style={{marginTop:'30px'}}>Happy Shopping, {user}! 🛍️</h3>}
//         </div>
//     );
// };
// export default Home;
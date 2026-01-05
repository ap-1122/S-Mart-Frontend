
// new home page with product and category display
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Backend se data lane ke liye
import ProductCard from '../components/ProductCard'; // Product ko card design me dikhane ke liye
import './Home.css'; // Styling file

const Home = () => {
  // --- 1. STATE MANAGEMENT (Data Store karne ki jagah) ---
  
  // Saare products yahan store honge
  const [products, setProducts] = useState([]);
  
  // Saari categories (Electronics, Fashion) yahan store hongi
  const [categories, setCategories] = useState([]);
  
  // User ne abhi kaunsi category select ki hai? (Default: "All")
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- 2. DATA FETCHING (Backend se baat karna) ---
  // Ye code tab chalega jab page pehli baar load hoga
  useEffect(() => {
    const loadData = async () => {
      try {
        // Step A: Public API se saare products mangwana
        const prodRes = await axios.get("http://localhost:8080/public/products");
        setProducts(prodRes.data);

        // Step B: Admin API se categories mangwana (Dropdown/List ke liye)
        const catRes = await axios.get("http://localhost:8080/admin/products/categories");
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error loading home data:", error);
      }
    };
    // Function ko call kiya
    loadData();
  }, []);

  // --- 3. FILTERING LOGIC (Product Chhatna) ---
  // Agar "All" select hai to saare products dikhao
  // Agar koi specific category select hai, to sirf uske products filter karo
  const displayedProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category && p.category.name === selectedCategory);

  return (
    <div className="home-container">
      
      {/* --- SECTION 1: HERO BANNER (Welcome Screen) --- */}
      {/* Ye tumhare S-MART theme (White/Orange) ke hisab se hai */}
      <div className="hero-section">
        <h1>Welcome to <span className="highlight-text">S-MART</span></h1>
        <p className="sub-text">India's smartest shopping destination.</p>
        <p className="greeting-text">Happy Shopping! 🛍️</p>
      </div>

      {/* --- SECTION 2: CATEGORY BAR (Filter Buttons) --- */}
      <div className="category-section">
        <div className="category-bar">
          
          {/* 'All' Button - Ispe click karne se filter reset ho jayega */}
          <button 
            className={`cat-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {/* Dynamic Categories - Backend se jitni categories aayengi, utne buttons banenge */}
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              // Agar ye category selected hai, to 'active' class add karo (Orange color ke liye)
              className={`cat-btn ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: PRODUCT GRID (Main Content) --- */}
      <div className="products-grid">
        {/* Check karo: Products hain ya nahi? */}
        {displayedProducts.length > 0 ? (
          // Agar hain, to har product ke liye 'ProductCard' component banao
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Agar filter karne ke baad koi product nahi bacha
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;













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
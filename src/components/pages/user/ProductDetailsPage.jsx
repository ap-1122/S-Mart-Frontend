import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetailsPage.css";
// ✅ 1. Import useCart Hook
 
import { useCart } from "./CartContext.jsx";



const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. User ne abhi kya select kiya hai
  const [selectedAttributes, setSelectedAttributes] = useState({});
  
  // 2. Jo variant final match hua
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // 3. Images State
  const [displayImages, setDisplayImages] = useState([]);
  const [mainImage, setMainImage] = useState("");

  // ✅ 2. Get addToCart function from Context
  const { addToCart } = useCart();

  // --- FIX: Function ko useEffect se PEHLE define kiya ---
  const updateImagesForVariant = (prodData, variant) => {
      if (!prodData || !prodData.images) return;
      const specificImages = prodData.images.filter(img => img.variantId === variant?.id);
      const commonImages = prodData.images.filter(img => img.variantId === null);
      const finalImages = specificImages.length > 0 ? specificImages : commonImages;
      setDisplayImages(finalImages);
      if(finalImages.length > 0) setMainImage(finalImages[0].imageUrl);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        const data = response.data;
        setProduct(data);

        // --- INITIAL SETUP ---
        if (data.variants && data.variants.length > 0) {
            const defaultVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
            setSelectedAttributes(defaultVariant.attributes);
            setSelectedVariant(defaultVariant);
            updateImagesForVariant(data, defaultVariant);
        } else {
            setDisplayImages(data.images || []);
            if(data.images?.length > 0) setMainImage(data.images[0].imageUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- LOGIC 1: Grouping Attributes ---
  const groupedAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const groups = {};
    product.variants.forEach(variant => {
        Object.entries(variant.attributes).forEach(([key, value]) => {
            if (!groups[key]) groups[key] = new Set();
            groups[key].add(value);
        });
    });
    return groups; 
  }, [product]);

  // --- LOGIC 2: Handle Selection ---
  const handleAttributeClick = (key, value) => {
      const newAttributes = { ...selectedAttributes, [key]: value };
      setSelectedAttributes(newAttributes);

      const foundVariant = product.variants.find(v => {
          return Object.entries(newAttributes).every(([k, val]) => v.attributes[k] === val);
      });

      setSelectedVariant(foundVariant || null);
      if (foundVariant) {
          updateImagesForVariant(product, foundVariant);
      }
  };

  // ✅ 3. Handle Add To Cart Click
  const handleAddToCart = () => {
    if (!selectedVariant) {
        alert("This combination is not available. Please select another.");
        return;
    }
    // Add item to global cart
    addToCart(product, selectedVariant, 1);
    // alert("Item added to cart successfully!");
  };

  if (loading) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', fontSize:'1.2rem'}}>Loading...</div>;
  if (!product) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', color:'red'}}>Product Not Found</div>;

  const isUnavailable = !selectedVariant;
  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;

  return (
    <div className="pdp-page-wrapper">
      <div className="pdp-container">
        
        {/* Breadcrumbs */}
        <div className="pdp-breadcrumbs">
            <Link to="/" className="pdp-breadcrumb-link">Home</Link>
            <span className="pdp-breadcrumb-separator">/</span>
            <Link to="/" state={{ category: product.categoryName }} className="pdp-breadcrumb-link">
                {product.categoryName}
            </Link>
            <span className="pdp-breadcrumb-separator">/</span>
            <span className="pdp-breadcrumb-current">{product.name}</span>
        </div>

        <div className="pdp-grid">
          
          {/* --- LEFT: Filtered Images --- */}
          <div className="pdp-image-section">
            <div className="pdp-main-image-box">
              <img 
                src={mainImage || "https://via.placeholder.com/400"} 
                className="pdp-main-img" 
                alt="Main" 
              />
              {(isOutOfStock || isUnavailable) && (
                  <div className="pdp-oos-overlay">
                      {isUnavailable ? "UNAVAILABLE" : "OUT OF STOCK"}
                  </div>
              )}
            </div>
            <div className="pdp-thumbnails">
              {displayImages.map((img) => (
                <div 
                  key={img.id}
                  className={`pdp-thumb-box ${mainImage === img.imageUrl ? "active" : ""}`}
                  onMouseEnter={() => setMainImage(img.imageUrl)}
                >
                  <img src={img.imageUrl} className="pdp-thumb-img" alt="thumb"/>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: Details & Selection --- */}
          <div className="pdp-info-section">
            <span className="pdp-brand-label">{product.brandName}</span>
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price Block */}
            <div className="pdp-price-block" style={(isOutOfStock || isUnavailable) ? {borderLeftColor:'#9ca3af', opacity: 0.9} : {}}>
                <div className="pdp-price-flex">
                    <span className="pdp-price" style={(isOutOfStock || isUnavailable) ? {color:'#6b7280'} : {}}>
                        ₹ {selectedVariant ? selectedVariant.price : "---"}
                    </span>
                    
                    {!isUnavailable && (
                        <span className={`stock-status ${isOutOfStock ? 'out-stock' : 'in-stock'}`}>
                            {isOutOfStock ? "Out of Stock" : "In Stock"}
                        </span>
                    )}
                </div>
                <p className="pdp-tax-note">Inclusive of all taxes</p>
            </div>

            {/* Grouped Attribute Selectors */}
            <div className="pdp-var-section">
                {Object.keys(groupedAttributes).map((attrKey) => (
                    <div key={attrKey} style={{marginBottom:'20px'}}>
                        <h3 className="pdp-var-label">{attrKey}: <span style={{fontWeight:'normal', color:'#666'}}>{selectedAttributes[attrKey]}</span></h3>
                        <div className="pdp-var-options">
                            {[...groupedAttributes[attrKey]].map((val) => (
                                <button
                                    key={val}
                                    className={`pdp-var-btn ${selectedAttributes[attrKey] === val ? "selected" : ""}`}
                                    onClick={() => handleAttributeClick(attrKey, val)}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="pdp-actions">
                <button 
                    disabled={isOutOfStock || isUnavailable}
                    className="btn-action btn-buy"
                    style={(isOutOfStock || isUnavailable) ? {background:'#d1d5db', cursor:'not-allowed', boxShadow:'none'} : {}}
                    onClick={() => alert("Proceeding to Checkout...")}
                >
                    {(isOutOfStock || isUnavailable) ? "Notify Me" : "Buy Now"}
                </button>
                
                <button 
                    disabled={isOutOfStock || isUnavailable}
                    className="btn-action btn-cart"
                    style={(isOutOfStock || isUnavailable) ? {borderColor:'#d1d5db', color:'#9ca3af', cursor:'not-allowed'} : {}}
                    // ✅ 4. Attach Click Handler
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>

            {isUnavailable && (
                <p style={{marginTop:'15px', color:'#dc2626', fontWeight:'500'}}>
                    * This combination is not available. Please try another.
                </p>
            )}

          </div>
        </div>

        {/* Bottom Section */}
        <div className="pdp-details-grid">
            <div>
                <h2 className="pdp-section-head">About this item</h2>
                {product.features && product.features.length > 0 ? (
                    <ul style={{paddingLeft:'1.2rem', lineHeight:'1.8', color:'#374151'}}>
                        {product.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                ) : (
                    <p style={{lineHeight:'1.8', color:'#374151'}}>{product.description}</p>
                )}
            </div>
            <div>
                <h2 className="pdp-section-head">Specifications</h2>
                <table className="spec-table">
                    <tbody>
                        <tr><th>Brand</th><td>{product.brandName}</td></tr>
                        <tr><th>Model</th><td>{product.name}</td></tr>
                        {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                            <tr key={key}><th style={{textTransform:'capitalize'}}>{key}</th><td>{val}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;











//adding add to cart functionality with variant in upper code 

//  import React, { useState, useEffect, useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import "./ProductDetailsPage.css";

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 1. User ne abhi kya select kiya hai (Ex: { Color: "Black", Storage: "256GB" })
//   const [selectedAttributes, setSelectedAttributes] = useState({});
  
//   // 2. Jo variant final match hua
//   const [selectedVariant, setSelectedVariant] = useState(null);
  
//   // 3. Images State
//   const [displayImages, setDisplayImages] = useState([]);
//   const [mainImage, setMainImage] = useState("");

//   // --- 🔥 FIX: Function ko useEffect se PEHLE define kiya ---
//   const updateImagesForVariant = (prodData, variant) => {
//       if (!prodData || !prodData.images) return;

//       // Logic: Sirf wo images lo jo is variant ki hain
//       const specificImages = prodData.images.filter(img => img.variantId === variant?.id);
//       // Aur wo images jo sabke liye common hain (jinka variantId null hai)
//       const commonImages = prodData.images.filter(img => img.variantId === null);

//       // Agar specific image hai, to sirf wahi dikhao. Nahi to common dikhao.
//       const finalImages = specificImages.length > 0 ? specificImages : commonImages;
      
//       setDisplayImages(finalImages);
//       // Agar images hain, to pehli wali ko Main Image bana do
//       if(finalImages.length > 0) setMainImage(finalImages[0].imageUrl);
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/products/${id}`);
//         const data = response.data;
//         setProduct(data);

//         // --- INITIAL SETUP ---
//         if (data.variants && data.variants.length > 0) {
//             // Step A: Pehla 'In Stock' variant dhundo default selection ke liye
//             const defaultVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
            
//             // Step B: Uske attributes (Color, Storage) ko select kar lo
//             setSelectedAttributes(defaultVariant.attributes);
//             setSelectedVariant(defaultVariant);

//             // Step C: Images set karo (Ab ye function exist karta hai ✅)
//             updateImagesForVariant(data, defaultVariant);
//         } else {
//             // Agar simple product hai (no variants)
//             setDisplayImages(data.images || []);
//             if(data.images?.length > 0) setMainImage(data.images[0].imageUrl);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error:", error);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   // --- 🧠 LOGIC 1: Grouping Attributes (Amazon Style) ---
//   // Ye duplicate values hatata hai. Ex: Do variants Black hain, to Button ek hi dikhega "Black"
//   const groupedAttributes = useMemo(() => {
//     if (!product?.variants) return {};
//     const groups = {};
//     product.variants.forEach(variant => {
//         Object.entries(variant.attributes).forEach(([key, value]) => {
//             if (!groups[key]) groups[key] = new Set();
//             groups[key].add(value);
//         });
//     });
//     return groups; 
//   }, [product]);

//   // --- 🧠 LOGIC 2: Handle Selection ---
//   const handleAttributeClick = (key, value) => {
//       // 1. Naya selection banao (Purana + Naya change)
//       const newAttributes = { ...selectedAttributes, [key]: value };
//       setSelectedAttributes(newAttributes);

//       // 2. Check karo: Kya ye naya combination (Color + Storage) exist karta hai?
//       const foundVariant = product.variants.find(v => {
//           return Object.entries(newAttributes).every(([k, val]) => v.attributes[k] === val);
//       });

//       setSelectedVariant(foundVariant || null); // Mil gaya to set karo, nahi to null

//       // 3. Image Update Logic
//       // Agar combination mil gaya, to uski photo dikhao
//       // Agar nahi mila, to purani photo hi rehne do (User experience kharab nahi hoga)
//       if (foundVariant) {
//           updateImagesForVariant(product, foundVariant);
//       }
//   };

//   if (loading) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', fontSize:'1.2rem'}}>Loading...</div>;
//   if (!product) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', color:'red'}}>Product Not Found</div>;

//   // Check: Stock hai ya nahi? (Ya combination exist karta hai ya nahi?)
//   const isUnavailable = !selectedVariant; // Combination hi nahi hai
//   const isOutOfStock = selectedVariant && selectedVariant.stock === 0; // Combination hai par stock 0 hai

//   return (
//     <div className="pdp-page-wrapper">
//       <div className="pdp-container">
        
//         {/* Breadcrumbs */}
//         <div className="pdp-breadcrumbs">
//             <Link to="/" className="pdp-breadcrumb-link">Home</Link>
//             <span className="pdp-breadcrumb-separator">/</span>
//             <Link to="/" state={{ category: product.categoryName }} className="pdp-breadcrumb-link">
//                 {product.categoryName}
//             </Link>
//             <span className="pdp-breadcrumb-separator">/</span>
//             <span className="pdp-breadcrumb-current">{product.name}</span>
//         </div>

//         <div className="pdp-grid">
          
//           {/* --- LEFT: Filtered Images --- */}
//           <div className="pdp-image-section">
//             <div className="pdp-main-image-box">
//               <img 
//                 src={mainImage || "https://via.placeholder.com/400"} 
//                 className="pdp-main-img" 
//                 alt="Main" 
//               />
//               {/* Overlay agar Unavailable/Out of stock hai */}
//               {(isOutOfStock || isUnavailable) && (
//                   <div className="pdp-oos-overlay">
//                       {isUnavailable ? "UNAVAILABLE" : "OUT OF STOCK"}
//                   </div>
//               )}
//             </div>
//             {/* Thumbnails (Filtered) */}
//             <div className="pdp-thumbnails">
//               {displayImages.map((img) => (
//                 <div 
//                   key={img.id}
//                   className={`pdp-thumb-box ${mainImage === img.imageUrl ? "active" : ""}`}
//                   onMouseEnter={() => setMainImage(img.imageUrl)}
//                 >
//                   <img src={img.imageUrl} className="pdp-thumb-img" alt="thumb"/>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* --- RIGHT: Details & Selection --- */}
//           <div className="pdp-info-section">
//             <span className="pdp-brand-label">{product.brandName}</span>
//             <h1 className="pdp-title">{product.name}</h1>

//             {/* Price Block */}
//             <div className="pdp-price-block" style={(isOutOfStock || isUnavailable) ? {borderLeftColor:'#9ca3af', opacity: 0.9} : {}}>
//                 <div className="pdp-price-flex">
//                     <span className="pdp-price" style={(isOutOfStock || isUnavailable) ? {color:'#6b7280'} : {}}>
//                         ₹ {selectedVariant ? selectedVariant.price : "---"}
//                     </span>
                    
//                     {!isUnavailable && (
//                         <span className={`stock-status ${isOutOfStock ? 'out-stock' : 'in-stock'}`}>
//                             {isOutOfStock ? "Out of Stock" : "In Stock"}
//                         </span>
//                     )}
//                 </div>
//                 <p className="pdp-tax-note">Inclusive of all taxes</p>
//             </div>

//             {/* 🔥 NEW: Grouped Attribute Selectors (Color Row, Storage Row) */}
//             <div className="pdp-var-section">
//                 {Object.keys(groupedAttributes).map((attrKey) => (
//                     <div key={attrKey} style={{marginBottom:'20px'}}>
//                         <h3 className="pdp-var-label">{attrKey}: <span style={{fontWeight:'normal', color:'#666'}}>{selectedAttributes[attrKey]}</span></h3>
//                         <div className="pdp-var-options">
//                             {[...groupedAttributes[attrKey]].map((val) => (
//                                 <button
//                                     key={val}
//                                     className={`pdp-var-btn ${selectedAttributes[attrKey] === val ? "selected" : ""}`}
//                                     onClick={() => handleAttributeClick(attrKey, val)}
//                                 >
//                                     {val}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Actions */}
//             <div className="pdp-actions">
//                 <button 
//                     disabled={isOutOfStock || isUnavailable}
//                     className="btn-action btn-buy"
//                     style={(isOutOfStock || isUnavailable) ? {background:'#d1d5db', cursor:'not-allowed', boxShadow:'none'} : {}}
//                     onClick={() => alert("Proceeding to Checkout...")}
//                 >
//                     {(isOutOfStock || isUnavailable) ? "Notify Me" : "Buy Now"}
//                 </button>
                
//                 <button 
//                     disabled={isOutOfStock || isUnavailable}
//                     className="btn-action btn-cart"
//                     style={(isOutOfStock || isUnavailable) ? {borderColor:'#d1d5db', color:'#9ca3af', cursor:'not-allowed'} : {}}
//                     onClick={() => alert("Added to Cart!")}
//                 >
//                     Add to Cart
//                 </button>
//             </div>

//             {/* Warning Message if combination doesn't exist */}
//             {isUnavailable && (
//                 <p style={{marginTop:'15px', color:'#dc2626', fontWeight:'500'}}>
//                     * This combination (e.g., Color + Size) is not available. Please try another.
//                 </p>
//             )}

//           </div>
//         </div>

//         {/* Bottom Section (Same as before) */}
//         <div className="pdp-details-grid">
//             <div>
//                 <h2 className="pdp-section-head">About this item</h2>
//                 {product.features && product.features.length > 0 ? (
//                     <ul style={{paddingLeft:'1.2rem', lineHeight:'1.8', color:'#374151'}}>
//                         {product.features.map((f, i) => <li key={i}>{f}</li>)}
//                     </ul>
//                 ) : (
//                     <p style={{lineHeight:'1.8', color:'#374151'}}>{product.description}</p>
//                 )}
//             </div>
//             <div>
//                 <h2 className="pdp-section-head">Specifications</h2>
//                 <table className="spec-table">
//                     <tbody>
//                         <tr><th>Brand</th><td>{product.brandName}</td></tr>
//                         <tr><th>Model</th><td>{product.name}</td></tr>
//                         {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
//                             <tr key={key}><th style={{textTransform:'capitalize'}}>{key}</th><td>{val}</td></tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;

















//isme hamare pass varient ka combination select karne ki ability nahi thi like black 256gb ya fir black 128 ,
// jo pahle se save hai wahi bas kar sakte the like black-256gb or white-128gb so  upper code me hamne wo sab add kar diya hai jisse user apne hisab se variant select kar sake and uske hisab se image, price and stock update ho jaye
//  import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import "./ProductDetailsPage.css";

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/products/${id}`);
//         const data = response.data;
//         setProduct(data);
        
//         // 1. Default Image Logic
//         if (data.images?.length > 0) setSelectedImage(data.images[0].imageUrl);
        
//         // 2. Default Variant Logic (Jo stock me ho, use pehle select karo)
//         if (data.variants?.length > 0) {
//             // Koshish karo ki pehla "In Stock" wala variant select ho
//             const inStockVariant = data.variants.find(v => v.stock > 0);
//             if (inStockVariant) {
//                 setSelectedVariant(inStockVariant);
//                 // Agar is variant ki apni image hai, to wo bhi set karo
//                 const varImg = data.images.find(img => img.variantId === inStockVariant.id);
//                 if (varImg) setSelectedImage(varImg.imageUrl);
//             } else {
//                 // Agar sab out of stock hain, to pehla wala hi lelo
//                 setSelectedVariant(data.variants[0]);
//             }
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   // --- 🔥 THE SMART FUNCTION: Image + Price + Stock Handler ---
//   const handleVariantClick = (variant) => {
//       // 1. Set Price & Details
//       setSelectedVariant(variant);

//       // 2. Auto-Switch Image
//       // Check karo agar product.images me is variant ID ki koi photo hai
//       const variantSpecificImage = product.images.find(img => img.variantId === variant.id);
      
//       if (variantSpecificImage) {
//           // Agar hai, to wahi dikhao
//           setSelectedImage(variantSpecificImage.imageUrl);
//       } else {
//           // Agar nahi hai, to Main image par wapas mat jao (User ne jo dekha wahi rehne do)
//           // Ya chahe to default image par reset kar sakte ho
//       }
//   };

//   if (loading) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', fontSize:'1.5rem'}}>Loading...</div>;
//   if (!product) return <div className="pdp-page-wrapper" style={{textAlign:'center', padding:'5rem', color:'red'}}>Product Not Found</div>;

//   // Helper: Check Stock
//   const isOutOfStock = selectedVariant?.stock === 0;

//   return (
//     <div className="pdp-page-wrapper">
//       <div className="pdp-container">
        
//         {/* Breadcrumbs */}
//         <div className="pdp-breadcrumbs">
//             <Link to="/" className="pdp-breadcrumb-link">Home</Link>
//             <span className="pdp-breadcrumb-separator">/</span>
            
//             {/* ✅ CHANGE: Span ko Link banaya state ke sath */}
//             <Link 
//                 to="/" 
//                 state={{ category: product.categoryName }} 
//                 className="pdp-breadcrumb-link"
//             >
//                 {product.categoryName}
//             </Link>

//             <span className="pdp-breadcrumb-separator">/</span>
//             <span className="pdp-breadcrumb-current">{product.name}</span>
//         </div>

//         <div className="pdp-grid">
          
//           {/* LEFT: Images */}
//           <div className="pdp-image-section">
//             <div className="pdp-main-image-box">
//               <img 
//                 src={selectedImage || "https://via.placeholder.com/400"} 
//                 className="pdp-main-img" 
//                 alt="Main" 
//               />
//               {/* Overlay agar out of stock hai */}
//               {isOutOfStock && (
//                   <div style={{
//                       position:'absolute', top:'10px', left:'10px', 
//                       background:'#ef4444', color:'white', padding:'5px 10px', 
//                       borderRadius:'4px', fontWeight:'bold', fontSize:'0.8rem'
//                   }}>
//                       CURRENTLY UNAVAILABLE
//                   </div>
//               )}
//             </div>
//             <div className="pdp-thumbnails">
//               {product.images.map((img) => (
//                 <div 
//                   key={img.id}
//                   className={`pdp-thumb-box ${selectedImage === img.imageUrl ? "active" : ""}`}
//                   onMouseEnter={() => setSelectedImage(img.imageUrl)}
//                 >
//                   <img src={img.imageUrl} className="pdp-thumb-img" alt="thumb"/>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: Details */}
//           <div className="pdp-info-section">
//             <span className="pdp-brand-label">{product.brandName}</span>
//             <h1 className="pdp-title">{product.name}</h1>

//             {/* Price Block */}
//             <div className="pdp-price-block" style={isOutOfStock ? {borderLeftColor:'#9ca3af', opacity: 0.8} : {}}>
//                 <div className="pdp-price-flex">
//                     <span className="pdp-price" style={isOutOfStock ? {color:'#6b7280'} : {}}>
//                         ₹ {selectedVariant ? selectedVariant.price : "---"}
//                     </span>
                    
//                     {selectedVariant && (
//                         <span className={`stock-status ${isOutOfStock ? 'out-stock' : 'in-stock'}`}>
//                             {isOutOfStock ? "Out of Stock" : "In Stock"}
//                         </span>
//                     )}
//                 </div>
//                 <p className="pdp-tax-note">Inclusive of all taxes</p>
//             </div>

//             {/* Variants Selector */}
//             {product.variants.length > 0 && (
//                 <div className="pdp-var-section">
//                     <h3 className="pdp-var-label">Select Option:</h3>
//                     <div className="pdp-var-options">
//                         {product.variants.map((v) => {
//                             const label = Object.values(v.attributes || {}).join(" | ") || `Option ${v.id}`;
//                             const isSelected = selectedVariant?.id === v.id;
//                             const isVarOutOfStock = v.stock === 0;

//                             return (
//                                 <button
//                                     key={v.id}
//                                     // 🔥 Style logic: Agar out of stock hai to gray dikhao
//                                     className={`pdp-var-btn ${isSelected ? "selected" : ""}`}
//                                     style={isVarOutOfStock ? {opacity: 0.6, background: '#f3f4f6', textDecoration: isSelected ? 'none' : 'line-through'} : {}}
//                                     onClick={() => handleVariantClick(v)}
//                                 >
//                                     {label}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* Actions Buttons (Smart Disable) */}
//             <div className="pdp-actions">
//                 <button 
//                     disabled={isOutOfStock}
//                     className="btn-action btn-buy"
//                     style={isOutOfStock ? {background:'#d1d5db', cursor:'not-allowed', boxShadow:'none'} : {}}
//                     onClick={() => alert("Proceeding to Checkout...")}
//                 >
//                     {isOutOfStock ? "Notify Me" : "Buy Now"}
//                 </button>
                
//                 <button 
//                     disabled={isOutOfStock}
//                     className="btn-action btn-cart"
//                     style={isOutOfStock ? {borderColor:'#d1d5db', color:'#9ca3af', cursor:'not-allowed'} : {}}
//                     onClick={() => alert("Added to Cart!")}
//                 >
//                     Add to Cart
//                 </button>
//             </div>
            
//             {/* Warning Message if unavailable */}
//             {isOutOfStock && (
//                 <p style={{marginTop:'1rem', color:'#dc2626', fontSize:'0.9rem'}}>
//                     * This variant is currently unavailable. Please select another option.
//                 </p>
//             )}

//           </div>
//         </div>

//         {/* Bottom Details (Same as before) */}
//         <div className="pdp-details-grid">
//             <div>
//                 <h2 className="pdp-section-head">About this item</h2>
//                 {product.features && product.features.length > 0 ? (
//                     <ul style={{paddingLeft:'1.2rem', lineHeight:'1.8', color:'#374151'}}>
//                         {product.features.map((f, i) => <li key={i}>{f}</li>)}
//                     </ul>
//                 ) : (
//                     <p style={{lineHeight:'1.8', color:'#374151'}}>{product.description}</p>
//                 )}
//             </div>

//             <div>
//                 <h2 className="pdp-section-head">Specifications</h2>
//                 <table className="spec-table">
//                     <tbody>
//                         <tr><th>Brand</th><td>{product.brandName}</td></tr>
//                         <tr><th>Model</th><td>{product.name}</td></tr>
//                         {product.manufacturerInfo && (
//                             <tr><th>Manufacturer</th><td>{product.manufacturerInfo}</td></tr>
//                         )}
//                         {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
//                             <tr key={key}>
//                                 <th style={{textTransform:'capitalize'}}>{key}</th>
//                                 <td>{val}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;















//with css but very less details for product details page so we update in upper code
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// // ✅ Import the custom CSS file
// import "./ProductDetailsPage.css"; 

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/products/${id}`);
//         const data = response.data;
//         setProduct(data);
        
//         if (data.images?.length > 0) setSelectedImage(data.images[0].imageUrl);
//         if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="pdp-page-wrapper" style={{textAlign:'center'}}>Loading Product...</div>;
//   if (!product) return <div className="pdp-page-wrapper" style={{textAlign:'center', color:'red'}}>Product Not Found</div>;

//   return (
//     <div className="pdp-page-wrapper">
      
//       {/* --- MAIN CONTAINER --- */}
//       <div className="pdp-container">
//         <div className="pdp-grid">
          
//           {/* 1. LEFT: Images Section */}
//           <div className="pdp-image-section">
//             {/* Main Image */}
//             <div className="pdp-main-image-box">
//               <img 
//                 src={selectedImage || "https://via.placeholder.com/400"} 
//                 className="pdp-main-img" 
//                 alt="Main Product" 
//               />
//             </div>
//             {/* Thumbnails row */}
//             <div className="pdp-thumbnails">
//               {product.images.map((img) => (
//                 <div 
//                   key={img.id}
//                   className={`pdp-thumb-box ${selectedImage === img.imageUrl ? "active" : ""}`}
//                   onClick={() => setSelectedImage(img.imageUrl)}
//                   onMouseEnter={() => setSelectedImage(img.imageUrl)}
//                 >
//                   <img src={img.imageUrl} className="pdp-thumb-img" alt="thumbnail"/>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* 2. RIGHT: Product Info Section */}
//           <div className="pdp-info-section">
//             {/* Brand & Title */}
//             <p className="pdp-brand">{product.brandName}</p>
//             <h1 className="pdp-title">{product.name}</h1>

//             {/* Price Block */}
//             <div className="pdp-price-block">
//               <p style={{marginBottom:'5px', color:'#666'}}>Price:</p>
//               <div className="pdp-price-row">
//                 <span className="pdp-price">
//                   ₹ {selectedVariant ? selectedVariant.price : "N/A"}
//                 </span>
//                 {/* Stock Status */}
//                 {selectedVariant && (
//                   <span className={`pdp-stock-badge ${selectedVariant.stock > 0 ? 'stock-in' : 'stock-out'}`}>
//                     {selectedVariant.stock > 0 ? "In Stock" : "Out of Stock"}
//                   </span>
//                 )}
//               </div>
//               <p className="pdp-tax-text">Inclusive of all taxes</p>
//             </div>

//             {/* Variants Selector */}
//             {product.variants.length > 0 && (
//                 <div className="pdp-variants">
//                     <h3 className="pdp-var-title">Select Variant:</h3>
//                     <div className="pdp-var-list">
//                     {product.variants.map((v) => {
//                       // Attributes ko clean text me badalna
//                       const variantLabel = Object.entries(v.attributes || {})
//                         .map(([key, val]) => `${key}: ${val}`)
//                         .join(" | ") || `Variant ${v.id}`;

//                       return (
//                         <button
//                           key={v.id}
//                           onClick={() => setSelectedVariant(v)}
//                           className={`pdp-var-btn ${selectedVariant?.id === v.id ? "selected" : ""}`}
//                         >
//                           {variantLabel}
//                         </button>
//                       )
//                     })}
//                     </div>
//                 </div>
//             )}

//             {/* Action Buttons */}
//             <div className="pdp-actions">
//                 <button className="btn btn-buy">Buy Now</button>
//                 <button className="btn btn-cart">Add to Cart</button>
//             </div>
//           </div>
//         </div>

//         {/* --- BOTTOM SECTIONS --- */}
//         <div className="pdp-bottom-section">
            
//             {/* Description & Features */}
//             <div>
//               <h2 className="pdp-section-title">About this item</h2>
//               {product.features && product.features.length > 0 ? (
//                   <ul className="pdp-features-list">
//                       {product.features.map((feat, i) => <li key={i}>{feat}</li>)}
//                   </ul>
//               ) : (
//                   <p style={{lineHeight: '1.6', color: '#4b5563'}}>{product.description}</p>
//               )}
//             </div>

//             {/* Specifications Table */}
//             <div>
//                 <h2 className="pdp-section-title">Specifications</h2>
//                 <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb'}}>
//                     {product.specifications && Object.keys(product.specifications).length > 0 ? (
//                         <table className="pdp-spec-table">
//                             <tbody>
//                                 {Object.entries(product.specifications).map(([key, value]) => (
//                                      <tr key={key}>
//                                         <th>{key}</th>
//                                         <td>{value}</td>
//                                      </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div style={{padding:'1rem', textAlign:'center', color:'#888', background:'#f9fafb'}}>
//                             No detailed specifications available.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;

















///code is tailwind css based product details page with data fetching from backend so thats why we use upper code which is normal css based
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { 
//   FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaUndo, FaTag 
// } from "react-icons/fa";

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/products/${id}`);
//         const data = response.data;
//         setProduct(data);
        
//         // Default Image & Variant Set karo
//         if (data.images?.length > 0) setSelectedImage(data.images[0].imageUrl);
//         if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
//   if (!product) return <div className="flex justify-center items-center h-screen text-xl text-red-500">Product Not Found</div>;

//   // Fake Discount Logic for visual appeal
//   const discount = selectedVariant 
//     ? Math.round(((selectedVariant.price * 1.3 - selectedVariant.price) / (selectedVariant.price * 1.3)) * 100) 
//     : 0; 

//   return (
//     <div className="bg-gray-50 min-h-screen pb-10 font-sans">
      
//       {/* --- MAIN CONTAINER --- */}
//       <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 mt-4 shadow-sm">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* 1. LEFT: Images Section (5 Columns) */}
//           <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4 sticky top-4 h-fit">
//             {/* Thumbnails */}
//             <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
//               {product.images.map((img) => (
//                 <img 
//                   key={img.id}
//                   src={img.imageUrl} 
//                   className={`w-16 h-16 object-contain border rounded cursor-pointer hover:border-orange-400 ${selectedImage === img.imageUrl ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-200"}`}
//                   onMouseEnter={() => setSelectedImage(img.imageUrl)}
//                   alt="thumbnail"
//                 />
//               ))}
//             </div>
//             {/* Main Image */}
//             <div className="flex-1 flex justify-center items-center border border-gray-100 p-4 min-h-[400px]">
//               <img src={selectedImage} className="max-h-[400px] object-contain transition-transform hover:scale-110 duration-300" alt="Main" />
//             </div>
//           </div>

//           {/* 2. MIDDLE: Info Section (4 Columns) */}
//           <div className="lg:col-span-4 space-y-4">
//             <h1 className="text-2xl font-medium text-gray-800 leading-tight">{product.name}</h1>
//             <p className="text-blue-600 text-sm font-medium cursor-pointer">
//               Visit the {product.brandName} Store
//             </p>

//             {/* Ratings */}
//             <div className="flex items-center gap-2 text-sm border-b pb-4">
//               <span className="flex text-yellow-500"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar className="text-gray-300"/></span>
//               <span className="text-blue-500 hover:underline cursor-pointer">345 ratings</span>
//             </div>

//             {/* Price Block */}
//             <div>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-red-600 text-2xl font-light">-{discount}%</span>
//                 <span className="text-3xl font-medium text-gray-900">₹{selectedVariant?.price}</span>
//               </div>
//               <p className="text-gray-500 text-xs mt-1">M.R.P.: <span className="line-through">₹{Math.round(selectedVariant?.price * 1.3)}</span></p>
//               <p className="text-gray-900 text-sm font-bold mt-1">Inclusive of all taxes</p>
//             </div>

//             {/* Offers Block */}
//             <div className="border-t border-b py-3 flex gap-4 overflow-x-auto no-scrollbar">
//                 <div className="min-w-[130px] p-2 border rounded shadow-sm text-xs bg-white">
//                     <span className="font-bold text-gray-800 flex items-center gap-1"><FaTag className="text-orange-500"/> Bank Offer</span>
//                     <p className="mt-1 text-gray-600">5% Cashback on Axis Bank Card</p>
//                 </div>
//                 <div className="min-w-[130px] p-2 border rounded shadow-sm text-xs bg-white">
//                     <span className="font-bold text-gray-800 flex items-center gap-1"><FaTag className="text-orange-500"/> Partner Offer</span>
//                     <p className="mt-1 text-gray-600">Get GST invoice option on this item</p>
//                 </div>
//             </div>

//             {/* Service Icons */}
//             <div className="flex justify-between text-center text-xs text-teal-700 font-medium py-2">
//                 <div className="flex flex-col items-center gap-1 w-20"><div className="p-2 bg-gray-100 rounded-full text-gray-600"><FaUndo size={14}/></div>7 days Replacement</div>
//                 <div className="flex flex-col items-center gap-1 w-20"><div className="p-2 bg-gray-100 rounded-full text-gray-600"><FaTruck size={14}/></div>Free Delivery</div>
//                 <div className="flex flex-col items-center gap-1 w-20"><div className="p-2 bg-gray-100 rounded-full text-gray-600"><FaShieldAlt size={14}/></div>1 Year Warranty</div>
//             </div>

//             <hr className="border-gray-200" />

//             {/* Variants Selector */}
//             {product.variants.length > 0 && (
//                 <div>
//                     <span className="font-bold text-sm text-gray-700">Available Options:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                     {product.variants.map((v) => (
//                       <button
//                         key={v.id}
//                         onClick={() => setSelectedVariant(v)}
//                         className={`px-3 py-1 text-sm border rounded shadow-sm transition-all ${
//                           selectedVariant?.id === v.id
//                             ? "border-orange-600 bg-orange-50 font-bold text-gray-900 ring-1 ring-orange-500"
//                             : "border-gray-300 text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         {Object.values(v.attributes).join(" | ")}
//                       </button>
//                     ))}
//                     </div>
//                 </div>
//             )}

//             {/* Description / Features */}
//             <div className="mt-4">
//                 <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
//                 <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
//                     {product.features && product.features.length > 0 ? (
//                         product.features.map((feat, i) => <li key={i}>{feat}</li>)
//                     ) : (
//                         <li>{product.description}</li>
//                     )}
//                 </ul>
//             </div>
//           </div>

//           {/* 3. RIGHT: Buy Box (3 Columns) */}
//           <div className="lg:col-span-3">
//             <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white sticky top-4">
//                 <h3 className="text-2xl font-medium mb-2">₹{selectedVariant?.price}</h3>
                
//                 <div className="text-sm mb-4">
//                     <span className="text-teal-600 font-medium hover:underline">FREE delivery</span>
//                     <span className="text-gray-500 ml-1 font-bold">Wednesday, 20 Jan</span>
//                 </div>
                
//                 <p className="text-lg text-green-700 font-medium mb-4">In Stock</p>

//                 <div className="space-y-3">
//                     <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full text-sm font-medium shadow-sm transition-colors border border-[#FCD200]">
//                         Add to Cart
//                     </button>
//                     <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full text-sm font-medium shadow-sm transition-colors border border-[#FF8F00]">
//                         Buy Now
//                     </button>
//                 </div>

//                 <div className="mt-4 text-xs text-gray-600 space-y-2 border-t pt-3">
//                     <div className="flex justify-between"><span>Ships from</span><span>S-Mart</span></div>
//                     <div className="flex justify-between"><span>Sold by</span><span className="text-blue-600 font-medium hover:underline cursor-pointer">{product.manufacturerInfo || product.brandName}</span></div>
//                 </div>
//             </div>
//           </div>
//         </div>

//         {/* --- BOTTOM: TECHNICAL DETAILS TABLE --- */}
//         <div className="mt-12 pt-8 border-t">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Product Specifications</h2>
//             <div className="overflow-hidden border border-gray-300 rounded-lg max-w-4xl">
//                 <table className="min-w-full text-sm text-left text-gray-500">
//                     <tbody className="divide-y divide-gray-200">
//                         {/* Static Info */}
//                         <tr className="bg-gray-50"><th className="px-6 py-3 font-medium text-gray-900 w-1/3">Brand</th><td className="px-6 py-3">{product.brandName}</td></tr>
//                         <tr className="bg-white"><th className="px-6 py-3 font-medium text-gray-900">Model Name</th><td className="px-6 py-3">{product.name}</td></tr>
                        
//                         {/* Dynamic Specs */}
//                         {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
//                              <tr key={key} className="even:bg-gray-50 odd:bg-white border-b hover:bg-gray-100">
//                                 <th className="px-6 py-3 font-medium text-gray-900 capitalize">{key}</th>
//                                 <td className="px-6 py-3 text-gray-700">{value}</td>
//                              </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 {(!product.specifications || Object.keys(product.specifications).length === 0) && (
//                     <div className="p-4 text-center text-gray-400 bg-gray-50">Detailed specifications not added yet.</div>
//                 )}
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;

















//detalis page of product but basic structure only no styling and no data fetching
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { 
//   FaShoppingCart, FaBolt, FaStar, FaTruck, FaShieldAlt 
// } from "react-icons/fa";

// const ProductDetailsPage = () => {
//   const { id } = useParams(); // URL se Product ID nikalega (e.g. 19)
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // States for Amazon-style interaction
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);

//   // 1. Data Fetching
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         // Wahi API call jo tumne Postman me test ki
//         const response = await axios.get(`http://localhost:8080/api/products/${id}`);
//         const data = response.data;
        
//         setProduct(data);
        
//         // Default Image Set karo (Pehli image)
//         if (data.images && data.images.length > 0) {
//           setSelectedImage(data.images[0].imageUrl);
//         }

//         // Default Variant Set karo (Pehla variant)
//         if (data.variants && data.variants.length > 0) {
//           setSelectedVariant(data.variants[0]);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="text-center mt-20 text-xl">Loading Product...</div>;
//   if (!product) return <div className="text-center mt-20 text-xl text-red-500">Product Not Found</div>;

//   // Calculate Discount Percentage
//   const discount = selectedVariant 
//     ? Math.round(((3000 - selectedVariant.price) / 3000) * 100) // 3000 MRP Dummy hai abhi ke liye
//     : 0;

//   return (
//     <div className="bg-white min-h-screen p-4 md:p-8 font-sans text-gray-800">
      
//       {/* --- TOP SECTION: IMAGES & INFO --- */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
//         {/* 1. LEFT: Image Gallery */}
//         <div className="flex gap-4">
//           {/* Thumbnails */}
//           <div className="flex flex-col gap-2">
//             {product.images.map((img) => (
//               <img 
//                 key={img.id}
//                 src={img.imageUrl} 
//                 alt="Thumbnail"
//                 className={`w-16 h-16 object-contain border rounded cursor-pointer hover:shadow-md transition-all ${selectedImage === img.imageUrl ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
//                 onMouseEnter={() => setSelectedImage(img.imageUrl)}
//               />
//             ))}
//           </div>
          
//           {/* Main Image (Zoom Effect Logic can be added here) */}
//           <div className="flex-1 border border-gray-100 p-4 flex items-center justify-center relative bg-white rounded-lg">
//             <img 
//               src={selectedImage} 
//               alt="Main Product" 
//               className="max-h-[400px] object-contain transition-transform duration-300 hover:scale-110"
//             />
//           </div>
//         </div>

//         {/* 2. MIDDLE: Product Details */}
//         <div className="lg:col-span-1 space-y-4">
//           <h1 className="text-2xl font-medium text-gray-900 leading-tight">
//             {product.name}
//           </h1>
          
//           <div className="flex items-center gap-2 text-sm">
//             <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
//               4.2 <FaStar className="text-[10px]" />
//             </span>
//             <span className="text-gray-500">1,240 Ratings</span>
//             <span className="text-blue-600 font-medium ml-2">{product.brandName}</span>
//           </div>

//           <hr className="border-gray-200" />

//           {/* Pricing */}
//           <div>
//             <div className="flex items-baseline gap-3">
//               <span className="text-red-600 text-lg">- {discount}%</span>
//               <span className="text-3xl font-bold">₹{selectedVariant?.price || "N/A"}</span>
//             </div>
//             <p className="text-gray-500 text-xs mt-1">
//               M.R.P.: <span className="line-through">₹3,000</span> (Inclusive of all taxes)
//             </p>
//           </div>

//           {/* Variants Selection */}
//           {product.variants.length > 0 && (
//             <div className="mt-4">
//               <p className="font-semibold text-sm mb-2">Variant Options:</p>
//               <div className="flex flex-wrap gap-2">
//                 {product.variants.map((v) => (
//                   <button
//                     key={v.id}
//                     onClick={() => setSelectedVariant(v)}
//                     className={`px-3 py-1 border rounded-md text-sm transition-all ${
//                       selectedVariant?.id === v.id
//                         ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {/* Show Attributes (e.g., Black, 256GB) */}
//                     {Object.values(v.attributes).join(" / ")} - ₹{v.price}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Key Features (Highlights) */}
//           {product.features && (
//             <div className="mt-4">
//               <h3 className="font-semibold text-sm mb-2">About this item:</h3>
//               <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//                 {product.features.map((feat, idx) => (
//                   <li key={idx}>{feat}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* 3. RIGHT: Buy Box (Desktop Only) */}
//         <div className="hidden lg:block border border-gray-300 rounded-lg p-4 h-fit shadow-sm bg-white">
//           <h3 className="text-xl font-bold mb-2">₹{selectedVariant?.price}</h3>
          
//           <div className="text-sm text-teal-600 font-medium mb-4 flex items-center gap-2">
//              <FaTruck /> FREE Delivery by S-Mart
//           </div>

//           <p className="text-lg text-green-700 font-semibold mb-4">In Stock</p>

//           <div className="space-y-3">
//             <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 rounded-full text-sm font-medium shadow-sm transition-colors">
//               Add to Cart
//             </button>
//             <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black py-2 rounded-full text-sm font-medium shadow-sm transition-colors">
//                Buy Now
//             </button>
//           </div>

//           <div className="mt-4 text-xs text-gray-500 space-y-1">
//              <p>Sold by: <span className="text-blue-600">{product.manufacturerInfo || "S-Mart Retail"}</span></p>
//              <p className="flex items-center gap-1"><FaShieldAlt /> Secure transaction</p>
//           </div>
//         </div>

//       </div>

//       {/* --- BOTTOM SECTION: SPECIFICATIONS --- */}
//       <div className="max-w-7xl mx-auto mt-12 border-t pt-8">
//         <h2 className="text-xl font-bold mb-4">Product Specifications</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
//           {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
//             <div key={key} className="flex border-b border-gray-100 py-2">
//               <span className="w-1/3 text-gray-500 font-medium capitalize">{key}</span>
//               <span className="w-2/3 text-gray-900">{value}</span>
//             </div>
//           ))}
//           {/* Fallback agar specs khali hon */}
//           {(!product.specifications || Object.keys(product.specifications).length === 0) && (
//              <p className="text-gray-400">No additional specifications available.</p>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ProductDetailsPage;
import React from 'react';
import './ProductCard.css'; // Iski CSS niche hai

const ProductCard = ({ product }) => {
  // 1. Image handling (Agar image nahi hai to placeholder lagao)
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].imageUrl 
    : "https://via.placeholder.com/300x200?text=No+Image";

  // 2. Price Handling (Abhi ke liye default ya variant se)
  // Note: Backend se 'price' field agar direct nahi aa raha to hum fix karenge,
  // Filhal hum check karte hain kya data aa raha hai.
  const price = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : "Check Price"; 

  return (
    <div className="product-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
        {/* New Badge Logic */}
        <span className="badge-new">New</span>
      </div>
      
      <div className="card-details">
        <span className="product-brand">{product.brandName || "Brand"}</span>
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-bottom">
            <div className="price-tag">
                <span className="currency">₹</span>
                <span className="value">{price}</span>
            </div>
            <button className="btn-add-cart">
               Add +
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


















// import React from 'react';
// import './ProductCard.css';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="product-card">
//       <div className="card-image-container">
//         {/* Agar image nahi hai to placeholder dikhaye */}
//         <img 
//           src={product.imageUrl || "https://via.placeholder.com/150"} 
//           alt={product.name} 
//           className="product-image" 
//         />
//       </div>
//       <div className="card-details">
//         <h3 className="product-title">{product.name}</h3>
//         <p className="product-category">{product.category ? product.category.name : 'General'}</p>
        
//         <div className="price-row">
//             {/* Price ko Orange rakhenge */}
//             <span className="price">₹{product.price}</span>
//             <button className="btn-view">View</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="card-image-container">
        {/* Agar image nahi hai to placeholder dikhaye */}
        <img 
          src={product.imageUrl || "https://via.placeholder.com/150"} 
          alt={product.name} 
          className="product-image" 
        />
      </div>
      <div className="card-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-category">{product.category ? product.category.name : 'General'}</p>
        
        <div className="price-row">
            {/* Price ko Orange rakhenge */}
            <span className="price">₹{product.price}</span>
            <button className="btn-view">View</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
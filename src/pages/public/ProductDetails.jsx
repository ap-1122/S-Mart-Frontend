import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './ProductDetails.css'; // CSS file niche hai

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data;
        setProduct(data);
        
        // Default Image Set karo
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].imageUrl);
        }
        
        // Default Variant Select karo (Pehla wala)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Product...</div>;
  if (!product) return <div className="error-screen">Product Not Found</div>;

  // --- Logic to handle Variant Switch ---
  // (Simplified: User list me se variant choose karega)
  // Advanced logic me hum Attributes ko group karke dikhayenge
  
  return (
    <div className="pdp-container">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt; 
        <span>{product.categoryName}</span> &gt; 
        <span className="current">{product.name}</span>
      </div>

      <div className="pdp-grid">
        {/* 2. Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-box">
             <img src={selectedImage || "https://via.placeholder.com/400"} alt="Main" />
          </div>
          <div className="thumbnail-row">
            {product.images?.map((img) => (
              <img 
                key={img.id} 
                src={img.imageUrl} 
                className={`thumb ${selectedImage === img.imageUrl ? 'active' : ''}`}
                onClick={() => setSelectedImage(img.imageUrl)}
                alt="thumb"
              />
            ))}
          </div>
        </div>

        {/* 3. Product Info & Variants */}
        <div className="product-info">
          <h1 className="pdp-title">{product.name}</h1>
          <p className="pdp-brand">Brand: {product.brandName}</p>
          
          <div className="pdp-price">
             ₹ {selectedVariant ? selectedVariant.price : "Check Price"}
             <span className="stock-status">
               {selectedVariant?.stock > 0 ? "In Stock" : "Out of Stock"}
             </span>
          </div>

          <p className="pdp-desc">{product.description}</p>

          {/* Variant Selector (Chips) */}
          {product.variants && product.variants.length > 0 && (
            <div className="variant-selector">
              <h3>Select Variant:</h3>
              <div className="chips-container">
                {product.variants.map((v) => (
                  <button 
                    key={v.id}
                    className={`variant-chip ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedVariant(v);
                        // Agar variant ki apni specific image logic hoti to wo yahan set karte
                    }}
                  >
                    {/* Attributes dikhana (Color - Size) */}
                    {Object.values(v.attributes || {}).join(" / ") || v.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn-buy-now">Buy Now</button>
            <button className="btn-add-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
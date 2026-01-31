 import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; 
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, fetchCart } = useCart();
  const navigate = useNavigate();

  // Page load hone par cart refresh karo
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalAmount = getCartTotal();
  const totalItems = getCartCount();

  // --- EMPTY STATE UI ---
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="empty-cart-container">
            <img 
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
            alt="Empty Cart" 
            className="empty-cart-img"
            />
            <h2>Your Cart is Empty</h2>
            <p style={{color:'#6b7280'}}>Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate("/")} className="btn-start-shopping">
            Start Shopping
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        
        {/* LEFT: Cart Items List */}
        <div className="cart-items-box">
            <div className="cart-header">
                Shopping Cart ({totalItems} Items)
            </div>

            {cartItems.map((item) => {
                // --- DATA MAPPING ---
                const productId = item.product?.id;
                const productName = item.product?.name || "Unknown Product";
                const variantSku = item.variant?.sku || "N/A";
                const variantPrice = item.variant?.price || 0;
                
                // ✅ Java Backend se "productImage" field aayega (Custom Getter Method)
                const imageUrl = item.productImage || "https://via.placeholder.com/150?text=No+Image";

                return (
                    <div key={item.id} className="cart-item">
                        {/* Image */}
                        <div className="cart-img-box">
                            <img src={imageUrl} alt={productName} className="cart-img" />
                        </div>

                        {/* Details */}
                        <div className="cart-details">
                            <Link to={`/product/${productId}`} className="cart-name">
                                {productName}
                            </Link>
                            
                            <div className="cart-variant">
                                Variant/SKU: {variantSku}
                            </div>

                            <div className="cart-price">
                                ₹ {variantPrice.toLocaleString('en-IN')}
                            </div>

                            {/* Controls */}
                            <div className="qty-group">
                                <button 
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >-</button>
                                
                                <span className="qty-val">{item.quantity}</span>
                                
                                <button 
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >+</button>

                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* RIGHT: Bill Summary */}
        <div className="cart-summary">
            <h3 style={{fontSize:'1.2rem', marginBottom:'1.5rem', color:'#111827'}}>Order Summary</h3>
            
            <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="summary-row">
                <span>Shipping</span>
                <span style={{color: 'green', fontWeight:'600'}}>Free</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
                <span>Total</span>
                <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                PROCEED TO CHECKOUT 
            </button>  
        </div>

      </div>
    </div>
  );
};

export default CartPage;








// import React from "react";
// import { useCart } from "./CartContext"; // Path check karlena
// import { Link } from "react-router-dom";
// import "./CartPage.css";

// const CartPage = () => {
//   const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

//   if (cartItems.length === 0) {
//     return (
//       <div className="cart-page-wrapper" style={{textAlign:'center', padding:'5rem'}}>
//         <h2 style={{fontSize:'2rem', color:'#374151', marginBottom:'1rem'}}>Your Cart is Empty</h2>
//         <p style={{color:'#6b7280', marginBottom:'2rem'}}>Looks like you haven't added anything yet.</p>
//         <Link to="/" style={{background:'#f97316', color:'white', padding:'10px 20px', borderRadius:'5px', textDecoration:'none', fontWeight:'bold'}}>Start Shopping</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page-wrapper">
//       <div className="cart-container">
        
//         {/* Left: Cart Items */}
//         <div className="cart-items-box">
//           <div className="cart-header">Shopping Cart ({cartItems.length})</div>
          
//           {cartItems.map((item) => (
//             <div key={item.variantId} className="cart-item">
//               {/* Image */}
//               <div className="cart-img-box">
//                 <img src={item.image} alt={item.name} className="cart-img" />
//               </div>
              
//               {/* Details */}
//               <div className="cart-details">
//                 <h3 className="cart-name">{item.name}</h3>
//                 <p className="cart-variant">
//                     {Object.values(item.attributes).join(" | ")}
//                 </p>
//                 <div className="cart-price">₹ {item.price * item.quantity}</div>
                
//                 {/* Controls */}
//                 <div className="qty-group">
//                     <button className="qty-btn" onClick={() => updateQuantity(item.variantId, -1)}>-</button>
//                     <span className="qty-val">{item.quantity}</span>
//                     <button className="qty-btn" onClick={() => updateQuantity(item.variantId, 1)}>+</button>
//                     <span className="remove-btn" onClick={() => removeFromCart(item.variantId)}>Remove</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right: Summary */}
//         <div className="cart-summary">
//             <h3 style={{fontWeight:'bold', marginBottom:'1.5rem', fontSize:'1.2rem'}}>Order Summary</h3>
//             <div className="summary-row">
//                 <span>Subtotal</span>
//                 <span>₹ {getCartTotal()}</span>
//             </div>
//             <div className="summary-row">
//                 <span>Shipping</span>
//                 <span style={{color:'green'}}>FREE</span>
//             </div>
//             <div className="summary-row total-row">
//                 <span>Total</span>
//                 <span>₹ {getCartTotal()}</span>
//             </div>
//             <button className="checkout-btn">Proceed to Checkout</button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CartPage;
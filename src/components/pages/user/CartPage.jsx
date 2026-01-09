import React from "react";
import { useCart } from "./CartContext"; // Path check karlena
import { Link } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper" style={{textAlign:'center', padding:'5rem'}}>
        <h2 style={{fontSize:'2rem', color:'#374151', marginBottom:'1rem'}}>Your Cart is Empty</h2>
        <p style={{color:'#6b7280', marginBottom:'2rem'}}>Looks like you haven't added anything yet.</p>
        <Link to="/" style={{background:'#f97316', color:'white', padding:'10px 20px', borderRadius:'5px', textDecoration:'none', fontWeight:'bold'}}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        
        {/* Left: Cart Items */}
        <div className="cart-items-box">
          <div className="cart-header">Shopping Cart ({cartItems.length})</div>
          
          {cartItems.map((item) => (
            <div key={item.variantId} className="cart-item">
              {/* Image */}
              <div className="cart-img-box">
                <img src={item.image} alt={item.name} className="cart-img" />
              </div>
              
              {/* Details */}
              <div className="cart-details">
                <h3 className="cart-name">{item.name}</h3>
                <p className="cart-variant">
                    {Object.values(item.attributes).join(" | ")}
                </p>
                <div className="cart-price">₹ {item.price * item.quantity}</div>
                
                {/* Controls */}
                <div className="qty-group">
                    <button className="qty-btn" onClick={() => updateQuantity(item.variantId, -1)}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.variantId, 1)}>+</button>
                    <span className="remove-btn" onClick={() => removeFromCart(item.variantId)}>Remove</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary">
            <h3 style={{fontWeight:'bold', marginBottom:'1.5rem', fontSize:'1.2rem'}}>Order Summary</h3>
            <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {getCartTotal()}</span>
            </div>
            <div className="summary-row">
                <span>Shipping</span>
                <span style={{color:'green'}}>FREE</span>
            </div>
            <div className="summary-row total-row">
                <span>Total</span>
                <span>₹ {getCartTotal()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
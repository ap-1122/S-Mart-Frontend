import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.css"; // CSS Reuse karenge thoda sa

const AddAddressPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      await axios.post("http://localhost:8080/api/addresses/add", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Success: Wapas Checkout par jao
      navigate("/checkout");
      
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address.");
    }
  };

  return (
    <div className="checkout-wrapper" style={{display:'flex', justifyContent:'center'}}>
      <div className="section-box" style={{width: '100%', maxWidth: '600px'}}>
        <h2 style={{color: '#111827', marginBottom: '1.5rem'}}>Add New Address</h2>
        
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name (Receiver)" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
          </div>

          <div className="form-group">
            <input type="text" name="mobile" placeholder="Mobile Number" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
          </div>

          <div className="form-group">
            <input type="text" name="street" placeholder="Flat, House no., Building, Company, Apartment" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
            <input type="text" name="city" placeholder="City" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
            <input type="text" name="zipCode" placeholder="Pincode" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
          </div>

          <div className="form-group">
            <input type="text" name="state" placeholder="State" required 
                   className="form-input" onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
            <button type="submit" className="btn-place-order">SAVE ADDRESS</button>
            <button type="button" onClick={()=>navigate("/checkout")} 
                    style={{...inputStyle, background:'#e5e7eb', border:'none', cursor:'pointer', fontWeight:'600'}}>
              CANCEL
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Inline style for inputs (Quick styling)
const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  fontSize: '1rem'
};

export default AddAddressPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { getCartTotal, cartItems } = useCart(); 
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Prime Status Check
  const [isPrime, setIsPrime] = useState(false);

  // --- Helper: Load Razorpay Script ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      try {
        // 1. Fetch Addresses
        const addrResponse = await axios.get("http://localhost:8080/api/addresses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(addrResponse.data);
        if (addrResponse.data.length > 0) {
          setSelectedAddressId(addrResponse.data[0].id);
        }

        // ✅ 2. Fetch Prime Status (NEW)
        try {
            const primeResponse = await axios.get("http://localhost:8080/api/subscription/status", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (primeResponse.data && primeResponse.data.isPremium) {
                setIsPrime(true);
            }
        } catch (err) {
            console.log("Prime check failed (User might be normal)", err);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);


  // ✅ CALCULATION LOGIC (Important)
  const cartTotal = getCartTotal();
  const deliveryCharges = isPrime ? 0 : (cartTotal > 500 ? 0 : 40); // Prime = Free, else rules
  const discountAmount = isPrime ? Math.round(cartTotal * 0.10) : 0; // 10% Discount for Prime
  const finalAmount = cartTotal + deliveryCharges - discountAmount;


  // --- Handle Place Order ---
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address!");
      return;
    }

    const token = localStorage.getItem("token");
    
    // 🔴 CASE 1: Cash on Delivery
    if (paymentMethod === "COD") {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/orders/place?addressId=${selectedAddressId}&paymentMethod=COD`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Order Placed Successfully! Order ID: " + response.data.id);
            navigate("/my-orders"); 
        } catch (error) {
            console.error("Order Error:", error);
            alert("Order Failed: " + (error.response?.data?.message || "Something went wrong"));
        }
    } 
    
    // 🟢 CASE 2: Online Payment (Razorpay Logic)
    else if (paymentMethod === "ONLINE") {
        
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        try {
            // Step A: Create Order on Backend (Sending FINAL DISCOUNTED AMOUNT)
            // ✅ CHANGE: 'amount' ki jagah 'finalAmount' bheja
            const orderRes = await axios.post(
                `http://localhost:8080/api/payment/create-order?amount=${finalAmount}`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { id: order_id, currency } = orderRes.data; 

            // Step B: Open Popup
            const options = {
                key: "YOUR_RAZORPAY_KEY_ID", // ⚠️ Check Key
                amount: finalAmount * 100, // ✅ CHANGE: Convert Final Amount to Paise
                currency: currency,
                name: "S-MART",
                description: "Purchase Transaction",
                order_id: order_id, 
                
                handler: async function (response) {
                    try {
                        await axios.post(
                            "http://localhost:8080/api/payment/verify-payment",
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                addressId: selectedAddressId 
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        alert("Payment Successful! Order Placed.");
                        navigate("/my-orders");

                    } catch (err) {
                        alert("Payment Verification Failed!");
                        console.error(err);
                    }
                },
                prefill: {
                    name: "S-MART User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#f97316"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Could not initiate payment. Server might be down.");
        }
    }
  };

  if (loading) return <div className="loading-text">Loading Checkout...</div>;

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        
        {/* LEFT SECTION */}
        <div className="checkout-left">
          
          <div className="section-box">
            <div className="section-header">
              <h2>1. Delivery Address</h2>
              <button className="btn-add-new" onClick={() => navigate("/add-address")}>+ Add New</button>
            </div>

            <div className="address-list">
              {addresses.length === 0 ? (
                <p className="no-address-msg">No saved addresses found. Please add one.</p>
              ) : (
                addresses.map((addr) => (
                  <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <div className="address-info">
                      <span className="addr-name">{addr.name}</span>
                      <span className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</span>
                      <span className="addr-phone">Mobile: {addr.mobile}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="section-box">
            <div className="section-header">
              <h2>2. Payment Method</h2>
            </div>
            
            <div className="payment-options">
              
              <label className={`payment-option ${paymentMethod === "ONLINE" ? "selected-pay" : ""}`}>
                <input 
                    type="radio" 
                    name="payment" 
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-details">
                  <span className="pay-title">Pay Online (Razorpay)</span>
                  <span className="pay-desc">Credit/Debit Card, UPI, Netbanking</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "COD" ? "selected-pay" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-details">
                  <span className="pay-title">Cash on Delivery</span>
                  <span className="pay-desc">Pay cash at your doorstep</span>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* RIGHT SECTION: ORDER SUMMARY */}
        <div className="checkout-right">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cartItems?.length || 0})</span>
              <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            {/* Delivery Charges Logic */}
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span style={{color: deliveryCharges === 0 ? 'green' : 'black'}}>
                 {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
              </span>
            </div>

            {/* ✅ PRIME DISCOUNT ROW */}
            {isPrime && (
                <div className="summary-row prime-row">
                    <span>Prime Discount (10%)</span>
                    <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                </div>
            )}

            <div className="divider"></div>
            
            {/* Final Total */}
            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹ {finalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button className="btn-place-order" onClick={handlePlaceOrder}>
              {paymentMethod === "ONLINE" ? `PAY ₹${finalAmount}` : `PLACE ORDER`}
            </button>

            {/* ✅ PRIME NUDGE (Agar user Prime nahi hai) */}
            {!isPrime && (
                <div className="prime-nudge">
                    Join <b>S-Mart Prime</b> for Extra 10% Discount & Free Delivery!
                </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;











//updatin in upper code and add premium subscription diskount on final price 

//  import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import axios from "axios";
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   // ✅ FIX 1: 'clearCart' hata diya kyunki backend khud handle karega
//   const { getCartTotal, cartItems } = useCart(); 
//   const navigate = useNavigate();

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("COD"); 
//   const [loading, setLoading] = useState(true);

//   // --- Helper: Load Razorpay Script ---
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please login first!");
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:8080/api/addresses/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAddresses(response.data);
//         if (response.data.length > 0) {
//           setSelectedAddressId(response.data[0].id);
//         }
//       } catch (error) {
//         console.error("Error fetching addresses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAddresses();
//   }, [navigate]);


//   // --- Handle Place Order ---
//   const handlePlaceOrder = async () => {
//     if (!selectedAddressId) {
//       alert("Please select a delivery address!");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     const amount = getCartTotal();

//     // 🔴 CASE 1: Cash on Delivery
//     if (paymentMethod === "COD") {
//         try {
//             const response = await axios.post(
//                 `http://localhost:8080/api/orders/place?addressId=${selectedAddressId}&paymentMethod=COD`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             alert("Order Placed Successfully! Order ID: " + response.data.id);
//             navigate("/my-orders"); 
//         } catch (error) {
//             console.error("Order Error:", error);
//             alert("Order Failed: " + (error.response?.data?.message || "Something went wrong"));
//         }
//     } 
    
//     // 🟢 CASE 2: Online Payment (Razorpay Logic)
//     else if (paymentMethod === "ONLINE") {
        
//         const isLoaded = await loadRazorpayScript();
//         if (!isLoaded) {
//             alert("Razorpay SDK failed to load. Check your internet.");
//             return;
//         }

//         try {
//             // Step A: Create Order on Backend
//             const orderRes = await axios.post(
//                 `http://localhost:8080/api/payment/create-order?amount=${amount}`, 
//                 {}, 
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             const { id: order_id, currency } = orderRes.data; // Razorpay Order ID

//             // Step B: Open Popup
//             const options = {
//                 key: "rzp_test_S6dcpSwZYbmUEx", // ⚠️ Apni Key ID yahan daalna
//                 amount: amount * 100, 
//                 currency: currency,
//                 name: "S-MART",
//                 description: "Purchase Transaction",
//                 order_id: order_id, 
                
//                 // Handler: Success hone par ye chalega
//                 handler: async function (response) {
//                     try {
//                         // ✅ FIX 2: Variable hata diya, direct await use kiya
//                         await axios.post(
//                             "http://localhost:8080/api/payment/verify-payment",
//                             {
//                                 razorpayOrderId: response.razorpay_order_id,
//                                 razorpayPaymentId: response.razorpay_payment_id,
//                                 razorpaySignature: response.razorpay_signature,
//                                 addressId: selectedAddressId // Backend isse use karke order save karega
//                             },
//                             { headers: { Authorization: `Bearer ${token}` } }
//                         );

//                         alert("Payment Successful! Order Placed.");
//                         navigate("/my-orders");

//                     } catch (err) {
//                         alert("Payment Verification Failed!");
//                         console.error(err);
//                     }
//                 },
//                 prefill: {
//                     name: "S-MART User",
//                     email: "user@example.com",
//                     contact: "9999999999"
//                 },
//                 theme: {
//                     color: "#f97316"
//                 }
//             };

//             const paymentObject = new window.Razorpay(options);
//             paymentObject.open();

//         } catch (error) {
//             console.error("Payment Error:", error);
//             alert("Could not initiate payment. Server might be down.");
//         }
//     }
//   };

//   if (loading) return <div className="loading-text">Loading Checkout...</div>;

//   return (
//     <div className="checkout-wrapper">
//       <div className="checkout-container">
        
//         {/* LEFT SECTION */}
//         <div className="checkout-left">
          
//           <div className="section-box">
//             <div className="section-header">
//               <h2>1. Delivery Address</h2>
//               <button className="btn-add-new" onClick={() => navigate("/add-address")}>+ Add New</button>
//             </div>

//             <div className="address-list">
//               {addresses.length === 0 ? (
//                 <p className="no-address-msg">No saved addresses found. Please add one.</p>
//               ) : (
//                 addresses.map((addr) => (
//                   <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}>
//                     <input
//                       type="radio"
//                       name="address"
//                       value={addr.id}
//                       checked={selectedAddressId === addr.id}
//                       onChange={() => setSelectedAddressId(addr.id)}
//                     />
//                     <div className="address-info">
//                       <span className="addr-name">{addr.name}</span>
//                       <span className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</span>
//                       <span className="addr-phone">Mobile: {addr.mobile}</span>
//                     </div>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="section-box">
//             <div className="section-header">
//               <h2>2. Payment Method</h2>
//             </div>
            
//             <div className="payment-options">
              
//               <label className={`payment-option ${paymentMethod === "ONLINE" ? "selected-pay" : ""}`}>
//                 <input 
//                     type="radio" 
//                     name="payment" 
//                     value="ONLINE"
//                     checked={paymentMethod === "ONLINE"}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <div className="payment-details">
//                   <span className="pay-title">Pay Online (Razorpay)</span>
//                   <span className="pay-desc">Credit/Debit Card, UPI, Netbanking</span>
//                 </div>
//               </label>

//               <label className={`payment-option ${paymentMethod === "COD" ? "selected-pay" : ""}`}>
//                 <input 
//                   type="radio" 
//                   name="payment" 
//                   value="COD" 
//                   checked={paymentMethod === "COD"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <div className="payment-details">
//                   <span className="pay-title">Cash on Delivery</span>
//                   <span className="pay-desc">Pay cash at your doorstep</span>
//                 </div>
//               </label>

//             </div>
//           </div>

//         </div>

//         {/* RIGHT SECTION */}
//         <div className="checkout-right">
//           <div className="order-summary-box">
//             <h3>Order Summary</h3>
//             <div className="summary-row">
//               <span>Items ({cartItems?.length || 0})</span>
//               <span>₹ {getCartTotal().toLocaleString('en-IN')}</span>
//             </div>
//             <div className="summary-row">
//               <span>Delivery Charges</span>
//               <span style={{color: 'green'}}>FREE</span>
//             </div>
//             <div className="divider"></div>
//             <div className="summary-total">
//               <span>Total Amount</span>
//               <span>₹ {getCartTotal().toLocaleString('en-IN')}</span>
//             </div>

//             <button className="btn-place-order" onClick={handlePlaceOrder}>
//               {paymentMethod === "ONLINE" ? "PROCEED TO PAY" : "PLACE ORDER"}
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
















//updating code in upper code adding rozers pay method


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import axios from "axios";
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const { getCartTotal, cartItems } = useCart();
//   const navigate = useNavigate();

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("COD"); // Default COD
//   const [loading, setLoading] = useState(true);

//   // --- 1. Fetch Saved Addresses ---
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please login first!");
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:8080/api/addresses/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAddresses(response.data);
        
//         // Agar pehle se addresses hain, to pehle wale ko auto-select karlo
//         if (response.data.length > 0) {
//           setSelectedAddressId(response.data[0].id);
//         }
//       } catch (error) {
//         console.error("Error fetching addresses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAddresses();
//   }, [navigate]);

//   // --- 2. Handle Place Order ---   it just a alert 
// //   const handlePlaceOrder = () => {
// //     if (!selectedAddressId) {
// //       alert("Please select a delivery address!");
// //       return;
// //     }
// //     // Abhi ke liye bas alert, Backend API next step me banayenge
// //     alert(`Order Placed Successfully with Address ID: ${selectedAddressId} via ${paymentMethod}`);
// //     // Future: Call /api/orders/place API here
// //   };

// // --- NEW CODE (Asli API Call ) ---
//   const handlePlaceOrder = async () => {
//     if (!selectedAddressId) {
//       alert("Please select a delivery address!");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     try {
//       // API Call: Address ID aur Payment Method query params mein bhej rahe hain
//       const response = await axios.post(
//         `http://localhost:8080/api/orders/place?addressId=${selectedAddressId}&paymentMethod=${paymentMethod}`,
//         {}, // Body empty hai kyunki data params mein hai
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Success
//       alert("Order Placed Successfully! Order ID: " + response.data.id);
      
//       // Cart khali ho gaya, toh home ya orders page par bhejo
//       // navigate("/my-orders"); // (Ye page abhi banana baki hai)
//       navigate("/"); // Filhal Home par bhej dete hain

//     } catch (error) {
//       console.error("Order Error:", error);
//       // Agar Stock khatam ho gaya ho to error dikhao
//       alert("Order Failed: " + (error.response?.data?.message || "Something went wrong"));
//     }
//   };

//   if (loading) return <div className="loading-text">Loading Checkout...</div>;

//   return (
//     <div className="checkout-wrapper">
//       <div className="checkout-container">
        
//         {/* --- LEFT SECTION: Details --- */}
//         <div className="checkout-left">
          
//           {/* 1. Address Section */}
//           <div className="section-box">
//             <div className="section-header">
//               <h2>1. Delivery Address</h2>
//               <button 
//                 className="btn-add-new" 
//                 onClick={() => navigate("/add-address")}
//               >
//                 + Add New
//               </button>
//             </div>

//             <div className="address-list">
//               {addresses.length === 0 ? (
//                 <p className="no-address-msg">No saved addresses found. Please add one.</p>
//               ) : (
//                 addresses.map((addr) => (
//                   <label 
//                     key={addr.id} 
//                     className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}
//                   >
//                     <input
//                       type="radio"
//                       name="address"
//                       value={addr.id}
//                       checked={selectedAddressId === addr.id}
//                       onChange={() => setSelectedAddressId(addr.id)}
//                     />
//                     <div className="address-info">
//                       <span className="addr-name">{addr.name}</span>
//                       <span className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</span>
//                       <span className="addr-phone">Mobile: {addr.mobile}</span>
//                     </div>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* 2. Payment Section */}
//           <div className="section-box">
//             <div className="section-header">
//               <h2>2. Payment Method</h2>
//             </div>
            
//             <div className="payment-options">
//               {/* Disabled Options */}
//               <label className="payment-option disabled-option">
//                 <input type="radio" disabled />
//                 <div className="payment-details">
//                   <span className="pay-title">UPI / Netbanking</span>
//                   <span className="pay-status">Temporarily Unavailable</span>
//                 </div>
//               </label>

//               <label className="payment-option disabled-option">
//                 <input type="radio" disabled />
//                 <div className="payment-details">
//                   <span className="pay-title">Credit / Debit Card</span>
//                   <span className="pay-status">Coming Soon</span>
//                 </div>
//               </label>

//               {/* Active Option */}
//               <label className={`payment-option ${paymentMethod === "COD" ? "selected-pay" : ""}`}>
//                 <input 
//                   type="radio" 
//                   name="payment" 
//                   value="COD" 
//                   checked={paymentMethod === "COD"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <div className="payment-details">
//                   <span className="pay-title">Cash on Delivery</span>
//                   <span className="pay-desc">Pay cash at your doorstep</span>
//                 </div>
//               </label>
//             </div>
//           </div>

//         </div>

//         {/* --- RIGHT SECTION: Summary --- */}
//         <div className="checkout-right">
//           <div className="order-summary-box">
//             <h3>Order Summary</h3>
            
//             <div className="summary-row">
//               <span>Items ({cartItems.length})</span>
//               <span>₹ {getCartTotal().toLocaleString('en-IN')}</span>
//             </div>
            
//             <div className="summary-row">
//               <span>Delivery Charges</span>
//               <span style={{color: 'green'}}>FREE</span>
//             </div>

//             <div className="divider"></div>

//             <div className="summary-total">
//               <span>Total Amount</span>
//               <span>₹ {getCartTotal().toLocaleString('en-IN')}</span>
//             </div>

//             <button className="btn-place-order" onClick={handlePlaceOrder}>
//               PLACE ORDER
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
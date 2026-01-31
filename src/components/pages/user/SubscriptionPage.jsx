 import React, { useEffect, useState } from 'react';
// ✅ FIX: Ensure this path is correct based on your folder structure
import api from '../../../services/api'; 
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  // Check Current Status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/subscription/status');
        setStatus(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    checkStatus();
  }, []);

  // ✅ NEW: Helper function to load Razorpay Script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Handle Payment
  const handleSubscribe = async () => {
    setLoading(true);
    try {
        // 1. Load Razorpay SDK first
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        // 2. Create Order on Backend
        const orderRes = await api.post("/subscription/create-order");
        
        // Handle Data (String vs Object check)
        let orderDetails = orderRes.data;
        if (typeof orderDetails === 'string') {
            orderDetails = JSON.parse(orderDetails);
        }

        // 3. Open Razorpay
        const options = {
            key: "rzp_test_S6dcpSwZYbmUEx", // ⚠️ PASTE YOUR ACTUAL KEY ID HERE (e.g., rzp_test_...)
            amount: orderDetails.amount,
            currency: "INR",
            name: "S-Mart Prime",
            description: "1 Year Premium Membership",
            order_id: orderDetails.id,
            
            handler: async function (response) {
                // 4. On Success -> Backend ko batao
                try {
                    await api.post("/subscription/success");
                    alert("🎉 Welcome to S-Mart Prime! Enjoy 10% Off.");
                    navigate("/"); 
                    window.location.reload(); 
                } catch (e) {
                    alert("Activation Failed but Payment Deducted. Contact Support.");
                }
            },
            theme: { color: "#f97316" }
        };

        // Now window.Razorpay will exist because we loaded the script
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error("Subscription Error:", err);
        if(err.message && err.message.includes("key")) {
             alert("Razorpay Key Missing! Paste your Key ID in SubscriptionPage.jsx");
        } else {
             alert("Something went wrong! Check Console.");
        }
    } finally {
        setLoading(false);
    }
  };

  if (!status) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center', padding:'20px' }}>
      
      {/* Already Premium? */}
      {status.isPremium ? (
        <div style={{ padding: '40px', background: '#dcfce7', borderRadius: '15px', border: '2px solid #16a34a' }}>
            <h1 style={{ color: '#166534' }}>🌟 You are a Prime Member!</h1>
            <p>Your subscription is valid till: <strong>{status.expiry}</strong></p>
            <p>Enjoy 10% Discount on all orders.</p>
        </div>
      ) : (
        /* Not Premium? Show Plan */
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #ffedd5' }}>
            <h1 style={{ color: '#ea580c', fontSize: '3rem', marginBottom: '10px', marginTop:0 }}>S-Mart <span style={{background:'#ea580c', color:'white', padding:'0 10px', borderRadius:'8px'}}>PRIME</span></h1>
            <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '30px' }}>Unlock exclusive benefits for 1 full year.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', flexWrap:'wrap' }}>
                <BenefitCard icon="🚚" text="Free Fast Delivery" />
                <BenefitCard icon="🏷️" text="Flat 10% Extra Discount" />
                <BenefitCard icon="🎧" text="Priority Support" />
            </div>

            <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>₹499 <span style={{fontSize:'1rem', color:'gray'}}>/ Year</span></h2>

            <button 
                onClick={handleSubscribe} 
                disabled={loading}
                style={{
                    padding: '15px 50px', 
                    fontSize: '1.2rem', 
                    background: '#ea580c', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 5px 15px rgba(234, 88, 12, 0.4)',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? "Processing..." : "Join Prime Now"}
            </button>
        </div>
      )}
    </div>
  );
};

const BenefitCard = ({ icon, text }) => (
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '150px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</div>
        <div style={{ fontWeight: '600', color: '#374151' }}>{text}</div>
    </div>
);

export default SubscriptionPage;
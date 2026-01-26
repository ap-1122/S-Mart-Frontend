import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, styled } from "@mui/material";
import { Check } from "@mui/icons-material"; // Icon import kiya
import "./MyOrdersPage.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: Status ko Step Number me convert karna
  const getStepIndex = (status) => {
    switch (status) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "SHIPPED": return 2;
      case "DELIVERED": return 4; // Complete
      case "CANCELLED": return -1; // Alag handle karenge
      default: return 0;
    }
  };

  // Stepper ke Steps
  const steps = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

  // Custom Connector Style (Orange Line)
  const QontoConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#f97316', // Orange
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#f97316', // Orange
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]); 
        }

      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Order Cancelled Successfully");
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <div className="loading-text">Loading your orders...</div>;

  return (
    <div className="orders-wrapper">
      <div className="orders-container">
        <h1 className="page-title">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="no-orders">
            <img src="https://cdn-icons-png.flaticon.com/512/1079/1079176.png" alt="No Orders" className="no-order-img"/>
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/")} className="btn-shop-now">Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
               const activeStep = getStepIndex(order.orderStatus);
               const isCancelled = order.orderStatus === "CANCELLED";

               return (
                  <div key={order.id} className="order-card">
                    
                    {/* Header */}
                    <div className="order-header">
                      <div className="order-info-left">
                        <h3>Order #{order.id}</h3>
                        <span className="order-date">
                          Placed on: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Date N/A"}
                        </span>
                      </div>
                      <div className="order-info-right">
                        <span className={`status-badge ${order.orderStatus?.toLowerCase() || 'pending'}`}>
                          {order.orderStatus || "PENDING"}
                        </span>
                        <span className="order-total">
                          Total: ₹ {order.totalAmount?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                    </div>

                    <div className="divider"></div>

                    {/* 🔥 NEW: Progress Stepper (Only if not Cancelled) */}
                    {!isCancelled && (
                        <div className="stepper-container">
                            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                                ))}
                            </Stepper>
                        </div>
                    )}
                    
                    {/* If Cancelled, show Red Message */}
                    {isCancelled && (
                        <div className="cancelled-message">
                            ❌ This Order has been Cancelled.
                        </div>
                    )}

                    <div className="divider"></div>

                    {/* Items */}
                    <div className="order-items-box">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item) => (
                          <div key={item.id} className="order-item-row">
                            <img 
                              src={item.productImage || "https://via.placeholder.com/80?text=No+Image"} 
                              alt="Product" 
                              className="item-thumb" 
                             />
                            <div className="item-details">
                              <span className="item-name">{item.product?.name || "Unknown Product"}</span>
                              <span className="item-variant">
                                Variant: {item.variant?.sku || "Standard"} | Qty: {item.quantity}
                              </span>
                              <span className="item-price">
                                ₹ {item.orderedPrice?.toLocaleString('en-IN') || 0}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{padding:'10px', color:'red'}}>No items details found</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="order-footer">
                        <div className="delivery-loc">
                          <strong>Delivering to:</strong> {order.address ? `${order.address.city}, ${order.address.state}` : "Address Info Missing"} 
                          ({order.paymentMethod})
                        </div>
                        {order.orderStatus === "PENDING" && (
                          <button className="btn-cancel" onClick={() => handleCancelOrder(order.id)}>
                            Cancel Order
                          </button>
                        )}
                    </div>

                  </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;






















//adding only order progress step 

//  import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./MyOrdersPage.css";

// const MyOrdersPage = () => {
//   // Change 1: Initial state ko explicit empty array rakho
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:8080/api/orders/my-orders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         console.log("My Orders API Response:", response.data); // Debugging ke liye

//         // Change 2: Check karo ki response array hai ya nahi
//         if (Array.isArray(response.data)) {
//           setOrders(response.data);
//         } else {
//           console.error("Backend sent non-array data:", response.data);
//           // Agar backend array nahi bhejta, to hum empty array set karenge taaki app crash na ho
//           setOrders([]); 
//         }

//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   // Function inside MyOrdersPage component
//   const handleCancelOrder = async (orderId) => {
//     const confirm = window.confirm("Are you sure you want to cancel this order?");
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       alert("Order Cancelled Successfully");
//       window.location.reload(); // Page refresh taaki status update dikhe
      
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to cancel order");
//     }
//   };

//   if (loading) return <div className="loading-text">Loading your orders...</div>;

//   return (
//     <div className="orders-wrapper">
//       <div className="orders-container">
//         <h1 className="page-title">My Orders</h1>

//         {/* Change 3: Extra safety check length check karne se pehle */}
//         {!orders || orders.length === 0 ? (
//           <div className="no-orders">
//             <img src="https://cdn-icons-png.flaticon.com/512/1079/1079176.png" alt="No Orders" className="no-order-img"/>
//             <p>You haven't placed any orders yet.</p>
//             <button onClick={() => navigate("/")} className="btn-shop-now">Start Shopping</button>
//           </div>
//         ) : (
//           <div className="orders-list">
//             {orders.map((order) => (
//               <div key={order.id} className="order-card">
                
//                 {/* Header */}
//                 <div className="order-header">
//                   <div className="order-info-left">
//                     <h3>Order #{order.id}</h3>
//                     <span className="order-date">
//                       {/* Safety Check for Date */}
//                       Placed on: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Date N/A"}
//                     </span>
//                   </div>
//                   <div className="order-info-right">
//                     <span className={`status-badge ${order.orderStatus?.toLowerCase() || 'pending'}`}>
//                       {order.orderStatus || "PENDING"}
//                     </span>
//                     <span className="order-total">
//                       Total: ₹ {order.totalAmount?.toLocaleString('en-IN') || 0}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="divider"></div>

//                 {/* Items */}
//                 <div className="order-items-box">
//                   {/* Safety Check: OrderItems exist karte hain? */}
//                   {order.orderItems && order.orderItems.length > 0 ? (
//                     order.orderItems.map((item) => (
//                       <div key={item.id} className="order-item-row">
                        
//                         {/* <img 
//                           src="https://via.placeholder.com/80?text=Product" 
//                           alt="Product" 
//                           className="item-thumb" 
//                         /> */}
//                         {/* Backend se aayi image use karo, agar nahi hai to placeholder */}
//                         <img 
//                           src={item.productImage || "https://via.placeholder.com/80?text=No+Image"} 
//                            alt="Product" 
//                           className="item-thumb" 
//                          />
//                         <div className="item-details">
//                           <span className="item-name">{item.product?.name || "Unknown Product"}</span>
//                           <span className="item-variant">
//                              {/* Safety Check for Variant */}
//                             Variant: {item.variant?.sku || "Standard"} | Qty: {item.quantity}
//                           </span>
//                           <span className="item-price">
//                             ₹ {item.orderedPrice?.toLocaleString('en-IN') || 0}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p style={{padding:'10px', color:'red'}}>No items details found (Backend Issue)</p>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="order-footer">
//                    <div className="delivery-loc">
//                       {/* Safety Check for Address */}
//                       <strong>Delivering to:</strong> {order.address ? `${order.address.city}, ${order.address.state}` : "Address Info Missing"} 
//                       ({order.paymentMethod})
//                    </div>
//                    {order.orderStatus === "PENDING" && (
//                      <button className="btn-cancel" onClick={() => handleCancelOrder(order.id)}>
//                        Cancel Order
//                      </button>
//                    )}
//                 </div>

//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrdersPage;
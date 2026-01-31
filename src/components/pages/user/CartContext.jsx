 import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Helper: Token Header
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return null; // Agar token nahi hai to null return karo
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- 1. FETCH CART ---
  const fetchCart = useCallback(async () => {
    const config = getAuthHeaders();
    if (!config) {
      setCartItems([]); // Logout hai to cart empty rakho
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/cart/", config);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.totalAmount || 0);
    } catch (error) {
      console.error("Cart fetch error:", error);
      // Agar 403/401 aaye to user shayad logout ho gaya hai
      if(error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
      }
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- 2. ADD TO CART ---
  const addToCart = async (product, variant, quantity = 1) => {
    const config = getAuthHeaders();
    
    // Check 1: Login hai ya nahi?
    if (!config) {
      alert("Please login first to add items!");
      return; // 🛑 Code yahi ruk jayega (Double alert fix)
    }

    try {
      // Backend Call
      await axios.post(
        "http://localhost:8080/api/cart/add",
        null,
        {
          params: {
            productId: product.id,
            variantId: variant.id,
            quantity: quantity,
          },
          ...config, // Header yahan spread hoga
        }
      );

      // Agar yahan pahuche matlab SUCCESS
      alert("Item added successfully!");
      fetchCart(); // UI update karo

    } catch (error) {
      // Agar yahan pahuche matlab FAILURE
      console.error("Add to cart error:", error);
      alert("Failed to add item. Try logging in again.");
    }
  };

  // --- 3. REMOVE ITEM ---
  const removeFromCart = async (cartItemId) => {
    const config = getAuthHeaders();
    if (!config) return;

    try {
      await axios.delete(`http://localhost:8080/api/cart/remove/${cartItemId}`, config);
      fetchCart();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // --- 4. UPDATE QUANTITY ---
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const config = getAuthHeaders();
    if (!config) return;

    try {
      await axios.put(
        "http://localhost:8080/api/cart/update",
        null,
        {
          params: { cartItemId, quantity },
          ...config,
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const getCartCount = () => {
    return cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cartTotal;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

















//this save add to cart data into local storage upper cade are redirect to backend and save data to database
// import React, { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   // LocalStorage se purana data uthao ya khali array
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("smart_cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Jab bhi cart change ho, LocalStorage update karo
//   useEffect(() => {
//     localStorage.setItem("smart_cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // --- 1. ADD TO CART FUNCTION ---
//   const addToCart = (product, variant, quantity = 1) => {
//     setCartItems((prevItems) => {
//       // Check karo kya ye variant pehle se cart me hai?
//       const existingItem = prevItems.find(
//         (item) => item.variantId === variant.id
//       );

//       if (existingItem) {
//         // Agar hai, to bas Quantity badha do
//         return prevItems.map((item) =>
//           item.variantId === variant.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // Agar naya hai, to list me add kar do
//         return [
//           ...prevItems,
//           {
//             productId: product.id,
//             variantId: variant.id,
//             name: product.name,
//             image: variant.image || (product.images[0]?.imageUrl), // Variant image or default
//             price: variant.price,
//             attributes: variant.attributes, // Color, Size etc.
//             brand: product.brandName,
//             stock: variant.stock,
//             quantity: quantity,
//           },
//         ];
//       }
//     });
//   };

//   // --- 2. REMOVE ITEM ---
//   const removeFromCart = (variantId) => {
//     setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
//   };

//   // --- 3. UPDATE QUANTITY (+/-) ---
//   const updateQuantity = (variantId, delta) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) => {
//         if (item.variantId === variantId) {
//           const newQty = item.quantity + delta;
//           // Quantity 1 se kam nahi honi chahiye aur Stock se zyada nahi
//           if (newQty < 1) return item; 
//           if (newQty > item.stock) {
//             alert(`Only ${item.stock} items available in stock!`);
//             return item;
//           }
//           return { ...item, quantity: newQty };
//         }
//         return item;
//       })
//     );
//   };

//   // --- 4. CART TOTAL CALCULATION ---
//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartCount = () => {
//     return cartItems.reduce((count, item) => count + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // LocalStorage se purana data uthao ya khali array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("smart_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Jab bhi cart change ho, LocalStorage update karo
  useEffect(() => {
    localStorage.setItem("smart_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- 1. ADD TO CART FUNCTION ---
  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check karo kya ye variant pehle se cart me hai?
      const existingItem = prevItems.find(
        (item) => item.variantId === variant.id
      );

      if (existingItem) {
        // Agar hai, to bas Quantity badha do
        return prevItems.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Agar naya hai, to list me add kar do
        return [
          ...prevItems,
          {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            image: variant.image || (product.images[0]?.imageUrl), // Variant image or default
            price: variant.price,
            attributes: variant.attributes, // Color, Size etc.
            brand: product.brandName,
            stock: variant.stock,
            quantity: quantity,
          },
        ];
      }
    });
  };

  // --- 2. REMOVE ITEM ---
  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  // --- 3. UPDATE QUANTITY (+/-) ---
  const updateQuantity = (variantId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.variantId === variantId) {
          const newQty = item.quantity + delta;
          // Quantity 1 se kam nahi honi chahiye aur Stock se zyada nahi
          if (newQty < 1) return item; 
          if (newQty > item.stock) {
            alert(`Only ${item.stock} items available in stock!`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // --- 4. CART TOTAL CALCULATION ---
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
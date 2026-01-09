 import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productState, setProductState] = useState({
    productId: null,
    categoryId: null,
    brandId: null,
    slug: "",
    variants: []
  });

  return (
    <ProductContext.Provider value={{ productState, setProductState }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook को अलग से यहाँ डिफाइन करें
export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
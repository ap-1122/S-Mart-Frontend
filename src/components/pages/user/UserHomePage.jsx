 import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; // ✅ Teleporter Import kiya

const UserHomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Teleporter Ready kiya
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Latest Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            // ✅ CONNECTION: Yahan click karne se 'App.jsx' active hoga
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white border p-4 rounded-lg cursor-pointer hover:shadow-xl transition-all"
          >
            {/* Image */}
            <div className="h-40 flex justify-center items-center mb-4 bg-gray-100 rounded">
               <img 
                 src={product.images && product.images.length > 0 ? product.images[0].imageUrl : "https://via.placeholder.com/150"} 
                 alt={product.name} 
                 className="h-full object-contain mix-blend-multiply"
               />
            </div>

            {/* Info */}
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.brandName}</p>
            <p className="font-bold text-lg mt-2 text-green-700">
               ₹{product.variants?.[0]?.price || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
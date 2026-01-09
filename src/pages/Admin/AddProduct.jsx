import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AddProduct = () => {
  // --- States for Dropdowns ---
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // --- Main Form State ---
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    price: '',
    stock: '',
    sku: '',
    image: null
  });

  const [loading, setLoading] = useState(false);

  // 1. Load Dropdown Data on start
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories/root'),
          api.get('/brands')
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    loadData();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  // --- 🚀 THE MAIN SAVING LOGIC (Sequential) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // STEP 1: Create Product (Parent)
      // Backend expects: name, description, categoryId, brandId
      const productPayload = {
        name: productData.name,
        description: productData.description,
        categoryId: productData.categoryId,
        brandId: productData.brandId
      };
      const productRes = await api.post('/products', productPayload);
      const newProductId = productRes.data.id; 
      console.log("Product Created! ID:", newProductId);

      // STEP 2: Create Variant (Using newProductId)
      // Backend expects: sku, price, stock
      const variantPayload = {
        sku: productData.sku || `${productData.name.substring(0,3)}-${Date.now()}`,
        price: productData.price,
        stock: productData.stock
      };
      await api.post(`/variants/${newProductId}`, variantPayload);
      console.log("Variant Linked!");

      // STEP 3: Upload Image (If selected)
      if (productData.image) {
        const formData = new FormData();
        formData.append('file', productData.image);
        await api.post(`/product-images/upload/${newProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("Image Uploaded!");
      }

      alert("Product, Variant, and Image Saved Successfully! 🎉");
      // Reset Form
      setProductData({ name: '', description: '', categoryId: '', brandId: '', price: '', stock: '', sku: '', image: null });

    } catch (err) {
      console.error("Complete Save Error:", err);
      alert("Error saving product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', background: '#1e293b', color: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#f97316' }}>Add New Product</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        {/* Basic Info */}
        <label>Product Name</label>
        <input name="name" value={productData.name} onChange={handleChange} required placeholder="e.g. iPhone 15 Pro" />

        <label>Description</label>
        <textarea name="description" value={productData.description} onChange={handleChange} rows="3" />

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>Category</label>
            <select name="categoryId" value={productData.categoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Brand</label>
            <select name="brandId" value={productData.brandId} onChange={handleChange} required>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {/* Variant Info (Backend Price/Stock yahan hai) */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>Price (₹)</label>
            <input type="number" name="price" value={productData.price} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Stock</label>
            <input type="number" name="stock" value={productData.stock} onChange={handleChange} required />
          </div>
        </div>

        <label>Product Image</label>
        <input type="file" onChange={handleFileChange} accept="image/*" />

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px', fontSize: '18px' }}
        >
          {loading ? "Saving Everything..." : "🚀 Create Product & Variant"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

































// // src/pages/Admin/AddProduct.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Admin.css"; // CSS file import kiya

// const AddProduct = () => {
//   // 1. Data store karne ke liye States
//   const [categories, setCategories] = useState([]);
//   const [attributes, setAttributes] = useState([]); // Database se aayenge (Color, Size)
  
//   // Form ka data
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     categoryId: "",
//   });

//   // Variants (Example: Color: Red, Size: XL)
//   const [selectedAttrId, setSelectedAttrId] = useState("");
//   const [attrValue, setAttrValue] = useState("");
//   const [addedVariants, setAddedVariants] = useState([]); // List of added variants

//   // Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // --- Step 1: Load Categories & Attributes from Backend ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const catRes = await axios.get("http://localhost:8080/admin/products/categories");
//         const attRes = await axios.get("http://localhost:8080/admin/products/attributes");
//         setCategories(catRes.data);
//         setAttributes(attRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         alert("Backend server nahi chal raha hai!");
//       }
//     };
//     fetchData();
//   }, []);

//   // --- Step 2: Handle Input Changes ---
//   const handleChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   // --- Step 3: Handle Variant Addition ---
//   const addVariant = () => {
//     if (!selectedAttrId || !attrValue) {
//         alert("Attribute aur Value dono select karein!");
//         return;
//     }
//     // Variant list me add karo
//     setAddedVariants([
//       ...addedVariants,
//       { attributeId: selectedAttrId, value: attrValue } // Backend DTO format
//     ]);
//     setAttrValue(""); // Reset input
//   };

//   // --- Step 4: Handle Cloudinary Upload ---
//   const handleImageUpload = async () => {
//     if (!imageFile) return null;

//     const data = new FormData();
//     data.append("file", imageFile);
//     data.append("upload_preset", "smart_images"); // Aapka Preset Name
//     data.append("cloud_name", "djyombzlq");       // Aapka Cloud Name

//     try {
//       setUploading(true);
//       // Cloudinary API Call
//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/djyombzlq/image/upload",
//         data
//       );
//       setUploading(false);
//       return res.data.secure_url; // Image URL wapas milega
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       setUploading(false);
//       alert("Image Upload Failed!");
//       return null;
//     }
//   };

//   // --- Step 5: Final Form Submit ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Pehle Image Upload karo
//     const imageUrl = await handleImageUpload();
//     if (!imageUrl) {
//         alert("Image upload zaroori hai!");
//         return;
//     }

//     // Backend ko data bhejo
//     const payload = {
//         ...product,
//         imageUrl: imageUrl, // Cloudinary URL
//         variantAttributes: addedVariants // List of variants
//     };

//     try {
//         await axios.post("http://localhost:8080/admin/products/create", payload);
//         alert("Product Created Successfully! 🎉");
//         // Reset form or redirect
//     } catch (error) {
//         console.error("Error creating product:", error);
//         alert("Failed to create product.");
//     }
//   };

//   return (
//     <div className="admin-container">
//       <h2 className="admin-header">Add New Product</h2>
      
//       <form onSubmit={handleSubmit}>
        
//         {/* Name */}
//         <div className="form-group">
//           <label>Product Name</label>
//           <input type="text" name="name" className="form-input" onChange={handleChange} required />
//         </div>

//         {/* Description */}
//         <div className="form-group">
//           <label>Description</label>
//           <textarea name="description" className="form-textarea" onChange={handleChange} required />
//         </div>

//         {/* Price & Stock */}
//         <div style={{ display: "flex", gap: "20px" }}>
//           <div className="form-group" style={{ flex: 1 }}>
//             <label>Price (₹)</label>
//             <input type="number" name="price" className="form-input" onChange={handleChange} required />
//           </div>
//           <div className="form-group" style={{ flex: 1 }}>
//             <label>Stock</label>
//             <input type="number" name="stock" className="form-input" onChange={handleChange} required />
//           </div>
//         </div>

//         {/* Category Dropdown (Backend se aaya hua) */}
//         <div className="form-group">
//           <label>Category</label>
//           <select name="categoryId" className="form-select" onChange={handleChange} required>
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>{cat.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Image Upload */}
//         <div className="form-group">
//             <label>Product Image</label>
//             <input type="file" className="form-input" onChange={(e) => setImageFile(e.target.files[0])} required />
//         </div>

//         {/* Variants Section */}
//         <div className="variant-box">
//             <label>Product Attributes (Optional)</label>
//             <div className="variant-row">
//                 <select className="form-select" onChange={(e) => setSelectedAttrId(e.target.value)}>
//                     <option value="">Choose Attribute (e.g. Color)</option>
//                     {attributes.map((attr) => (
//                         <option key={attr.id} value={attr.id}>{attr.name}</option>
//                     ))}
//                 </select>
//                 <input 
//                     type="text" 
//                     placeholder="Value (e.g. Red)" 
//                     className="form-input" 
//                     value={attrValue}
//                     onChange={(e) => setAttrValue(e.target.value)}
//                 />
//                 <button type="button" className="btn-add" onClick={addVariant}>Add</button>
//             </div>
            
//             {/* Show Added Variants */}
//             <div className="added-variants">
//                 {addedVariants.map((v, index) => (
//                     <span key={index}>
//                         ID:{v.attributeId} - {v.value}
//                     </span>
//                 ))}
//             </div>
//         </div>

//         <button type="submit" className="submit-btn" disabled={uploading}>
//             {uploading ? "Uploading Image..." : "Create Product"}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default AddProduct;
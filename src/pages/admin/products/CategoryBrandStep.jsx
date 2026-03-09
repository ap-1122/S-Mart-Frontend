import { useState, useEffect } from "react";
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel, Link } from "@mui/material"; // Link import kiya
import api from "../../../services/api"; 
import { useProduct } from "../../../services/ProductContext";

// ✅ 1. userRole prop receive kiya (Layout se aa raha hai)
export default function CategoryBrandStep({ onNext, userRole }) {
  const { productState, setProductState } = useProduct();
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState("");

  useEffect(() => {
    api.get("/categories/root")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Category Load Error", err));
  }, []);

  const handleConfirm = () => {
    if (!selectedCatId) {
      alert("Please select a category");
      return;
    }
    setProductState({ ...productState, categoryId: selectedCatId });
    onNext(); 
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 1: Select Category</Typography>
      
      {/* Category Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Choose Category</InputLabel>
        <Select
          value={selectedCatId}
          label="Choose Category"
          onChange={(e) => setSelectedCatId(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 🚀 ADMIN ONLY FEATURE: Create New Category Shortcut */}
      {/* Seller ko ye nahi dikhega */}
      {userRole === 'ADMIN' && (
        <Box sx={{ mb: 3, textAlign: 'right' }}>
           <Typography variant="caption" sx={{ mr: 1 }}>Not found?</Typography>
           <Button 
             size="small" 
             variant="outlined" 
             onClick={() => window.open('/admin/categories', '_blank')} // New tab me kholega
           >
             ➕ Create New Category
           </Button>
        </Box>
      )}
      
      <Button 
        variant="contained" 
        color="warning" 
        onClick={handleConfirm}
        disabled={!selectedCatId}
        fullWidth // Thoda design acha lagega
      >
        Confirm & Continue
      </Button>
    </Box>
  );
}
















// import { useState, useEffect } from "react";
// import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
// import api from "../../../services/api"; 
// import { useProduct } from "../../../services/ProductContext";

// export default function CategoryBrandStep({ onNext }) {
//   const { productState, setProductState } = useProduct();
//   const [categories, setCategories] = useState([]);
//   const [selectedCatId, setSelectedCatId] = useState("");

//   // 1. Load Categories from Backend
//   useEffect(() => {
//     api.get("/categories/root") // Sirf Root categories lao (e.g. Electronics, Fashion)
//       .then(res => setCategories(res.data))
//       .catch(err => console.error("Category Load Error", err));
//   }, []);

//   const handleConfirm = () => {
//     if (!selectedCatId) {
//       alert("Please select a category");
//       return;
//     }
//     // Context me save karo
//     setProductState({ ...productState, categoryId: selectedCatId });
//     onNext(); 
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom color="primary">Step 1: Select Category</Typography>
      
//       <FormControl fullWidth sx={{ mb: 3 }}>
//         <InputLabel>Choose Category</InputLabel>
//         <Select
//           value={selectedCatId}
//           label="Choose Category"
//           onChange={(e) => setSelectedCatId(e.target.value)}
//         >
//           {categories.map((cat) => (
//             <MenuItem key={cat.id} value={cat.id}>
//               {cat.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
      
//       <Button 
//         variant="contained" 
//         color="warning" 
//         onClick={handleConfirm}
//         disabled={!selectedCatId}
//       >
//         Confirm & Continue
//       </Button>
//     </Box>
//   );
// }



















//only select by id category step file in upper code add drropdown se select karne ka option add karna hai so hame manualyy id na dena pade
//  import { useState } from "react";
// import { Box, Button, TextField, Typography, Chip, CircularProgress } from "@mui/material";
// import api from "../../../services/api"; 
// import { useProduct } from "../../../services/ProductContext";

// export default function CategoryBrandStep({ onNext }) {
//   const { productState, setProductState } = useProduct();
//   const [categoryId, setCategoryId] = useState("");
//   const [breadcrumb, setBreadcrumb] = useState([]);
//   const [loading, setLoading] = useState(false); // ✅ Ab hum isse use karenge

//   const fetchBreadcrumb = async () => {
//     if (!categoryId) return;
//     try {
//       setLoading(true);
//       const res = await api.get(`/categories/breadcrumb/${categoryId}`);
//       setBreadcrumb(res.data);
//     } catch (error) { // ✅ 'err' hata kar 'error' kiya aur console me use kiya
//       console.error("Breadcrumb error:", error);
//       alert("Invalid category ID");
//       setBreadcrumb([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = () => {
//     if (!breadcrumb.length) {
//       alert("Please select valid category");
//       return;
//     }
//     setProductState({ ...productState, categoryId });
//     onNext(); 
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom color="primary">Step 1: Select Category</Typography>
      
//       <TextField 
//         label="Enter Category ID" 
//         value={categoryId} 
//         onChange={e => setCategoryId(e.target.value)} 
//         fullWidth 
//         sx={{ mb: 2 }} 
//       />
      
//       <Button variant="contained" onClick={fetchBreadcrumb} disabled={loading}>
//         {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Category"}
//       </Button>
      
//       {breadcrumb.length > 0 && (
//         <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: '8px' }}>
//           <Typography variant="subtitle2" gutterBottom>Path:</Typography>
//           {breadcrumb.map((cat, index) => (
//             <Chip key={cat.id} label={cat.name} sx={{ mr: 1 }} color={index === breadcrumb.length - 1 ? "primary" : "default"} />
//           ))}
//         </Box>
//       )}
      
//       <Button variant="contained" color="warning" sx={{ mt: 3 }} onClick={handleConfirm} disabled={!breadcrumb.length}>
//         Confirm & Continue
//       </Button>
//     </Box>
//   );
// }
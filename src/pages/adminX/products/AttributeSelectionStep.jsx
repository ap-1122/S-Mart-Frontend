 import { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, CircularProgress } from "@mui/material";
import api from "../../../services/api"; // ✅ Your project's secured API instance
import { useProduct } from "../../../services/ProductContext";

export default function AttributeSelectionStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load All Attributes
  useEffect(() => {
    api.get("/attributes")
      .then(res => {
        setAvailableAttributes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Attributes load failed:", err);
        setLoading(false);
      });
  }, []);

  // 2. Link Attribute on Click
  const handleAddAttribute = async (attr) => {
    if (!productId) {
      alert("Product ID is missing. Please save Product Info first.");
      return;
    }

    try {
      // ✅ Frontend calls the backend method we just added
      await api.post(`/products/${productId}/attributes/${attr.id}`);
      setSelectedAttributes(prev => [...prev, attr]);
      console.log(`Linked ${attr.name} to Product ${productId}`);
    } catch (error) {
      // ✅ Using the error variable properly to stop warnings
      console.error("Link error details:", error.response?.data || error.message);
      alert("Server rejected attribute link. Make sure Backend has the endpoint.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">
        Step 4: Attach Attributes
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
        Product ID: {productId || "Not Found"}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {availableAttributes.map(attr => {
          const isSelected = selectedAttributes.find(a => a.id === attr.id);
          return (
            <Chip
              key={attr.id}
              label={attr.name}
              onClick={() => !isSelected && handleAddAttribute(attr)}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              sx={{ cursor: 'pointer', p: 1, fontSize: '15px' }}
            />
          );
        })}
      </Box>
      
      <Button variant="contained" onClick={onNext} disabled={!productId}>
        Continue to Variants →
      </Button>
    </Box>
  );
}




















//it also create an error not useable file so upper code is better
// import { useEffect, useState } from "react";
// import { Box, Typography, Chip, Button, CircularProgress } from "@mui/material";
// import api from "../../../services/api";
// import { useProduct } from "../../../services/ProductContext";

// export default function AttributeSelectionStep({ onNext }) {
//   const { productState } = useProduct();
//   const [attributes, setAttributes] = useState([]);
//   const [selectedAttrs, setSelectedAttrs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // SAFETY CHECK: Agar Product ID nahi hai (Refresh kiya), to wapas bhejo
//     if (!productState.productId) {
//         alert("Product ID missing! Redirecting to start...");
//         // Yahan tum window.location.reload() bhi kar sakte ho ya user ko bol sakte ho
//         return;
//     }

//     api.get("/attributes")
//       .then(res => {
//         setAttributes(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//           console.error(err);
//           setLoading(false);
//       });
//   }, [productState.productId]);

//   const toggleAttribute = (attr) => {
//     if (selectedAttrs.find(a => a.id === attr.id)) {
//       setSelectedAttrs(selectedAttrs.filter(a => a.id !== attr.id));
//     } else {
//       setSelectedAttrs([...selectedAttrs, attr]);
//     }
//   };

//   const handleSave = async () => {
//     if (selectedAttrs.length === 0) {
//       alert("Please select at least one attribute");
//       return;
//     }
//     try {
//       for (let attr of selectedAttrs) {
//         await api.post(`/products/${productState.productId}/attributes/${attr.id}`);
//       }
//       onNext();
//     } catch (err) {
//       console.error("Link Error", err);
//       alert("Failed to link attributes. Ensure Product ID is valid.");
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom color="primary">Step 3: Select Attributes</Typography>
//       {loading ? <CircularProgress /> : (
//         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
//           {attributes.map(attr => (
//             <Chip
//               key={attr.id}
//               label={attr.name}
//               onClick={() => toggleAttribute(attr)}
//               color={selectedAttrs.find(a => a.id === attr.id) ? "primary" : "default"}
//               variant={selectedAttrs.find(a => a.id === attr.id) ? "filled" : "outlined"}
//               sx={{ cursor: 'pointer', p: 1 }}
//             />
//           ))}
//         </Box>
//       )}
//       <Button variant="contained" onClick={handleSave} disabled={selectedAttrs.length === 0}>
//         Save & Continue
//       </Button>
//     </Box>
//   );
// }

















//upper code is more updated version and safe 
// import { useEffect, useState } from "react";
// import { Box, Typography, Chip, Button, CircularProgress } from "@mui/material";
// import api from "../../../services/api";
// import { useProduct } from "../../../services/ProductContext";

// export default function AttributeSelectionStep({ onNext }) {
//   const { productState } = useProduct();
//   const [attributes, setAttributes] = useState([]);
//   const [selectedAttrs, setSelectedAttrs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. Load All Available Attributes (Color, Size, RAM)
//   useEffect(() => {
//     api.get("/attributes")
//       .then(res => {
//         setAttributes(res.data);
//         setLoading(false);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   // 2. Handle Click (Select/Deselect)
//   const toggleAttribute = (attr) => {
//     if (selectedAttrs.find(a => a.id === attr.id)) {
//       setSelectedAttrs(selectedAttrs.filter(a => a.id !== attr.id)); // Remove
//     } else {
//       setSelectedAttrs([...selectedAttrs, attr]); // Add
//     }
//   };

//   // 3. Save to Backend (Link Attributes to Product)
//   const handleSave = async () => {
//     if (selectedAttrs.length === 0) {
//       alert("Please select at least one attribute (e.g. Color)");
//       return;
//     }

//     try {
//       // Loop chala kar sabko link karo (Backend me Bulk API nahi hai, to loop use karenge)
//       for (let attr of selectedAttrs) {
//         await api.post(`/products/${productState.productId}/attributes/${attr.id}`);
//       }
//       onNext();
//     } catch (err) {
//       console.error("Link Error", err);
//       alert("Failed to link attributes");
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom color="primary">
//         Step 3: Select Attributes
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
//         Click to select what variations this product has (e.g. Color, Size)
//       </Typography>

//       {loading ? <CircularProgress /> : (
//         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
//           {attributes.map(attr => (
//             <Chip
//               key={attr.id}
//               label={attr.name}
//               onClick={() => toggleAttribute(attr)}
//               color={selectedAttrs.find(a => a.id === attr.id) ? "primary" : "default"}
//               variant={selectedAttrs.find(a => a.id === attr.id) ? "filled" : "outlined"}
//               sx={{ cursor: 'pointer', fontSize: '16px', p: 1 }}
//             />
//           ))}
//         </Box>
//       )}

//       <Button variant="contained" onClick={handleSave} disabled={selectedAttrs.length === 0}>
//         Save & Continue to Variants
//       </Button>
//     </Box>
//   );
// }
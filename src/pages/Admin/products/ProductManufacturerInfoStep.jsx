import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import api from "../../../services/api";
import { useProduct } from "../../../services/ProductContext";

export default function ProductManufacturerInfoStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;
  
  const [info, setInfo] = useState("");

  useEffect(() => {
    // Load existing info
    // Note: Iske liye humne alag endpoint nahi banaya tha, 
    // ye usually 'Product' table me hi ek column 'manufacturerInfo' hota hai.
    // Chalo maan lete hain hum Product update kar rahe hain.
  }, []);

  const handleSave = async () => {
    try {
      // Backend me humne /manufacturer endpoint banaya tha Phase 2 me
      await api.post(`/products/${productId}/manufacturer`, { content: info });
      onNext();
    } catch (err) {
      console.error(err);
      alert("Failed to save info");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 8: Manufacturer Info</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Add detailed info about the manufacturer, importer, or packer.
      </Typography>

      <TextField
        label="Manufacturer Details"
        multiline
        rows={6}
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        fullWidth
        placeholder="e.g. Manufactured by Samsung India Electronics Pvt. Ltd..."
      />

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button variant="contained" color="warning" onClick={handleSave}>
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
}
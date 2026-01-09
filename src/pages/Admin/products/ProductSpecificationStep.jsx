 import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function ProductSpecificationStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;
  const [specs, setSpecs] = useState([{ specKey: "", specValue: "" }]);

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`http://localhost:8080/api/products/${productId}/specifications`)
      .then((res) => {
        if (res.data?.length > 0) {
          setSpecs(res.data.map((s) => ({ specKey: s.specKey, specValue: s.specValue })));
        }
      })
      .catch((error) => {
        console.error("Specs fetch failed:", error); // ✅ Fixed: Using the error variable
      });
  }, [productId]);

  const handleChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { specKey: "", specValue: "" }]);

  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  const saveSpecs = async () => {
    const validSpecs = specs.filter((s) => s.specKey.trim() && s.specValue.trim());
    if (validSpecs.length === 0) return alert("Add at least one specification");
    
    try {
      await axios.post(`http://localhost:8080/api/products/${productId}/specifications/bulk`, validSpecs);
      alert("Specifications saved");
      onNext();
    } catch (error) {
      console.error("Save specs failed:", error);
      alert("Failed to save specifications. Check if Product ID is valid.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Product Specifications</Typography>
      {specs.map((spec, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField label="Key" value={spec.specKey} onChange={(e) => handleChange(index, "specKey", e.target.value)} fullWidth />
          <TextField label="Value" value={spec.specValue} onChange={(e) => handleChange(index, "specValue", e.target.value)} fullWidth />
          <IconButton color="error" onClick={() => removeSpec(index)} disabled={specs.length === 1}><DeleteIcon /></IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={addSpec}>Add Specification</Button>
      <Divider sx={{ my: 3 }} />
      <Button variant="contained" onClick={saveSpecs}>Save & Continue →</Button>
    </Box>
  );
}
import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // ✅ Ab ye kaam karega
import api from "../../../services/api";
import { useProduct } from "../../../services/ProductContext";

export default function ProductFeatureStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;
  
  const [features, setFeatures] = useState([]);
  const [input, setInput] = useState("");

  const addFeature = () => {
    if(!input.trim()) return;
    setFeatures([...features, input]);
    setInput("");
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const saveFeatures = async () => {
    if(features.length === 0) {
        alert("Add at least one feature");
        return;
    }
    
    try {
        // Backend API jo humne Phase 2 - Step 2 me banayi thi
        await api.post(`/products/${productId}/features/bulk`, features);
        alert("Features Saved!");
        onNext();
    } catch(err) {
        console.error(err);
        alert("Failed to save features");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 6: Product Highlights (Features)</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Add bullet points like "1 Year Warranty", "Fast Charging" etc.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
            label="Enter Feature" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            fullWidth 
            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
        />
        <Button variant="contained" onClick={addFeature} size="large">Add</Button>
      </Box>

      <List sx={{ bgcolor: '#f1f5f9', borderRadius: '8px', mb: 3 }}>
        {features.map((feat, index) => (
            <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => removeFeature(index)} color="error">
                    <DeleteIcon />
                </IconButton>
            }>
                <ListItemText primary={`• ${feat}`} />
            </ListItem>
        ))}
        {features.length === 0 && <Typography sx={{ p: 2, color: 'gray' }}>No features added yet.</Typography>}
      </List>

      <Button variant="contained" color="warning" onClick={saveFeatures} disabled={features.length === 0}>
        Save & Continue
      </Button>
    </Box>
  );
}
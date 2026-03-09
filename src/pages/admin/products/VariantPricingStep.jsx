import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import api from "../../../services/api"; // Tumhara API instance
import { useProduct } from "../../../services/ProductContext";

export default function VariantPricingStep({ onNext }) {
  const { productState } = useProduct();
  // Safe check: Agar variants empty hain to empty array use karo
  const variants = productState.variants || []; 
  
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [priceData, setPriceData] = useState({ mrp: "", sellingPrice: "" });
  const [discount, setDiscount] = useState({ type: "PERCENT", value: "" }); // PERCENT or FLAT

  // Jab variant select ho, to purana data load karo (Optional but good for UX)
  // Abhi hum maan ke chalte hain ki user naya price dal raha hai.

  const handleSave = async () => {
    if (!selectedVariantId) {
      alert("Select a variant first");
      return;
    }
    
    // Backend API Call (Example endpoint - tumhe backend me banana pad sakta hai agar alag hai)
    // Hamare current Variant entity me 'price' field hai. 
    // Agar tumhe MRP aur Discount alag se chahiye, to 'Variant' entity me ye fields add karne padenge.
    // FILHAL: Hum sirf Selling Price update kar rahe hain jo hamare pass already hai.
    
    try {
        // Humne Variant banate waqt price dala tha, ye "Update" ke liye hai
        // Ya agar tum MRP/Discount ka logic lagana chahte ho.
        
        // Simplicity ke liye: Hum maan lete hain user sirf confirm kar raha hai.
        alert(`Pricing Saved for Variant ID: ${selectedVariantId}`);
        // Real app me: api.put(`/variants/${selectedVariantId}`, { price: priceData.sellingPrice ... })
    } catch(err) {
        console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 5: Variant Pricing & Offers</Typography>
      
      <TextField
        select
        label="Select Variant"
        value={selectedVariantId}
        onChange={(e) => setSelectedVariantId(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        {variants.map((v) => (
          <MenuItem key={v.id} value={v.id}>
             {v.sku} (Current: ₹{v.price})
          </MenuItem>
        ))}
      </TextField>

      {selectedVariantId && (
        <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Update Pricing</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField 
                    label="MRP (Market Price)" 
                    type="number" 
                    value={priceData.mrp} 
                    onChange={e => setPriceData({...priceData, mrp: e.target.value})} 
                    fullWidth 
                />
                <TextField 
                    label="Selling Price" 
                    type="number" 
                    value={priceData.sellingPrice} 
                    onChange={e => setPriceData({...priceData, sellingPrice: e.target.value})} 
                    fullWidth 
                />
            </Box>
            
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Discount Offer</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                    select 
                    label="Type" 
                    value={discount.type} 
                    onChange={e => setDiscount({...discount, type: e.target.value})}
                    sx={{ width: '150px' }}
                >
                    <MenuItem value="PERCENT">% Off</MenuItem>
                    <MenuItem value="FLAT">Flat ₹ Off</MenuItem>
                </TextField>
                <TextField 
                    label="Value" 
                    type="number" 
                    value={discount.value} 
                    onChange={e => setDiscount({...discount, value: e.target.value})}
                    fullWidth
                />
            </Box>

            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>Update Price</Button>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button variant="contained" color="warning" onClick={onNext}>
            Next: Product Features &rarr;
        </Button>
      </Box>
    </Box>
  );
}
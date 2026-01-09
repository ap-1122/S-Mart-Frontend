import { useEffect, useState } from "react";
import { 
  Box, Typography, TextField, Button, Table, 
  TableHead, TableRow, TableCell, TableBody, Paper, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";
import { useProduct } from "../../../services/ProductContext";

export default function VariantStep({ onNext }) {
  const { productState, setProductState } = useProduct();
  const productId = productState.productId;

  // 1. Data States
  const [linkedAttributes, setLinkedAttributes] = useState([]); // Step 3 se select kiye hue
  const [variants, setVariants] = useState([]); // Jo ban chuke hain
  
  // 2. Form States
  const [form, setForm] = useState({ sku: "", price: "", stock: "" });
  const [attributeValues, setAttributeValues] = useState({}); // Dynamic Values {Color: "Red", Size: "XL"}

  // --- Load Linked Attributes ---
  useEffect(() => {
    // Backend se pucho: "Is product ke pass kaunse attributes hain?"
    // (Note: Hame backend me ek endpoint chahiye jo linked attributes de, 
    // agar wo nahi hai to hum temporarily sare attributes mangwa kar filter kar sakte hain 
    // ya Step 3 se context me pass kar sakte hain. 
    // BEHTAR: Humne Step 3 me save kiya tha, to ab hum seedha variants bana sakte hain)
    
    // Quick Fix: Hum Step 3 me select kiye hue attributes ko Context me rakh sakte the,
    // Lekin abhi ke liye hum maante hain ki user ko pata hai kya bharna hai, 
    // ya hum ek naya GET endpoint call karenge jo humne banaya tha.
    
    // Backend Call to get Attribute structure for inputs
    // (Abhi ke liye hardcoded logic ya API call needed. 
    // Assuming backend endpoint: GET /api/products/{id}/attributes)
    
    const fetchAttrs = async () => {
        try {
            // Ye endpoint hame banana padega agar nahi hai.
            // Temporary Workaround: Hum Context use nahi kar rahe backend validation ke liye.
            // Chalo hum 'Step 3' wala logic use karte hain.
            // Real Project me: api.get(`/products/${productId}/attributes`)
            
            // Abhi ke liye hum manate hain ki attributes Step 3 se aaye hain. 
            // Mai yahan 'All Attributes' load kar raha hu, User wo fill karega jo relevant hai.
             const res = await api.get("/attributes"); 
             setLinkedAttributes(res.data); 
        } catch(err) { console.error(err); }
    };
    fetchAttrs();
  }, [productId]);

  // --- Handle Inputs ---
  const handleStaticChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (attrId, value) => {
    setAttributeValues({ ...attributeValues, [attrId]: value });
  };

  // --- Submit Variant ---
  const createVariant = async () => {
    if(!form.sku || !form.price || !form.stock) {
        alert("Please fill SKU, Price and Stock");
        return;
    }

    // Payload ready karo
    const payload = {
        sku: form.sku,
        price: Number(form.price),
        stock: Number(form.stock),
        attributes: attributeValues // { 1: "Red", 2: "XL" }
    };

    try {
        const res = await api.post(`/variants/${productId}`, payload);
        
        // UI Update
        setVariants([...variants, res.data]);
        setForm({ sku: "", price: "", stock: "" });
        setAttributeValues({}); // Reset dynamic inputs
        
        // Context Update (Taaki aage images upload kar sakein)
        setProductState(prev => ({
            ...prev,
            variants: [...(prev.variants || []), res.data]
        }));
        
    } catch (err) {
        console.error("Variant Error", err);
        alert("Failed to create variant. Check Console.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 4: Create Variants</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Define values for your attributes (e.g. Red, Blue, XL)
      </Typography>

      <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8fafc' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Variant</Typography>
        
        {/* 1. Static Fields */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField label="SKU (Unique ID)" name="sku" value={form.sku} onChange={handleStaticChange} fullWidth />
            <TextField label="Price (₹)" name="price" type="number" value={form.price} onChange={handleStaticChange} fullWidth />
            <TextField label="Stock Qty" name="stock" type="number" value={form.stock} onChange={handleStaticChange} fullWidth />
        </Box>

        {/* 2. Dynamic Attribute Fields */}
        {linkedAttributes.length > 0 && (
             <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Attribute Values:</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {linkedAttributes.map(attr => (
                        <TextField 
                            key={attr.id}
                            label={attr.name} // e.g. "Color"
                            placeholder={`Enter ${attr.name}`} // e.g. "Red"
                            value={attributeValues[attr.id] || ""}
                            onChange={(e) => handleDynamicChange(attr.id, e.target.value)}
                            sx={{ minWidth: '150px' }}
                        />
                    ))}
                </Box>
             </Box>
        )}

        <Button variant="contained" onClick={createVariant}>+ Add Variant</Button>
      </Paper>

      {/* 3. Table of Created Variants */}
      {variants.length > 0 && (
        <>
            <Table sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <TableHead sx={{ bgcolor: '#eee' }}>
                    <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Attributes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {variants.map((v, index) => (
                        <TableRow key={index}>
                            <TableCell>{v.sku}</TableCell>
                            <TableCell>₹{v.price}</TableCell>
                            <TableCell>{v.stock}</TableCell>
                            <TableCell>
                                {v.attributes && Object.values(v.attributes).join(" / ")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button variant="contained" color="warning" onClick={onNext}>
                    Next: Add Features &rarr;
                </Button>
            </Box>
        </>
      )}
    </Box>
  );
}
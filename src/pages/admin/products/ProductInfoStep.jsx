import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import api from "../../../services/api"; // ✅ Tumhara secured api instance
import { useProduct } from "../../../services/ProductContext";

export default function ProductInfoStep({ onNext }) {
  const { productState, setProductState } = useProduct();
  
  // Local state for form fields
  const [form, setForm] = useState({
    name: productState.name || "", // Agar context me pehle se hai to wo use karo
    slug: productState.slug || "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.slug || !form.description) {
      alert("All fields are required");
      return;
    }

    // Prepare Payload for Backend
    const payload = {
      name: form.name,
      description: form.description,
      // Context se Category aur Brand IDs uthao
      categoryId: productState.categoryId, 
      brandId: productState.brandId
    };

    try {
      // ✅ API call to save Basic Product
      const res = await api.post("/products", payload);
      
      // ✅ Save New ID to Context (Isi ID par aage variants banenge)
      setProductState({
        ...productState,
        productId: res.data.id,
        name: res.data.name,
        slug: form.slug
      });

      alert("Product Created! Now add attributes.");
      onNext(); // Move to Step 3
    } catch (err) {
      console.error("Product create error:", err);
      alert("Failed to create product. Check console.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">
        Step 3: Product Information
      </Typography>

      <TextField
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 3 }}
        placeholder="e.g. iPhone 15 Pro"
      />

      <TextField
        label="Product Slug (URL Friendly)"
        name="slug"
        value={form.slug}
        onChange={handleChange}
        helperText="e.g. iphone-15-pro-max (No spaces)"
        fullWidth
        sx={{ mb: 3 }}
      />

      <TextField
        label="Product Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button variant="contained" size="large" onClick={handleSubmit}>
        Save & Continue to Attributes
      </Button>
    </Box>
  );
}
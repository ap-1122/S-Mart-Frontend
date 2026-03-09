import { useEffect, useState } from "react";
import { 
  Box, Typography, Button, Select, MenuItem, Paper, IconButton, Grid 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// --- DND KIT IMPORTS (Drag & Drop ke liye) ---
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import api from "../../../services/api";
import { useProduct } from "../../../services/ProductContext";

// --- Sub-Component: Draggable Image Card ---
function SortableImage({ image, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ p: 1, mb: 1, display: "flex", alignItems: "center", cursor: 'grab', bgcolor: '#f8fafc' }}
    >
      <img 
        src={image.preview} 
        alt="preview" 
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginRight: 16 }} 
      />
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{image.file.name}</Typography>
        <Typography variant="caption" color="text.secondary">{(image.file.size / 1024).toFixed(1)} KB</Typography>
      </Box>

      {/* Delete Button (Drag listeners ko rokne ke liye onPointerDown stopPropagation karte hain) */}
      <IconButton 
        color="error" 
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onDelete(image.id)}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
}

// --- MAIN COMPONENT ---
export default function VariantImageUploadStep({ onNext }) {
  const { productState } = useProduct();
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [images, setImages] = useState([]); // List of { id, file, preview }
  const [uploading, setUploading] = useState(false);

  // 1. Load Variants (Context se ya API se)
  useEffect(() => {
    // Agar Context me variants hain to wahan se lo, warna API call karo
    if (productState.variants && productState.variants.length > 0) {
        setVariants(productState.variants);
        // Auto-select first variant
        setSelectedVariantId(productState.variants[0].id);
    }
  }, [productState.variants]);

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: URL.createObjectURL(file), // Unique ID for Drag n Drop
        file: file,
        preview: URL.createObjectURL(file)
      }));
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  // 3. Handle Drag End (Reorder Logic)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 4. Upload to Backend
  const handleUpload = async () => {
    if (images.length === 0) {
        alert("Please select images first");
        return;
    }
    if (!selectedVariantId) {
        alert("Please select a variant");
        return;
    }

    setUploading(true);
    try {
        const formData = new FormData();
        // Append all files
        images.forEach((img) => {
            formData.append("file", img.file); // Backend expects 'file' (Singular loop or Multiple logic)
        });

        // NOTE: Hamara current Backend Controller single file leta hai Loop me, 
        // ya agar hum Bulk API banayein.
        // Filhal hum loop chala kar ek-ek karke bhejte hain (Simple logic)
        
        for (const img of images) {
            const singleForm = new FormData();
            singleForm.append("file", img.file);
            
            // API Call: /api/product-images/upload/{productId}?variantId={variantId}
            // (Hame Backend controller me ?variantId add karna padega agar nahi hai)
            await api.post(
                `/product-images/upload/${productState.productId}?variantId=${selectedVariantId}`, 
                singleForm,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
        }

        alert("Images Uploaded Successfully! 🎉");
        setImages([]); // Clear list
        onNext(); // FINISH WIZARD
    } catch (err) {
        console.error("Upload Error", err);
        alert("Failed to upload images. Check console.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 10: Upload Images</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
        Select a variant and upload images. Drag to reorder.
      </Typography>

      {/* Variant Selector */}
      <Select
        value={selectedVariantId}
        onChange={(e) => setSelectedVariantId(e.target.value)}
        fullWidth
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>Select Variant</MenuItem>
        {variants.map((v) => (
            <MenuItem key={v.id} value={v.id}>
                SKU: {v.sku} (Color: {Object.values(v.attributes || {}).join("/")})
            </MenuItem>
        ))}
      </Select>

      {/* Upload Box */}
      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{ height: 100, borderStyle: 'dashed', mb: 3 }}
        startIcon={<CloudUploadIcon />}
      >
        Click to Choose Images
        <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
      </Button>

      {/* Drag & Drop Area */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <Box sx={{ mb: 3 }}>
            {images.map((img) => (
              <SortableImage 
                key={img.id} 
                image={img} 
                onDelete={(id) => setImages(images.filter(i => i.id !== id))} 
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      {/* Final Action */}
      <Box sx={{ textAlign: 'right', mt: 4 }}>
        <Button 
            variant="contained" 
            color="success" 
            size="large" 
            onClick={handleUpload}
            disabled={uploading || images.length === 0}
        >
            {uploading ? "Uploading..." : "Finish & Publish Product 🚀"}
        </Button>
      </Box>
    </Box>
  );
}
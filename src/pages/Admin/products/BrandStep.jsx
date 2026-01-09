import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import api from "../../../services/api";
import { useProduct } from "../../../services/ProductContext";

export default function BrandStep({ onNext }) {
  const { productState, setProductState } = useProduct();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    api.get("/brands").then(res => setBrands(res.data));
  }, []);

  const handleConfirm = () => {
    if (!selectedBrand) { alert("Please select a brand"); return; }
    setProductState({ ...productState, brandId: selectedBrand.id });
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Step 2: Select Brand</Typography>
      <Grid container spacing={2}>
        {brands.map((brand) => (
          <Grid item xs={6} md={3} key={brand.id}>
            <Card onClick={() => setSelectedBrand(brand)} sx={{ cursor: "pointer", border: selectedBrand?.id === brand.id ? "3px solid #f97316" : "1px solid #ddd" }}>
              <CardMedia component="img" height="100" image={brand.logoUrl} alt={brand.name} sx={{ objectFit: "contain", p: 1 }} />
              <CardContent><Typography align="center" variant="body2" fontWeight="bold">{brand.name}</Typography></CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="warning" sx={{ mt: 4 }} onClick={handleConfirm}>Confirm Brand</Button>
    </Box>
  );
}
import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import SidebarSteps from "./SidebarSteps";

// ✅ Clean Imports
import CategoryBrandStep from "../../pages/admin/products/CategoryBrandStep";
import BrandStep from "../../pages/admin/products/BrandStep";
import ProductInfoStep from "../../pages/admin/products/ProductInfoStep";
import AttributeSelectionStep from "../../pages/admin/products/AttributeSelectionStep";
import VariantStep from "../../pages/admin/products/VariantStep";
import VariantPricingStep from "../../pages/admin/products/VariantPricingStep";
import ProductFeatureStep from "../../pages/admin/products/ProductFeatureStep";
import ProductSpecificationStep from "../../pages/admin/products/ProductSpecificationStep";
import ProductManufacturerInfoStep from "../../pages/admin/products/ProductManufacturerInfoStep";

// Next Step Placeholder
import VariantImageUploadStep from "../../pages/admin/products/VariantImageUploadStep";

export default function CreateProductLayout() {
  const [activeStep, setActiveStep] = useState(0);

  // ✅ 1. Role Fetch kiya
  const userRole = localStorage.getItem("role");

  const renderStep = () => {
    switch (activeStep) {
      // --- PHASE 1: SELECTION ---
      case 0: 
        // ✅ 2. Role pass kiya (Category banane ka button chupane ke liye)
        return <CategoryBrandStep onNext={() => setActiveStep(1)} userRole={userRole} />;
      case 1: 
        // ✅ 3. Role pass kiya (Brand banane ka button chupane ke liye)
        return <BrandStep onNext={() => setActiveStep(2)} userRole={userRole} />;

      // --- PHASE 2: BASIC INFO ---
      case 2:
        return <ProductInfoStep onNext={() => setActiveStep(3)} />;
      
      // --- PHASE 3: VARIANTS ---
      case 3:
        return <AttributeSelectionStep onNext={() => setActiveStep(4)} />;
      case 4:
        return <VariantStep onNext={() => setActiveStep(5)} />;
      case 5:
        return <VariantPricingStep onNext={() => setActiveStep(6)} />;

      // --- PHASE 4: DETAILS ---
      case 6:
        return <ProductFeatureStep onNext={() => setActiveStep(7)} />;
      case 7:
        return <ProductSpecificationStep onNext={() => setActiveStep(8)} />;
      case 8:
        return <ProductManufacturerInfoStep onNext={() => setActiveStep(9)} />;

      // --- PHASE 5: IMAGES ---
      case 9:
        return <VariantImageUploadStep onNext={() => alert("All Steps Done! 🎉")} />;
        
      default: 
        return <div>Step Not Found</div>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar fixed rahega */}
      <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} />
      
      {/* Content scrollable rahega */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f1f5f9', p: 3 }}>
        <Paper sx={{ p: 4, borderRadius: '12px', minHeight: '80vh' }}>
          {renderStep()}
        </Paper>
      </Box>
    </Box>
  );
}
















//added roles based special button for admin and seller in user sidebar

// import React, { useState } from "react";
// import { Box, Paper } from "@mui/material";
// import SidebarSteps from "./SidebarSteps";

// // ✅ Clean Imports (Sequence maintained)
// import CategoryBrandStep from "../../pages/admin/products/CategoryBrandStep";
// import BrandStep from "../../pages/admin/products/BrandStep";
// import ProductInfoStep from "../../pages/admin/products/ProductInfoStep";
// import AttributeSelectionStep from "../../pages/admin/products/AttributeSelectionStep";
// import VariantStep from "../../pages/admin/products/VariantStep";
// import VariantPricingStep from "../../pages/admin/products/VariantPricingStep";
// import ProductFeatureStep from "../../pages/admin/products/ProductFeatureStep";
// import ProductSpecificationStep from "../../pages/admin/products/ProductSpecificationStep";
// import ProductManufacturerInfoStep from "../../pages/admin/products/ProductManufacturerInfoStep";

// // Next Step ke liye placeholder import (Part-6 me banayenge)
// import VariantImageUploadStep from "../../pages/admin/products/VariantImageUploadStep";

// export default function CreateProductLayout() {
//   const [activeStep, setActiveStep] = useState(0);

//   const renderStep = () => {
//     switch (activeStep) {
//       // --- PHASE 1: SELECTION ---
//       case 0: 
//         return <CategoryBrandStep onNext={() => setActiveStep(1)} />;
//       case 1: 
//         return <BrandStep onNext={() => setActiveStep(2)} />;

//       // --- PHASE 2: BASIC INFO ---
//       case 2:
//         return <ProductInfoStep onNext={() => setActiveStep(3)} />;
      
//       // --- PHASE 3: VARIANTS ---
//       case 3:
//         return <AttributeSelectionStep onNext={() => setActiveStep(4)} />;
//       case 4:
//         return <VariantStep onNext={() => setActiveStep(5)} />;
//       case 5:
//         return <VariantPricingStep onNext={() => setActiveStep(6)} />;

//       // --- PHASE 4: DETAILS ---
//       case 6:
//         return <ProductFeatureStep onNext={() => setActiveStep(7)} />;
//       case 7:
//         return <ProductSpecificationStep onNext={() => setActiveStep(8)} />;
//       case 8:
//         return <ProductManufacturerInfoStep onNext={() => setActiveStep(9)} />;

//       // --- PHASE 5: IMAGES (Next Part) ---
//       case 9:
//         // Yahan hum Image Upload Step layenge
//         // Filhal VariantImageUploadStep dikha rahe hain
//         return <VariantImageUploadStep onNext={() => alert("All Steps Done! 🎉")} />;
        
//       default: 
//         return <div>Step Not Found</div>;
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: '100vh', overflow: 'hidden' }}>
//       {/* Sidebar fixed rahega */}
//       <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} />
      
//       {/* Content scrollable rahega */}
//       <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f1f5f9', p: 3 }}>
//         <Paper sx={{ p: 4, borderRadius: '12px', minHeight: '80vh' }}>
//           {renderStep()}
//         </Paper>
//       </Box>
//     </Box>
//   );
// }

































//side bar mismatch hone ke karan upper code with correct steps diya hai

// import React, { useState } from "react";
// import { Box, Paper } from "@mui/material";
// import SidebarSteps from "./SidebarSteps";

// // ✅ IMPORT YOUR STEPS HERE
// import CategoryBrandStep from "../../pages/admin/products/CategoryBrandStep";
// import BrandStep from "../../pages/admin/products/BrandStep";

// import ProductInfoStep from "../../pages/admin/products/ProductInfoStep";

// import AttributeSelectionStep from "../../pages/admin/products/AttributeSelectionStep";

// import VariantStep from "../../pages/admin/products/VariantStep";

// import VariantPricingStep from "../../pages/admin/products/VariantPricingStep";
// import ProductFeatureStep from "../../pages/admin/products/ProductFeatureStep";
// import ProductSpecificationStep from "../../pages/admin/products/ProductSpecificationStep";
// import ProductManufacturerInfoStep from "../../pages/admin/products/ProductManufacturerInfoStep";

// export default function CreateProductLayout() {
//   const [activeStep, setActiveStep] = useState(0);

//   const renderStep = () => {
//     switch (activeStep) {
//       case 0: 
//         // Jab Step 0 complete ho, to activeStep 1 kar do
//         return <CategoryBrandStep onNext={() => setActiveStep(1)} />;
      
//       case 1: 
//         // Jab Step 1 complete ho, to activeStep 2 kar do
//         return <BrandStep onNext={() => setActiveStep(2)} />;

//       case 2:
//              return <ProductInfoStep onNext={() => setActiveStep(3)} />;
      
//      case 3:
//    return <AttributeSelectionStep onNext={() => setActiveStep(4)} />;

//    case 4:
//    return <VariantStep onNext={() => setActiveStep(5)} />;

//    case 5:
//    return <VariantPricingStep onNext={() => setActiveStep(6)} />;
// case 6:
//    return <ProductFeatureStep onNext={() => setActiveStep(7)} />;

//    case 7:
//    return <ProductSpecificationStep onNext={() => setActiveStep(8)} />;
// case 8:
//    return <ProductManufacturerInfoStep onNext={() => setActiveStep(9)} />;
//       default: 
//         return <div>Step coming soon...</div>;
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} />
//       <Paper sx={{ flex: 1, p: 4, m: 2, borderRadius: '12px' }}>
//         {renderStep()}
//       </Paper>
//     </Box>
//   );
// }













// import React, { useState } from "react";
// import { Box, Paper } from "@mui/material";
// import SidebarSteps from "./SidebarSteps";

// export default function CreateProductLayout() {
//   const [activeStep, setActiveStep] = useState(0);

//   const renderStep = () => {
//     switch (activeStep) {
//       case 0: return <div>Step 0: Category & Brand Loading...</div>;
//       case 1: return <div>Step 1: Product Info Loading...</div>;
//       default: return <div>Steps are being developed...</div>;
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Left Navigation */}
//       <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} />
      
//       {/* Right Content Area */}
//       <Paper sx={{ flex: 1, p: 4, m: 2, borderRadius: '12px' }}>
//         {renderStep()}
//       </Paper>
//     </Box>
//   );
// }
import React from 'react';
import { List, ListItemButton, ListItemText } from "@mui/material";

// ✅ Updated List: Matches exactly with Layout cases
const steps = [
  "1. Select Category",      // case 0
  "2. Select Brand",         // case 1
  "3. Product Info",         // case 2
  "4. Select Attributes",    // case 3
  "5. Create Variants",      // case 4
  "6. Variant Pricing",      // case 5
  "7. Features (Highlights)",// case 6
  "8. Specifications",       // case 7
  "9. Manufacturer Info",    // case 8
  "10. Upload Images"        // case 9 (Final)
];

export default function SidebarSteps({ activeStep, setActiveStep }) {
  return (
    <List sx={{ width: 280, bgcolor: '#1e293b', color: 'white', height: "100vh", overflowY: 'auto' }}>
      {steps.map((step, index) => (
        <ListItemButton
          key={step}
          selected={activeStep === index}
          onClick={() => setActiveStep(index)}
          sx={{
            "&.Mui-selected": { bgcolor: "#f97316", color: "white" },
            "&:hover": { bgcolor: "#334155" },
            borderBottom: '1px solid #334155'
          }}
        >
          <ListItemText primary={step} primaryTypographyProps={{ fontSize: '14px' }} />
        </ListItemButton>
      ))}
    </List>
  );
}



















//mismatch steps in SidebarSteps.jsx
// import React from 'react';
// import { List, ListItemButton, ListItemText } from "@mui/material";

// const steps = [
//   "Category & Brand",
//   "Product Information",
//   "Attributes Selection",
//   "Create Variants",
//   "Features (Highlights)",
//   "Product Specifications",
//   "Manufacturer Info",
//   "Image Upload"
// ];

// export default function SidebarSteps({ activeStep, setActiveStep }) {
//   return (
//     <List sx={{ width: 280, bgcolor: '#1e293b', color: 'white', height: "100vh" }}>
//       {steps.map((step, index) => (
//         <ListItemButton
//           key={step}
//           selected={activeStep === index}
//           onClick={() => setActiveStep(index)}
//           sx={{
//             "&.Mui-selected": { bgcolor: "#f97316", color: "white" },
//             "&:hover": { bgcolor: "#334155" }
//           }}
//         >
//           <ListItemText primary={`${index + 1}. ${step}`} />
//         </ListItemButton>
//       ))}
//     </List>
//   );
// }
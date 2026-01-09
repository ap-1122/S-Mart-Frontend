import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Agar tumne global css banayi hai to ye line uncomment karo, warna index.css sahi hai
import './styles/global.css'; 

import { ProductProvider } from './services/ProductContext';

ReactDOM.createRoot(document.getElementById('root')).render(


 <ProductProvider>
      <App />
    </ProductProvider>

)
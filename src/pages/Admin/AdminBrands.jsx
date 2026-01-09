import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: '', description: '', logoUrl: '' });

  // ✅ FIX: useCallback se function memoize kiya (Hoisting aur Infinite Loop fix)
  const fetchBrands = useCallback(async () => {
    try {
      const res = await api.get('/brands');
      setBrands(res.data);
    } catch (err) {
      console.error("Error loading brands:", err); 
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      await api.post('/brands', newBrand);
      alert("Brand Added! ✅");
      setNewBrand({ name: '', description: '', logoUrl: '' }); 
      fetchBrands(); 
    } catch (err) {
      console.error("Error adding brand:", err);
      alert("Error adding brand ❌");
    }
  };

  return (
    <div className="card">
      <h2>🏷️ Manage Brands</h2>
      <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Brand</h3>
        <input 
          type="text" placeholder="Brand Name" 
          value={newBrand.name} onChange={(e) => setNewBrand({...newBrand, name: e.target.value})} 
        />
        <input 
          type="text" placeholder="Description" 
          value={newBrand.description} onChange={(e) => setNewBrand({...newBrand, description: e.target.value})} 
        />
         <input 
          type="text" placeholder="Logo URL (Optional)" 
          value={newBrand.logoUrl} onChange={(e) => setNewBrand({...newBrand, logoUrl: e.target.value})} 
        />
        <button className="btn btn-primary" onClick={handleAddBrand} style={{ marginTop: '10px' }}>
          + Create Brand
        </button>
      </div>
      <h3>Existing Brands</h3>
      <ul>
        {brands.map(b => (
          <li key={b.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{b.name}</strong> - <span style={{color:'gray'}}>{b.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBrands;
























//  import React, { useEffect, useState } from 'react';
// import api from '../../services/api';

// const AdminBrands = () => {
//   const [brands, setBrands] = useState([]);
//   const [newBrand, setNewBrand] = useState({ name: '', description: '', logoUrl: '' });

//   // ✅ STEP 1: Function ko PEHLE define karo (useEffect se upar)
//   const fetchBrands = async () => {
//     try {
//       const res = await api.get('/brands');
//       setBrands(res.data);
//     } catch (err) {
//       // ✅ Error fix: 'err' variable ko use kiya
//       console.error("Error loading brands:", err); 
//     }
//   };

//   // ✅ STEP 2: Ab useEffect call karo (Kyunki function ban chuka hai)
//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   // 3. Brand Create Logic
//   const handleAddBrand = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/brands', newBrand);
//       alert("Brand Added! ✅");
//       setNewBrand({ name: '', description: '', logoUrl: '' }); 
//       fetchBrands(); 
//     } catch (err) {
//       console.error("Error adding brand:", err);
//       alert("Error adding brand ❌");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>🏷️ Manage Brands</h2>
      
//       {/* Form Area */}
//       <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
//         <h3>Add New Brand</h3>
//         <input 
//           type="text" placeholder="Brand Name" 
//           value={newBrand.name} onChange={(e) => setNewBrand({...newBrand, name: e.target.value})} 
//         />
//         <input 
//           type="text" placeholder="Description" 
//           value={newBrand.description} onChange={(e) => setNewBrand({...newBrand, description: e.target.value})} 
//         />
//          <input 
//           type="text" placeholder="Logo URL (Optional)" 
//           value={newBrand.logoUrl} onChange={(e) => setNewBrand({...newBrand, logoUrl: e.target.value})} 
//         />
//         <button className="btn btn-primary" onClick={handleAddBrand} style={{ marginTop: '10px' }}>
//           + Create Brand
//         </button>
//       </div>

//       {/* List Area */}
//       <h3>Existing Brands</h3>
//       <ul>
//         {brands.map(b => (
//           <li key={b.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
//             <strong>{b.name}</strong> - <span style={{color:'gray'}}>{b.description}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminBrands;
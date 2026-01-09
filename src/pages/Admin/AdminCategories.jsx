import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  // ✅ FIX: Function definition with useCallback
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories/root');
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async () => {
    try {
      await api.post('/categories', newCat);
      alert("Category Added! ✅");
      setNewCat({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Error adding category");
    }
  };

  return (
    <div className="card">
      <h2>🗂️ Manage Categories</h2>
      <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
        <h3>Add Root Category</h3>
        <input 
          type="text" placeholder="Category Name (e.g. Electronics)" 
          value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} 
        />
        <input 
          type="text" placeholder="Description" 
          value={newCat.description} onChange={(e) => setNewCat({...newCat, description: e.target.value})} 
        />
        <button className="btn btn-primary" onClick={handleAdd} style={{ marginTop: '10px' }}>
          + Add Category
        </button>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <div key={c.id} style={{ padding: '10px 20px', background: '#e2e8f0', borderRadius: '20px', color: '#333' }}>
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;










//  import React, { useEffect, useState } from 'react';
// import api from '../../services/api';

// const AdminCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCat, setNewCat] = useState({ name: '', description: '' });

//   // ✅ STEP 1: Function ko PEHLE define karo
//   const fetchCategories = async () => {
//     try {
//       const res = await api.get('/categories/root');
//       setCategories(res.data);
//     } catch (err) {
//       // ✅ Error fix: 'err' variable ko use kiya
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // ✅ STEP 2: Ab useEffect call karo
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleAdd = async () => {
//     try {
//       await api.post('/categories', newCat);
//       alert("Category Added! ✅");
//       setNewCat({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error("Error adding category:", err);
//       alert("Error adding category");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>🗂️ Manage Categories</h2>
      
//       {/* Form Area */}
//       <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
//         <h3>Add Root Category</h3>
//         <input 
//           type="text" placeholder="Category Name (e.g. Electronics)" 
//           value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} 
//         />
//         <input 
//           type="text" placeholder="Description" 
//           value={newCat.description} onChange={(e) => setNewCat({...newCat, description: e.target.value})} 
//         />
//         <button className="btn btn-primary" onClick={handleAdd} style={{ marginTop: '10px' }}>
//           + Add Category
//         </button>
//       </div>

//       {/* List Area */}
//       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//         {categories.map(c => (
//           <div key={c.id} style={{ padding: '10px 20px', background: '#e2e8f0', borderRadius: '20px' }}>
//             {c.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminCategories;
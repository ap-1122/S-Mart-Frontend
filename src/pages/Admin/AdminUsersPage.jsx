import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Select, MenuItem, FormControl, CircularProgress, Chip 
} from "@mui/material";
import axios from "axios";
import { FaCrown } from "react-icons/fa"; // ✅ Crown Icon Import kiya

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Backend se saare users + unka premium status aayega
      const res = await axios.get("http://localhost:8080/api/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const confirm = window.confirm(`Are you sure you want to make this user ${newRole}?`);
    if(!confirm) return;

    try {
      await axios.put(
        `http://localhost:8080/api/users/${userId}/role?role=${newRole}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update UI locally
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert("Role Updated Successfully!");

    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update role.");
    }
  };

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1e293b">
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              {/* ✅ NEW COLUMN */}
              <TableCell><b>Membership</b></TableCell> 
              <TableCell><b>Current Role</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>#{user.id}</TableCell>
                <TableCell style={{fontWeight:'500'}}>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                
                {/* ✅ MEMBERSHIP STATUS BADGE */}
                <TableCell>
                    {user.isPremium ? (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                            color: '#ea580c', padding: '5px 12px', borderRadius: '20px',
                            fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #fed7aa'
                        }}>
                            <FaCrown style={{ color: '#f59e0b', fontSize: '1rem' }} /> Prime
                        </div>
                    ) : (
                        <span style={{ 
                            color: '#64748b', background: '#f1f5f9', 
                            padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem' 
                        }}>
                            Regular
                        </span>
                    )}
                </TableCell>

                {/* Role Badge */}
                <TableCell>
                  <span style={{
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'SELLER' ? '#fff7ed' : '#e0f2fe',
                      color: user.role === 'ADMIN' ? '#dc2626' : user.role === 'SELLER' ? '#c2410c' : '#0284c7'
                  }}>
                    {user.role}
                  </span>
                </TableCell>

                {/* Role Dropdown */}
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      sx={{ fontSize: '0.85rem', height: '35px', bgcolor: 'white' }}
                    >
                      <MenuItem value="USER">USER</MenuItem>
                      <MenuItem value="SELLER">SELLER</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

















//in upper code :add membership icon in user who is a prime member 

// import React, { useEffect, useState } from "react";
// import { 
//   Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Select, MenuItem, FormControl, CircularProgress 
// } from "@mui/material";
// import axios from "axios";

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/users/all", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       alert("Failed to load users.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     const confirm = window.confirm(`Are you sure you want to make this user ${newRole}?`);
//     if(!confirm) return;

//     try {
//       await axios.put(
//         `http://localhost:8080/api/users/${userId}/role?role=${newRole}`, 
//         {}, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Update UI locally
//       setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
//       alert("Role Updated Successfully!");

//     } catch (err) {
//       console.error("Update Error:", err);
//       alert("Failed to update role.");
//     }
//   };

//   if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom fontWeight="bold" color="#1e293b">
//         User Management
//       </Typography>

//       <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
//         <Table>
//           <TableHead sx={{ bgcolor: "#f1f5f9" }}>
//             <TableRow>
//               <TableCell><b>ID</b></TableCell>
//               <TableCell><b>Name</b></TableCell>
//               <TableCell><b>Email</b></TableCell>
//               <TableCell><b>Current Role</b></TableCell>
//               <TableCell><b>Action</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user.id} hover>
//                 <TableCell>#{user.id}</TableCell>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.email}</TableCell>
                
//                 {/* Role Badge */}
//                 <TableCell>
//                   <span style={{
//                       padding: '5px 10px', 
//                       borderRadius: '15px', 
//                       fontWeight: 'bold',
//                       fontSize: '0.8rem',
//                       backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'SELLER' ? '#fff7ed' : '#e0f2fe',
//                       color: user.role === 'ADMIN' ? '#dc2626' : user.role === 'SELLER' ? '#c2410c' : '#0284c7'
//                   }}>
//                     {user.role}
//                   </span>
//                 </TableCell>

//                 {/* Role Dropdown */}
//                 <TableCell>
//                   <FormControl size="small">
//                     <Select
//                       value={user.role}
//                       onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                       sx={{ fontSize: '0.85rem', height: '35px' }}
//                     >
//                       <MenuItem value="USER">USER</MenuItem>
//                       <MenuItem value="SELLER">SELLER</MenuItem>
//                       <MenuItem value="ADMIN">ADMIN</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }
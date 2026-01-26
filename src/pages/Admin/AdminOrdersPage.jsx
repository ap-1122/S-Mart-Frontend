import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, MenuItem, Select, FormControl, CircularProgress 
} from "@mui/material";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Token nikalo authentication ke liye
  const token = localStorage.getItem("token");

  // 1. Fetch All Orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Status Function
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Backend Call: PUT /api/orders/admin/{id}/status?status=XYZ
      await axios.put(
        `http://localhost:8080/api/orders/admin/${orderId}/status?status=${newStatus}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // UI Update (Page refresh ki zaroorat nahi)
      setOrders((prev) => 
        prev.map((order) => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      alert(`Order #${orderId} marked as ${newStatus}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update status");
    }
  };

  // Helper for Status Color
  const getStatusColor = (status) => {
    if (status === "DELIVERED") return "success";
    if (status === "SHIPPED") return "info";
    if (status === "CANCELLED") return "error";
    return "warning"; // Pending
  };

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1e293b">
        Order Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell><b>Order ID</b></TableCell>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Current Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                    {order.user?.email} <br/>
                    <small>{order.user?.username}</small>
                </TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                
                {/* Status Badge */}
                <TableCell>
                  <Chip 
                    label={order.orderStatus} 
                    color={getStatusColor(order.orderStatus)} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>

                {/* Status Change Dropdown */}
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={order.orderStatus === "CANCELLED" || order.orderStatus === "DELIVERED"}
                      sx={{ fontSize: '0.85rem' }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="SHIPPED">Shipped</MenuItem>
                      <MenuItem value="DELIVERED">Delivered</MenuItem>
                      <MenuItem value="CANCELLED" sx={{ color: 'red' }}>Cancel</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
            
            {orders.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} align="center">No Orders Found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
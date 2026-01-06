import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="card">
      <h2>📊 Admin Dashboard</h2>
      <p>Welcome to S-MART Admin Panel.</p>
      <div style={{ padding: '20px', background: '#e0f2fe', borderRadius: '8px', marginTop: '20px' }}>
        <strong>Status:</strong> System is Running Smoothly ✅
      </div>
    </div>
  );
};

export default AdminDashboard;
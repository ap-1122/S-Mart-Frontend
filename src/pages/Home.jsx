// src/pages/Home.jsx
import React from 'react';

const Home = ({ user }) => {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1 style={{fontSize:'3rem', color:'var(--primary)'}}>
                Welcome to <span style={{color:'var(--accent)'}}>S-MART</span>
            </h1>
            <p style={{fontSize:'1.2rem', marginTop:'10px', color:'#666'}}>
                India's smartest shopping destination.
            </p>
            {user && <h3 style={{marginTop:'30px'}}>Happy Shopping, {user}! 🛍️</h3>}
        </div>
    );
};
export default Home;
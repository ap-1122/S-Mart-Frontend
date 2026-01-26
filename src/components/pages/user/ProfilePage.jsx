import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css"; // CSS file niche hai

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: ""
  });

  // 1. Fetch User Data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8080/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        username: response.data.username || "",
        phoneNumber: response.data.phoneNumber || ""
      });
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  // 2. Handle Update
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://localhost:8080/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile Updated Successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  if (!user) return <div className="loading-text">Loading Profile...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user.username?.charAt(0).toUpperCase()}</span>
          </div>
          <h2>{user.username}</h2>
          <span className="profile-role">Customer</span>
        </div>

        {/* Details Section */}
        <div className="profile-details">
          
          {/* Email (Non-Editable) */}
          <div className="detail-row">
            <div className="icon-box"><FaEnvelope /></div>
            <div className="info-box">
              <label>Email Address</label>
              <input type="text" value={user.email} disabled className="input-disabled" />
              <small>Email cannot be changed</small>
            </div>
          </div>

          {/* Username (Editable) */}
          <div className="detail-row">
            <div className="icon-box"><FaUser /></div>
            <div className="info-box">
              <label>Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="input-editable"
                />
              ) : (
                <div className="text-display">{user.username}</div>
              )}
            </div>
          </div>

          {/* Phone (Editable) */}
          <div className="detail-row">
            <div className="icon-box"><FaPhone /></div>
            <div className="info-box">
              <label>Phone Number</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="input-editable"
                  placeholder="Add your phone number"
                />
              ) : (
                <div className="text-display">{user.phoneNumber || "Not Added"}</div>
              )}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleUpdate}>
                <FaSave /> Save Changes
              </button>
              <button className="btn-cancel-edit" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
// src/components/admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import { User, Mail, Phone, Slash, CheckCircle, Eye, X, CreditCard, MapPin, Calendar, Info, AlertTriangle } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for Full Details Modal
  const [selectedUser, setSelectedUser] = useState(null);

  // State for Custom Alert Modal
  const [alertConfig, setAlertConfig] = useState(null); // { title, message, type, onConfirm }

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${base}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) return setFiltered(users);
    const q = query.toLowerCase();
    setFiltered(users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.cnicNumber && u.cnicNumber.includes(q))
    ));
  }, [query, users]);

  // Handle Ban Toggle Click
  const handleBanClick = (user) => {
    setAlertConfig({
      title: user.isBanned ? "Unban User?" : "Ban User?",
      message: `Are you sure you want to ${user.isBanned ? "restore access for" : "restrict access for"} ${user.firstName}?`,
      type: user.isBanned ? "success" : "danger",
      onConfirm: () => toggleBan(user)
    });
  };

  const toggleBan = async (user) => {
    setAlertConfig(null); // Close alert
    try {
      const res = await axios.put(`${base}/api/admin/users/${user._id}/ban`, {}, { 
          headers: { Authorization: `Bearer ${token}` }
      });
      const updatedList = users.map(u => u._id === user._id ? { ...u, isBanned: res.data.isBanned } : u);
      setUsers(updatedList);
      setFiltered(updatedList); 
      
      if(selectedUser && selectedUser._id === user._id) {
          setSelectedUser({ ...selectedUser, isBanned: res.data.isBanned });
      }

    } catch (err) {
      alert('Failed to change user status'); // Fallback for error
    }
  };
  
  const getImgUrl = (path) => path ? `${base}/${path.replace(/\\/g, '/')}` : 'https://placehold.co/400x250?text=No+Image';

  return (
    <div className="manage-users">
      <h2 className="admin-page-title">Manage Users</h2>
      
      <input
        type="search"
        placeholder="Search users by name, email, or CNIC..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="admin-search-input"
      />

      {loading ? <div className="spinner-small">Loading users...</div> : (
        <div className="user-grid">
          {filtered.map(u => (
            <div key={u._id} className={`admin-user-card ${u.isBanned ? 'banned' : ''}`}>
              <div className="card-header-user">
                  <div className={`status-dot ${u.isBanned ? 'red' : 'green'}`}></div>
                  <span className="role-badge">{u.role}</span>
              </div>
              
              <div className="user-avatar-section">
                  <img 
                    src={u.profilePicture ? `${base}/${u.profilePicture.replace(/\\/g, '/')}` : `https://placehold.co/100x100?text=${u.firstName?.charAt(0)}`} 
                    alt={u.username} 
                    className="avatar-lg"
                  />
                  <h3>{u.firstName} {u.lastName}</h3>
                  <p className="username">@{u.username}</p>
              </div>

              <div className="user-details-list">
                  <div className="detail-row">
                      <Mail size={14} /> <span>{u.email}</span>
                  </div>
                  <div className="detail-row">
                      <Phone size={14} /> <span>{u.phoneNumber || 'N/A'}</span>
                  </div>
              </div>

              <div className="card-footer-actions">
                  <button className="btn-admin btn-view" onClick={() => setSelectedUser(u)}>
                      <Eye size={16}/> View Details
                  </button>
                  
                  {u.role !== 'admin' && (
                    <button 
                        className={`btn-admin ${u.isBanned ? 'btn-success' : 'btn-danger'}`} 
                        onClick={() => handleBanClick(u)}
                    >
                        {u.isBanned ? <><CheckCircle size={16}/> Unban</> : <><Slash size={16}/> Ban</>}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CUSTOM ALERT POPUP --- */}
      {alertConfig && (
        <div className="admin-alert-overlay" onClick={() => setAlertConfig(null)}>
          <div className="admin-alert-content" onClick={(e) => e.stopPropagation()}>
            <div className={`alert-icon-wrapper ${alertConfig.type}`}>
               <AlertTriangle size={32} />
            </div>
            <h3 className="admin-alert-title">{alertConfig.title}</h3>
            <p className="admin-alert-message">{alertConfig.message}</p>
            <div className="admin-alert-actions">
               <button className="btn-alert btn-cancel" onClick={() => setAlertConfig(null)}>Cancel</button>
               <button className="btn-alert btn-confirm-danger" onClick={alertConfig.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL DETAILS MODAL --- */}
      {selectedUser && (
          <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
              <div className="admin-modal-content wide" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                      <h3>User Profile</h3>
                      <button className="close-icon" onClick={() => setSelectedUser(null)}><X size={24}/></button>
                  </div>
                  
                  <div className="admin-modal-body-scroll">
                      {/* Top Section */}
                      <div className="modal-profile-header">
                          <img 
                            src={selectedUser.profilePicture ? `${base}/${selectedUser.profilePicture.replace(/\\/g, '/')}` : `https://placehold.co/150x150?text=${selectedUser.firstName?.charAt(0)}`} 
                            alt={selectedUser.username} 
                            className="modal-avatar-xl"
                          />
                          <div className="modal-profile-text">
                              <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
                              <p className="modal-username">@{selectedUser.username}</p>
                              <div className="modal-badges">
                                  <span className={`status-badge ${selectedUser.isBanned ? 'banned' : 'active'}`}>
                                      {selectedUser.isBanned ? 'Banned' : 'Active'}
                                  </span>
                                  <span className="role-badge large">{selectedUser.role}</span>
                                  <span className="gender-badge">{selectedUser.gender}</span>
                              </div>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="modal-info-grid">
                          <div className="info-item">
                              <label><Mail size={14}/> Email Address</label>
                              <p>{selectedUser.email}</p>
                          </div>
                          <div className="info-item">
                              <label><Phone size={14}/> Phone Number</label>
                              <p>{selectedUser.phoneNumber}</p>
                          </div>
                          <div className="info-item">
                              <label><CreditCard size={14}/> CNIC Number</label>
                              <p>{selectedUser.cnicNumber}</p>
                          </div>
                          <div className="info-item">
                              <label><Calendar size={14}/> Date of Birth</label>
                              <p>{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div className="info-item">
                              <label><Calendar size={14}/> Joined On</label>
                              <p>{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                          </div>
                          <div className="info-item">
                              <label><MapPin size={14}/> Location</label>
                              <p>{selectedUser.location || 'Not Provided'}</p>
                          </div>
                      </div>

                      {/* About Me */}
                      {selectedUser.aboutMe && (
                          <div className="modal-section">
                              <h4><Info size={16}/> About Me</h4>
                              <p className="about-text">{selectedUser.aboutMe}</p>
                          </div>
                      )}

                      {/* CNIC Images */}
                      <div className="modal-section">
                          <h4><CreditCard size={16}/> CNIC Verification</h4>
                          <div className="cnic-gallery">
                              <div className="cnic-card">
                                  <span>Front Side</span>
                                  <img 
                                    src={getImgUrl(selectedUser.cnicFrontPicture)} 
                                    alt="CNIC Front" 
                                    onClick={() => window.open(getImgUrl(selectedUser.cnicFrontPicture), '_blank')}
                                  />
                              </div>
                              <div className="cnic-card">
                                  <span>Back Side</span>
                                  <img 
                                    src={getImgUrl(selectedUser.cnicBackPicture)} 
                                    alt="CNIC Back"
                                    onClick={() => window.open(getImgUrl(selectedUser.cnicBackPicture), '_blank')}
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="admin-modal-footer">
                      {selectedUser.role !== 'admin' && (
                          <button 
                            className={`btn-admin full-width ${selectedUser.isBanned ? 'btn-success' : 'btn-danger'}`} 
                            onClick={() => handleBanClick(selectedUser)}
                          >
                             {selectedUser.isBanned ? <><CheckCircle size={18}/> Unban User</> : <><Slash size={18}/> Ban User</>}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ManageUsers;
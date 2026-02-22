// src/components/admin/ManageReports.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import { X, MessageSquare, AlertTriangle, CheckCircle, Ban, User, Calendar } from 'lucide-react';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState(null);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${base}/api/admin/reports`, { headers: { Authorization: `Bearer ${token}` } });
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const previousReports = [...reports];
    setReports(reports.map(r => r._id === id ? { ...r, status } : r));
    
    if (selectedReport && selectedReport._id === id) {
       setSelectedReport(null);
    }

    try {
      await axios.put(`${base}/api/admin/reports/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      alert('Failed to update status');
      setReports(previousReports);
    }
  };

  const viewConversation = async (report) => {
    setSelectedReport(report);
    setChatLoading(true);
    setConversation([]);
    
    if (!report.requestId) {
        setChatLoading(false);
        return;
    }

    try {
      const res = await axios.get(`${base}/api/admin/reports/${report._id}/conversation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversation(res.data.messages || []);
    } catch (err) {
      console.error("Could not load chat", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Trigger Custom Alert
  const handleBanClick = (userId) => {
    setAlertConfig({
        title: "Ban User?",
        message: "Are you sure you want to ban this user? This action will prevent them from logging in.",
        type: "danger",
        onConfirm: () => banUser(userId)
    });
  };

  const banUser = async (userId) => {
    setAlertConfig(null);
    try {
      await axios.put(`${base}/api/admin/users/${userId}/ban`, {}, { headers: { Authorization: `Bearer ${token}` }});
      // Show success alert? Or just update UI
      updateStatus(selectedReport._id, 'resolved'); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-reports">
      <div>
         <h2 className="admin-page-title">Report Center</h2>
      </div>
      
      {loading ? <div className="spinner-small">Loading reports...</div> : (
        <div className="report-grid">
          {reports.length === 0 && <div className="empty-admin-state">🎉 No open reports. The community is safe!</div>}
          
          {reports.map(r => (
            <div key={r._id} className={`report-card ${r.status}`}>
              <div className="report-header">
                  <span className={`status-pill ${r.status}`}>
                      {r.status === 'open' && <AlertTriangle size={12} style={{marginRight:4}}/>} 
                      {r.status}
                  </span>
                  <span className="report-date"><Calendar size={12} /> {new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="report-content">
                  <div className="report-row">
                    <span className="label">Accused:</span>
                    <span className="highlight-danger">{r.reportedUser?.username || 'Unknown'}</span>
                  </div>
                  <div className="report-row">
                    <span className="label">Reason:</span>
                    <p className="report-reason-text">"{r.description}"</p>
                  </div>
                  <div className="report-row small">
                      <span className="label">Reporter:</span> {r.reporter?.username}
                  </div>
              </div>

              <div className="report-actions-footer">
                <button className="btn-admin btn-view" onClick={() => viewConversation(r)}>
                    <MessageSquare size={16} /> Review Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CASE REVIEW MODAL --- */}
      {selectedReport && (
        <div className="admin-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="admin-modal-content wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
                <h3>Case Review <span className="case-id">#{selectedReport._id.slice(-6)}</span></h3>
                <button className="close-icon" onClick={() => setSelectedReport(null)}><X size={24}/></button>
            </div>
            
            <div className="case-layout">
                <div className="case-sidebar">
                    <div className="info-block">
                        <label>Reported User (Accused)</label>
                        <div className="user-pill red">
                            <User size={16}/> {selectedReport.reportedUser?.username || 'Unknown'}
                        </div>
                    </div>
                    <div className="info-block">
                        <label>Reporter</label>
                        <div className="user-pill blue">
                            <User size={16}/> {selectedReport.reporter?.username || 'Unknown'}
                        </div>
                    </div>
                    <div className="info-block">
                        <label>Violation Type</label>
                        <p className="violation-text">{selectedReport.description}</p>
                    </div>
                    
                    <div className="verdict-actions">
                        <label>Admin Verdict</label>
                        <button className="btn-admin btn-danger full-width" onClick={() => handleBanClick(selectedReport.reportedUser?._id)}>
                            <Ban size={16}/> Ban User & Resolve
                        </button>
                        <button className="btn-admin btn-secondary full-width" onClick={() => updateStatus(selectedReport._id, 'dismissed')}>
                            <CheckCircle size={16}/> Dismiss (No Violation)
                        </button>
                        <button className="btn-admin btn-secondary full-width" onClick={() => updateStatus(selectedReport._id, 'resolved')}>
                            <CheckCircle size={16}/> Mark Resolved (No Ban)
                        </button>
                    </div>
                </div>

                <div className="chat-evidence-container">
                    <h4><MessageSquare size={18}/> Conversation Log</h4>
                    {chatLoading ? <div className="spinner-small">Loading history...</div> : (
                        <div className="chat-history-log">
                            {conversation.length === 0 ? (
                                <div className="no-chat-state">
                                    <AlertTriangle size={32} style={{marginBottom:'10px', color:'var(--admin-text-muted)'}}/>
                                    <p>No chat messages found for this request.</p>
                                </div>
                            ) : (
                                conversation.map((msg, idx) => {
                                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                                    const accusedId = selectedReport.reportedUser?._id;
                                    const isAccused = senderId && accusedId && senderId.toString() === accusedId.toString();
                                    const senderName = typeof msg.sender === 'object' ? msg.sender.username : 'Unknown';

                                    return (
                                        <div key={idx} className={`log-message ${isAccused ? 'accused' : 'reporter'}`}>
                                            <div className="log-meta">
                                                <strong>{senderName}</strong>
                                                <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="log-text">{msg.text}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>
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
    </div>
  );
};

export default ManageReports;
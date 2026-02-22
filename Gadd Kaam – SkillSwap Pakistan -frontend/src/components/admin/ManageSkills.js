// src/components/admin/ManageSkills.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin.css";
import { MapPin, Trash2, AlertTriangle } from 'lucide-react';

function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState(null);

  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/skills`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Trigger Alert
  const handleDeleteClick = (id) => {
    setAlertConfig({
        title: "Delete Skill?",
        message: "Are you sure you want to delete this skill permanently? This action cannot be undone.",
        type: "danger",
        onConfirm: () => deleteSkill(id)
    });
  };

  const deleteSkill = async (id) => {
    setAlertConfig(null);
    try {
      await axios.delete(`${apiUrl}/api/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(skills.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getImg = (path) => path ? `${apiUrl}/${path.replace(/\\/g, '/')}` : "https://placehold.co/300x200?text=No+Image";

  return (
    <div className="manage-skills">
      <h2 className="admin-page-title">Manage Skills</h2>
      
      {loading ? <div className="spinner-small">Loading...</div> : (
        <div className="skills-grid-admin">
          {skills.map((skill) => (
            <div key={skill._id} className="skill-admin-card">
              <div className="card-img-top">
                  <img src={getImg(skill.photo)} alt="skill" />
                  <span className={`source-tag ${skill.source === 'Women Zone' ? 'pink' : 'blue'}`}>
                      {/* {skill.source === 'Women Zone' ? 'Women Only' : 'Marketplace'} */}
                  </span>
              </div>
              
              <div className="card-body">
                  <h4>{skill.skills?.join(', ')}</h4>
                  <p className="desc-truncate">{skill.description}</p>
                  
                  <div className="meta-info">
                      <div className="meta-row">
                          <MapPin size={14} /> <span>{skill.remotely ? "Remote" : skill.location}</span>
                      </div>
                      <div className="meta-row">
                          <strong>By:</strong> {skill.user?.username || 'Unknown'}
                      </div>
                  </div>
              </div>

              <div className="card-footer">
                  <button className="btn-icon-danger" onClick={() => handleDeleteClick(skill._id)} title="Delete Skill">
                      <Trash2 size={18} />
                  </button>
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
               <button className="btn-alert btn-confirm-danger" onClick={alertConfig.onConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSkills;
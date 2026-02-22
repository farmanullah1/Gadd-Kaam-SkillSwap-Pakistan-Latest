// src/components/MySkillPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; 
import '../styles/marketplace.css'; // Reusing the main card styles
import '../styles/my-skills.css';   // Specific overrides if needed
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';

import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, 
  MapPin, Globe, EyeOff, Tag, Lightbulb, Phone
} from 'lucide-react';

// Shared SkillCard component (Matches Marketplace)
const SkillCard = ({ skill, onViewDetails, onDeleteOffer }) => {
  const { t } = useTranslation();
  const placeholderImage = 'https://placehold.co/600x400/e0e0e0/666666?text=Skill+Image';
  
  // Ensure photo URL is correct
  const imageUrl = skill.photo 
    ? `${process.env.REACT_APP_API_URL}${skill.photo.startsWith('/') ? '' : '/'}${skill.photo}` 
    : placeholderImage;

  return (
    <div className="skill-card">
      <div className="skill-card-image-wrapper">
        <img
          src={imageUrl}
          alt={skill.skills.join(', ')}
          className="skill-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
        {skill.remotely && <div className="remote-badge">REMOTE</div>}
      </div>
      <div className="skill-card-content">
        <h3 className="skill-card-title">{skill.skills.join(', ')}</h3>
        
        <p className="skill-card-description">{skill.description}</p>
        
        <div className="skill-card-tags">
          {skill.remotely && <span className="skill-card-tag"><Globe size={12}/> {t('remotely_label')}</span>}
          {skill.anonymous && <span className="skill-card-tag"><EyeOff size={12}/> {t('anonymous_label')}</span>}
          {skill.shareWithWomenZone && <span className="skill-card-tag" style={{background:'#fce7f3', color:'#be185d'}}><Shield size={12}/> Women Zone</span>}
        </div>

        <div className="skill-card-actions">
          <button className="btn-view-details" onClick={() => onViewDetails(skill)}>
            {t('view_full_details_btn')}
          </button>
          <button className="btn-delete-offer" onClick={() => onDeleteOffer(skill._id)} title={t('delete_offer_btn')}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

// FullDetailsModal component (Split View like Marketplace)
const FullDetailsModal = ({ skill, onClose, onDelete }) => {
  const { t } = useTranslation();
  const placeholderImage = 'https://placehold.co/800x480/e0e0e0/666666?text=No+Image';
  const imageUrl = skill.photo 
    ? `${process.env.REACT_APP_API_URL}${skill.photo.startsWith('/') ? '' : '/'}${skill.photo}` 
    : placeholderImage;

  if (!skill) return null;

  return (
    <div className="full-details-modal-overlay">
      <div className="full-details-modal-content">
        <button className="full-details-modal-close-btn" onClick={onClose}><FaTimes size={18}/></button>
        
        <div className="modal-scroll-content">
            {/* LEFT: IMAGE */}
            <div className="modal-left-column">
                <img
                  src={imageUrl}
                  alt={skill.skills.join(', ')}
                  className="modal-hero-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="modal-right-column">
                <h2 className="modal-title">{skill.skills.join(', ')}</h2>
                
                <div className="description-box">
                    <h4><Lightbulb size={18}/> {t('description_label')}</h4>
                    <p>{skill.description}</p>
                </div>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <label><Tag size={14}/> {t('swap_skill_label')}</label>
                    <p>{skill.skillsToSwap?.join(', ') || t('skill_not_specified')}</p>
                  </div>
                  <div className="detail-item">
                    <label><MapPin size={14}/> {t('location_label')}</label>
                    <p>{skill.location || t('not_specified')}</p>
                  </div>
                  <div className="detail-item">
                    <label><Globe size={14}/> {t('remotely_label')}</label>
                    <p>{skill.remotely ? t('yes') : t('no')}</p>
                  </div>
                  <div className="detail-item">
                    <label><EyeOff size={14}/> {t('anonymous_label')}</label>
                    <p>{skill.anonymous ? t('yes') : t('no')}</p>
                  </div>
                  <div className="detail-item">
                     <label><Phone size={14}/> {t('phone_label')}</label>
                     <p>{skill.phoneNumber || t('not_specified')}</p>
                  </div>
                </div>

                <div className="full-details-actions">
                  <button className="btn-delete-offer" onClick={() => onDelete(skill._id)}>
                    <FaTrashAlt style={{ marginRight: '8px' }} /> {t('delete_offer_btn')}
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
function MySkillPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  // Custom Alert State for Delete
  const [alertConfig, setAlertConfig] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchMySkills();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMySkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/my-skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
    } catch (err) {
      console.error('Failed to fetch my skills:', err);
      setError(t('failed_to_load_my_skills_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (skillId) => {
    setAlertConfig({
        title: t("delete_confirm_title"),
        message: t("delete_confirm_message"),
        type: "danger",
        onConfirm: () => confirmDeleteOffer(skillId)
    });
  };

  const confirmDeleteOffer = async (skillId) => {
    setAlertConfig(null);
    if (!skillId) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/skill-offers/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMySkills();
      setSelectedSkill(null);
    } catch (err) {
      console.error('Failed to delete skill offer:', err);
      setError(t('failed_to_delete_skill_offer_error'));
    } finally {
      setLoading(false);
    }
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const currentPath = location.pathname;

  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {t("received_requests_page_title")}
            </Link>
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} /> {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} /> {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="my-skills-page">
            <div className="my-skills-header">
              <h1>{t('my_skills_page_title')}</h1>
              <p>{t('my_skills_page_subtitle')}</p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : skills.length === 0 ? (
              <p className="no-skills-message">{t('no_skills_offered')}</p>
            ) : (
              <div className="skill-card-container">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onViewDetails={setSelectedSkill}
                    onDeleteOffer={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
      {selectedSkill && <FullDetailsModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} onDelete={handleDeleteClick} />}
      
      {/* Alert Modal (Reused from Admin style for consistency if global, else implement locally) */}
      {alertConfig && (
        <div className="admin-alert-overlay" onClick={() => setAlertConfig(null)} style={{zIndex: 9999}}>
          <div className="admin-alert-content" onClick={(e) => e.stopPropagation()}>
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

export default MySkillPage;
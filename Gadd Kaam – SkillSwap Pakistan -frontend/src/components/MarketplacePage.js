// src/components/MarketplacePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; 
import '../styles/marketplace.css';
import '../styles/forms.css'; 
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Tag, X, Lightbulb, MapPin, Send, Globe, Phone, EyeOff, Award, Handshake, Heart
} from 'lucide-react';

const getPlaceholderImage = (width = 800, height = 600) =>
  `https://placehold.co/${width}x${height}/e0e0e0/666666?text=Skill`;

const BadgeIcon = ({ name, size=16 }) => {
    const icons = { 'Handshake': Handshake, 'Star': Star, 'Heart': Heart, 'Award': Award };
    const IconComponent = icons[name] || Award;
    return <IconComponent size={size} />;
};

const SkillCard = ({ skillOffer, onViewDetails, style }) => {
  const { t } = useTranslation();
  const imageUrl = skillOffer.photo ? `${process.env.REACT_APP_API_URL}${skillOffer.photo.replace(/\\/g, '/')}` : getPlaceholderImage();
  const authorName = skillOffer.anonymous ? t('anonymous_label') : (skillOffer.user?.username || t('anonymous_label'));
  const reviewCount = skillOffer.reviewCount || (skillOffer.latestReview ? 1 : 0);

  return (
    <div className="skill-card" style={style}>
      <div className="skill-card-image-wrapper">
        <img
          src={imageUrl}
          alt={skillOffer.skills.join(', ')}
          className="skill-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(); }}
        />
        {skillOffer.remotely && <div className="remote-badge">REMOTE</div>}
      </div>
      <div className="skill-card-content">
        <h3 className="skill-card-title">{skillOffer.skills.join(', ')}</h3>
        <p className="skill-card-author">
          <User size={14} style={{marginRight:'4px'}}/> {authorName}
        </p>
        
        {skillOffer.latestReview && (
            <div className="skill-card-review-section">
                <div className="review-header">
                    <div className="rating-badge">
                        <Star size={14} fill="#e38b40" stroke="#e38b40" />
                        <span>{skillOffer.latestReview.rating}</span>
                    </div>
                    <span className="review-count-badge">({reviewCount})</span>
                </div>
                <p className="review-text">"{skillOffer.latestReview.comment.substring(0, 50)}..."</p>
            </div>
        )}

        <div className="skill-card-tags">
          {skillOffer.remotely && <span className="skill-card-tag"><Globe size={12}/> {t('remotely_label')}</span>}
          {skillOffer.anonymous && <span className="skill-card-tag"><EyeOff size={12}/> {t('anonymous_label')}</span>}
          {skillOffer.shareWithWomenZone && <span className="skill-card-tag" style={{background:'#fce7f3', color:'#be185d'}}><Shield size={12}/> Women Zone</span>}
        </div>
        
        <button className="btn-view-details" onClick={() => onViewDetails(skillOffer)}>
          {t('view_full_details_btn')}
        </button>
      </div>
    </div>
  );
};

// --- UPDATED MODAL: SPLIT VIEW + NESTED REQUEST MODAL ---
const FullDetailsModal = ({ skillOffer, onClose, currentUserId, onSendRequestSuccess }) => {
  const { t } = useTranslation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [skillRequested, setSkillRequested] = useState('');
  const [isRemote, setIsRemote] = useState(true); 
  const [location, setLocation] = useState(''); 
  const [sendingRequest, setSendingRequest] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); 
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const imageUrl = skillOffer.photo ? `${process.env.REACT_APP_API_URL}${skillOffer.photo.replace(/\\/g, '/')}` : getPlaceholderImage(800, 800);
  const authorName = skillOffer.anonymous ? t('anonymous_label') : (skillOffer.user?.username || t('anonymous_label'));
  const isOwnSkill = currentUserId === skillOffer.user?._id;
  const authorBadges = skillOffer.user?.badges || [];

  const handleSendRequest = async () => {
    if (!skillRequested.trim()) {
      setErrorMessage(t('please_specify_skill_error'));
      setShowErrorModal(true); return;
    }
    if (!isRemote && (!location || location.trim() === '')) {
      setErrorMessage(t('location_required_non_remote_error'));
      setShowErrorModal(true); return;
    }
    setSendingRequest(true); 
    try {
      const token = localStorage.getItem('token');
      const payload = {
        receiverId: skillOffer.user._id, 
        skillOfferId: skillOffer._id, 
        skillRequested: skillRequested,
        message: t('initial_request_message', { skill: skillOffer.skills.join(', ') }),
        isRemote: isRemote,
        location: isRemote ? '' : location, 
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(t('request_sent_success_message')); 
      setShowSuccessModal(true);
      setShowRequestForm(false); // Close request modal on success
      onSendRequestSuccess();
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || t('failed_to_send_request_error'));
      setShowErrorModal(true);
    } finally {
      setSendingRequest(false); 
    }
  };

  if (!skillOffer) return null;

  return (
    <div className="full-details-modal-overlay">
      <div className="full-details-modal-content">
        <button className="full-details-modal-close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="modal-scroll-content">
            {/* LEFT COLUMN: IMAGE */}
            <div className="modal-left-column">
                <img src={imageUrl} alt={skillOffer.skills.join(', ')} className="modal-hero-image" 
                     onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(800, 800); }}/>
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="modal-right-column">
                <h2 className="modal-title">{skillOffer.skills.join(', ')}</h2>
                
                <div className="modal-author-row">
                    <span className="modal-author">
                        {t('by_label')} <strong>{authorName}</strong>
                    </span>
                    {authorBadges.length > 0 && (
                        <div className="modal-badges-list">
                            {authorBadges.map((badge, idx) => (
                                <div key={idx} className="mini-badge" title={badge.name}>
                                    <BadgeIcon name={badge.icon} size={14} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="description-box">
                    <h4><Lightbulb size={18}/> {t('description_label')}</h4>
                    <p>{skillOffer.description}</p>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <label><Tag size={14}/> {t('swap_skill_label')}</label>
                        <p>{skillOffer.skillsToSwap?.join(', ') || t('skill_not_specified')}</p>
                    </div>
                    <div className="detail-item">
                        <label><MapPin size={14}/> {t('location_label')}</label>
                        <p>{skillOffer.remotely ? "Remote" : skillOffer.location || t('not_specified')}</p>
                    </div>
                    <div className="detail-item">
                        <label><Globe size={14}/> {t('remotely_label')}</label>
                        <p>{skillOffer.remotely ? t('yes') : t('no')}</p>
                    </div>
                    <div className="detail-item">
                        <label><EyeOff size={14}/> {t('anonymous_label')}</label>
                        <p>{skillOffer.anonymous ? t('yes') : t('no')}</p>
                    </div>
                    {!skillOffer.anonymous && skillOffer.user?.phoneNumber && (
                        <div className="detail-item">
                            <label><Phone size={14}/> {t('phone_label')}</label>
                            <p>{skillOffer.user.phoneNumber}</p>
                        </div>
                    )}
                </div>

                {/* Initial Request Button (Always visible at bottom right) */}
                {isOwnSkill ? (
                    <p style={{textAlign:'center', color:'#888', marginTop:'auto'}}>{t('cannot_request_own_skill')}</p>
                ) : (
                    <button className="initial-request-btn" onClick={() => setShowRequestForm(true)}>
                        <Send size={20}/> {t('request_btn')}
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* --- NEW NESTED REQUEST MODAL --- */}
      {showRequestForm && (
          <div className="request-modal-overlay">
              <div className="request-modal-content">
                  <button className="request-close-btn" onClick={() => setShowRequestForm(false)}><X size={24}/></button>
                  <div className="request-form">
                      <h3>{t('specify_skill_wanted_label')}</h3>
                      <textarea 
                          placeholder={t('request_skill_placeholder')} 
                          value={skillRequested} 
                          onChange={(e) => setSkillRequested(e.target.value)} 
                          autoFocus
                      />
                      
                      <label className="remote-toggle">
                          <div style={{position:'relative', width:'48px', height:'26px'}}>
                              <input type="checkbox" checked={isRemote} onChange={(e) => { setIsRemote(e.target.checked); if (e.target.checked) setLocation(''); }} style={{opacity:0, width:'100%', height:'100%', position:'absolute', zIndex:2, cursor:'pointer'}} />
                              <div className="toggle-slider"></div>
                          </div>
                          <span>{t('work_can_be_remote_label')}</span>
                      </label>

                      {!isRemote && (
                          <div className="location-input-container">
                              <label style={{display:'block', marginBottom:'5px', fontWeight:'600'}}>{t('location_label')}</label>
                              <input type="text" className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('enter_location_placeholder')} />
                          </div>
                      )}
                      
                      <button className="btn-send-request" onClick={handleSendRequest} disabled={sendingRequest}>
                          {sendingRequest ? <LoadingSpinner size={20} color="#fff" /> : <><Send size={20}/> {t('send_request_btn')}</>}
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Success/Error Modals */}
      {showSuccessModal && <SuccessMessageModal isOpen={showSuccessModal} title={t("request_sent_success_title")} message={successMessage} onClose={() => { setShowSuccessModal(false); onClose(); }} type="success" />}
      {showErrorModal && <SuccessMessageModal isOpen={showErrorModal} title={t("error_title")} message={errorMessage} onClose={() => setShowErrorModal(false)} type="error" />}
    </div>
  );
};

function MarketplacePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [allSkills, setAllSkills] = useState([]); 
  const [filteredSkills, setFilteredSkills] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkillOffer, setSelectedSkillOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchAllSkills();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [allSkills, searchTerm, selectedCategories]);

  const fetchAllSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/marketplace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllSkills(response.data);

      const categories = new Set();
      response.data.forEach(offer => {
        offer.skills.forEach(skill => categories.add(skill));
      });
      setAvailableCategories([...categories]);

    } catch (err) {
      console.error('Failed to fetch marketplace skills:', err);
      setError(t('failed_to_load_marketplace_skills_error'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let currentFiltered = allSkills;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(offer =>
        offer.skills.some(s => s.toLowerCase().includes(lower)) ||
        offer.description.toLowerCase().includes(lower) ||
        (offer.user?.username && offer.user.username.toLowerCase().includes(lower))
      );
    }
    if (selectedCategories.length > 0) {
      currentFiltered = currentFiltered.filter(offer =>
        offer.skills.some(s => selectedCategories.includes(s))
      );
    }
    setFilteredSkills(currentFiltered);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
    );
  };

  const clearFilters = () => { setSearchTerm(''); setSelectedCategories([]); };
  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  const handleSendRequestSuccess = () => {
    setSelectedSkillOffer(null);
    fetchAllSkills();
  };

  if (!user) return null;
  const currentPath = location.pathname;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}><Home size={20}/> {t('navbar_dashboard')}</Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}><User size={20}/> {t('navbar_my_profile')}</Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}><Settings size={20}/> {t('navbar_my_skills')}</Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}><ShoppingCart size={20}/> {t('navbar_marketplace')}</Link>
            {user.gender === 'Female' && <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}><Shield size={20}/> {t('navbar_women_zone')}</Link>}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}><Mail size={20}/> {t('received_requests_page_title')}</Link>
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}><MessageSquare size={20}/> {t('navbar_messages')}</Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}><Star size={20}/> {t('navbar_reviews')}</Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="marketplace-page">
            <div className="marketplace-header">
              <h1>{t('marketplace_page_title')}</h1>
              <p>{t('marketplace_page_subtitle')}</p>
            </div>

            <div className="marketplace-filters-search">
              <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('search_skills_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-filters">
                <Tag size={20} className="filter-icon" />
                {availableCategories.length > 0 ? (
                  availableCategories.map(category => (
                    <button
                      key={category}
                      className={`filter-tag ${selectedCategories.includes(category) ? 'active' : ''}`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                      {selectedCategories.includes(category) && <X size={14} className="clear-filter-icon" />}
                    </button>
                  ))
                ) : <p>{t('no_categories_available')}</p>}
                {(searchTerm || selectedCategories.length > 0) && <button className="clear-filters-btn" onClick={clearFilters}>{t('clear_all_filters')}</button>}
              </div>
            </div>

            {loading ? <LoadingSpinner /> : error ? <p className="error-message">{error}</p> : filteredSkills.length === 0 ? (
              <p className="no-skills-message">{allSkills.length === 0 ? t('no_skills_available_from_others') : t('no_skills_match_filters')}</p>
            ) : (
              <div className="skill-card-container">
                {filteredSkills.map((offer, index) => (
                  <SkillCard
                    key={offer._id}
                    skillOffer={offer}
                    onViewDetails={setSelectedSkillOffer}
                    style={{ animationDelay: `${index * 0.1}s` }} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
      {selectedSkillOffer && (
        <FullDetailsModal
          skillOffer={selectedSkillOffer}
          onClose={() => setSelectedSkillOffer(null)}
          currentUserId={user?.id}
          onSendRequestSuccess={handleSendRequestSuccess}
        />
      )}
    </div>
  );
}

export default MarketplacePage;
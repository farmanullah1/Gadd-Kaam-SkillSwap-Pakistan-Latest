// src/components/OfferSkillPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import SuccessMessageModal from './SuccessMessageModal';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../styles/offer-skill.css';
import '../styles/marketplace.css'; // Reusing marketplace card styles

import { 
  Upload, MapPin, Globe, EyeOff, Shield, Type, FileText, Tag, Send, X, Image as ImageIcon, Star, User
} from 'lucide-react';

function OfferSkillPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [skillsToSwap, setSkillsToSwap] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isWomenZone, setIsWomenZone] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Modals
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Constants
  const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB in bytes

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.location) setLocationValue(parsedUser.location);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // 1. Validate File Size (6 MB Limit)
      if (file.size > MAX_FILE_SIZE) {
        setError(t('error_file_too_large') || 'File size exceeds 6 MB. Please upload a smaller image.');
        return;
      }

      // 2. Validate File Type (PNG, JPEG, JPG)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError(t('error_invalid_file_type') || 'Invalid file type. Please upload a PNG, JPEG, or JPG image.');
        return;
      }

      // If valid
      setError('');
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim() || !description.trim() || (!isRemote && !locationValue.trim())) {
        setError(t('fill_all_required_fields'));
        setLoading(false);
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Convert comma-separated string to JSON array string
      const skillsArray = title.split(',').map(s => s.trim()).filter(s => s !== '');
      const swapArray = skillsToSwap.split(',').map(s => s.trim()).filter(s => s !== '');

      formData.append('skills', JSON.stringify(skillsArray));
      formData.append('description', description);
      formData.append('location', locationValue);
      formData.append('remotely', isRemote);
      formData.append('anonymous', isAnonymous);
      formData.append('shareWithWomenZone', isWomenZone);
      formData.append('skillsToSwap', JSON.stringify(swapArray));
      
      if (photo) {
        formData.append('photo', photo);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/skill-offers`, formData, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccessModal(true);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || t('offer_publish_error_message'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/marketplace');
  };

  const getPreviewImage = () => previewUrl || "https://placehold.co/400x250/e0e0e0/666666?text=No+Image";

  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={() => { localStorage.clear(); navigate('/login'); }} user={user} />

      <main className="offer-skill-main">
        <div className="offer-skill-header">
            <h1>{t('offer_a_skill_title')}</h1>
            <p>{t('offer_a_skill_subtitle')}</p>
        </div>

        <div className="offer-skill-layout">
            
            {/* LEFT: FORM */}
            <div className="offer-form-container">
                <form onSubmit={handleSubmit} className="offer-form">
                    
                    {error && <div className="error-banner">{error}</div>}

                    {/* Photo Upload */}
                    <div className="form-section upload-section">
                        <label className="section-label"><ImageIcon size={18}/> {t('cover_photo_label')}</label>
                        <div className={`image-upload-area ${previewUrl ? 'has-image' : ''}`}>
                            {previewUrl ? (
                                <div className="preview-container">
                                    <img src={previewUrl} alt="Preview" />
                                    <button type="button" className="remove-btn" onClick={removePhoto}><X size={16}/></button>
                                </div>
                            ) : (
                                <label htmlFor="skill-photo" className="upload-placeholder">
                                    <Upload size={32} />
                                    <span>{t('click_to_upload')} (Max 6MB)</span>
                                    <input 
                                        id="skill-photo" 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg" 
                                        onChange={handlePhotoChange} 
                                        hidden 
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="form-section">
                        <label className="input-label" htmlFor="title"><Type size={16}/> {t('skill_title_label')}</label>
                        <input 
                            type="text" 
                            id="title" 
                            className="input-field" 
                            placeholder={t('skill_title_placeholder')} 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label className="input-label" htmlFor="desc"><FileText size={16}/> {t('description_label')}</label>
                        <textarea 
                            id="desc" 
                            className="textarea-field" 
                            rows="5" 
                            placeholder={t('description_placeholder')} 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-section">
                        <label className="input-label" htmlFor="swap"><Tag size={16}/> {t('skills_wanted_label')}</label>
                        <input 
                            type="text" 
                            id="swap" 
                            className="input-field" 
                            placeholder={t('skills_wanted_placeholder')} 
                            value={skillsToSwap}
                            onChange={(e) => setSkillsToSwap(e.target.value)}
                        />
                    </div>

                    <div className="form-section">
                        <label className="input-label" htmlFor="location"><MapPin size={16}/> {t('location_label')}</label>
                        <input 
                            type="text" 
                            id="location" 
                            className="input-field" 
                            placeholder={t('location_placeholder')} 
                            value={locationValue}
                            onChange={(e) => setLocationValue(e.target.value)}
                            disabled={isRemote}
                            required={!isRemote}
                        />
                    </div>

                    {/* Toggles */}
                    <div className="toggles-group">
                        <label className="custom-toggle">
                            <div className="toggle-text">
                                <Globe size={18} className="icon-blue"/>
                                <div>
                                    <span>{t('remote_work_label')}</span>
                                    <small>{t('remote_work_desc')}</small>
                                </div>
                            </div>
                            <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} />
                            <div className="slider"></div>
                        </label>

                        <label className="custom-toggle">
                            <div className="toggle-text">
                                <EyeOff size={18} className="icon-grey"/>
                                <div>
                                    <span>{t('post_anonymously_label')}</span>
                                    <small>{t('post_anonymously_desc')}</small>
                                </div>
                            </div>
                            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                            <div className="slider"></div>
                        </label>

                        {user.gender === 'Female' && (
                            <label className="custom-toggle">
                                <div className="toggle-text">
                                    <Shield size={18} className="icon-pink"/>
                                    <div>
                                        <span>{t('women_only_zone_label')}</span>
                                        <small>{t('women_only_zone_desc')}</small>
                                    </div>
                                </div>
                                <input type="checkbox" checked={isWomenZone} onChange={(e) => setIsWomenZone(e.target.checked)} />
                                <div className="slider"></div>
                            </label>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary-orange submit-offer-btn" disabled={loading}>
                        {loading ? <LoadingSpinner size={20} color="#fff"/> : <><Send size={18}/> {t('post_skill_offer_btn')}</>}
                    </button>

                </form>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="offer-preview-container">
                <h3>{t('live_preview_title')}</h3>
                <p>{t('live_preview_desc')}</p>
                
                <div className="preview-card-wrapper">
                    <div className="skill-card preview-mode">
                        <div className="skill-card-image-wrapper">
                            <img src={getPreviewImage()} alt="Preview" className="skill-card-image" />
                            {isRemote && (
                                <div className="remote-badge">{t('remote_work_label')}</div>
                            )}
                        </div>
                        <div className="skill-card-content">
                            <h3 className="skill-card-title">{title || t('your_skill_title')}</h3>
                            <p className="skill-card-author">
                                <User size={14} style={{display:'inline', marginRight:'4px'}}/> 
                                {isAnonymous ? t('anonymous_user') : user.username}
                            </p>
                            
                            <div className="skill-card-review-section">
                                <div className="review-header">
                                    <div className="rating-badge">
                                        <Star size={16} fill="#e38b40" stroke="#e38b40" />
                                        <span>New</span>
                                    </div>
                                    <span className="review-count-badge">(0 Reviews)</span>
                                </div>
                            </div>

                            <div className="skill-card-tags">
                                {isRemote && <span className="skill-card-tag"><Globe size={12}/> {t('remote_work_label')}</span>}
                                {isAnonymous && <span className="skill-card-tag"><EyeOff size={12}/> {t('post_anonymously_label')}</span>}
                                {isWomenZone && <span className="skill-card-tag" style={{background:'#fce7f3', color:'#be185d'}}><Shield size={12}/> {t('women_only_zone_label')}</span>}
                            </div>

                            <button className="btn-view-details" style={{pointerEvents: 'none', opacity: 0.7}}>
                                {t('view_full_details_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
      
      <SuccessMessageModal
        isOpen={showSuccessModal}
        title={t('skill_posted_success_title')}
        message={t('skill_posted_success_message')}
        onClose={handleSuccessClose}
        type="success"
      />
    </div>
  );
}

export default OfferSkillPage;
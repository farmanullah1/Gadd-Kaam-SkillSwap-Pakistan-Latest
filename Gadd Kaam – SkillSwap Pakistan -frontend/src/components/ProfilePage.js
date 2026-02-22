// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/profile.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';

import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Award, Camera, Save, X, MapPin, Phone, Mail as MailIcon,
  Handshake, Heart // Import specific badge icons
} from 'lucide-react';

// Icon mapping helper
const BadgeIcon = ({ name, size=24, className }) => {
    const icons = {
        'Handshake': Handshake,
        'Star': Star,
        'Heart': Heart,
        'Award': Award
    };
    const IconComponent = icons[name] || Award;
    return <IconComponent size={size} className={className} />;
};

function ProfilePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [allBadges, setAllBadges] = useState([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);

  const [originalState, setOriginalState] = useState({});
  const defaultProfilePicture = 'https://placehold.co/150x150/cccccc/ffffff?text=No+Pic';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      initializeFields(parsedUser);
      fetchData(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const initializeFields = (userData) => {
    setFullName(`${userData.firstName} ${userData.lastName}`);
    setEmail(userData.email);
    setPhoneNumber(userData.phoneNumber || '');
    setLocationValue(userData.location || '');
    setAboutMe(userData.aboutMe || '');
    
    setOriginalState({
        location: userData.location || '',
        aboutMe: userData.aboutMe || '',
        profilePicture: userData.profilePicture
    });
  };

  useEffect(() => {
    if (!user) return;
    const hasChanged = 
        locationValue !== originalState.location || 
        aboutMe !== originalState.aboutMe || 
        profilePicture !== null;
    
    setIsEditing(hasChanged);
  }, [locationValue, aboutMe, profilePicture, originalState, user]);

  const fetchData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL;

      // 1. Fetch User Data (with populated badges)
      const userRes = await axios.get(`${apiUrl}/api/profile/me`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const userBadges = userRes.data.user?.badges || [];
      setEarnedBadgeIds(userBadges.map(b => b._id));

      // 2. Fetch All Possible Badges
      const badgesRes = await axios.get(`${apiUrl}/api/badges`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setAllBadges(badgesRes.data);

    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDiscardChanges = () => {
    setLocationValue(originalState.location);
    setAboutMe(originalState.aboutMe);
    setProfilePicture(null);
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('location', locationValue);
      formData.append('aboutMe', aboutMe);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/update`, 
        formData, 
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      const updatedUser = {
        ...user,
        location: response.data.location,
        aboutMe: response.data.aboutMe,
        profilePicture: response.data.profilePicture || user.profilePicture
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setOriginalState({
          location: updatedUser.location,
          aboutMe: updatedUser.aboutMe,
          profilePicture: updatedUser.profilePicture
      });

      setProfilePicture(null);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(t('server_error_generic'));
    } finally {
      setIsSaving(false);
    }
  };

  const getDisplayImage = () => {
    if (previewImage) return previewImage;
    if (user && user.profilePicture) {
       return `${process.env.REACT_APP_API_URL}/${user.profilePicture.replace(/\\/g, '/')}`;
    }
    return defaultProfilePicture;
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;
  const currentPath = location.pathname;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {t('navbar_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {t('navbar_my_profile')}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {t('navbar_my_skills')}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {t('navbar_marketplace')}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {t('navbar_women_zone')}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {t('received_requests_page_title')}
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
          <h1 className="dashboard-welcome-heading">{t('profile_page_title')}</h1>
          <p className="dashboard-sub-heading">{t('profile_update_prompt')}</p>

          <form className="profile-layout" onSubmit={handleSaveChanges}>
            
            {/* Left Column: Avatar & Basic Info */}
            <div className="profile-card identity-card">
              <div className="profile-avatar-wrapper">
                <img src={getDisplayImage()} alt="Profile" className="profile-avatar" />
                <label htmlFor="profile-picture-input" className="camera-btn">
                  <Camera size={18} />
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <h2 className="profile-name">{fullName}</h2>
              <span className="profile-username">@{user.username}</span>
              
              <div className="profile-meta">
                <div className="meta-item">
                    <MailIcon size={16} /> <span>{email}</span>
                </div>
                {phoneNumber && (
                    <div className="meta-item">
                        <Phone size={16} /> <span>{phoneNumber}</span>
                    </div>
                )}
              </div>
            </div>

            {/* Right Column: Editable Details */}
            <div className="profile-card details-card">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="location">
                    <MapPin size={16} style={{display:'inline', marginBottom:'-2px'}}/> {t('location_label')}
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={locationValue}
                    onChange={(e) => setLocationValue(e.target.value)}
                    placeholder="e.g. Lahore, Pakistan"
                    className="input-field"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="aboutMe">
                    <User size={16} style={{display:'inline', marginBottom:'-2px'}}/> {t('about_me_label')}
                  </label>
                  <textarea
                    id="aboutMe"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    rows="5"
                    className="textarea-field"
                    placeholder="Tell us about your skills and interests..."
                  ></textarea>
                </div>
              </div>

              {/* Action Bar */}
              <div className={`action-bar ${isEditing ? 'visible' : ''}`}>
                  <div className="action-bar-content">
                    <span>You have unsaved changes</span>
                    <div className="action-buttons">
                        <button type="button" className="btn btn-ghost" onClick={handleDiscardChanges}>
                            <X size={18} /> {t('discard_changes_btn')}
                        </button>
                        <button type="submit" className="btn btn-primary-orange" disabled={isSaving}>
                            {isSaving ? <LoadingSpinner size={18} color="#fff" /> : <><Save size={18} /> {t('save_changes_btn')}</>}
                        </button>
                    </div>
                  </div>
              </div>
            </div>

            {/* Badges Section */}
            {allBadges.length > 0 && (
                <div className="profile-card badges-card full-width">
                    <div className="card-header">
                        <h3><Award size={20}/> {t('my_badges_title')}</h3>
                    </div>
                    <div className="badges-grid">
                        {allBadges.map(badge => {
                            const isEarned = earnedBadgeIds.includes(badge._id);
                            return (
                                <div key={badge._id} className={`badge-item ${isEarned ? 'earned' : 'locked'}`}>
                                    <div className="badge-icon-wrapper">
                                        <BadgeIcon name={badge.icon} size={28} className="badge-lucide-icon"/>
                                    </div>
                                    <div className="badge-info">
                                        <span className="badge-name">{badge.name}</span>
                                        <p className="badge-desc">{badge.description}</p>
                                    </div>
                                    {!isEarned && <div className="lock-overlay"></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

          </form>
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default ProfilePage;
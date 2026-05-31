// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Award, Camera, Save, X, MapPin, Phone, Mail as MailIcon,
  Handshake, Heart, Lock, Trash2, AlertTriangle, KeyRound, CreditCard, Upload
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Locations Select State
  const [citiesList, setCitiesList] = useState({});
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');

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

  // Security Form States
  const [activeSecuritySection, setActiveSecuritySection] = useState(null);
  const [securityEmail, setSecurityEmail] = useState('');
  const [securityEmailPassword, setSecurityEmailPassword] = useState('');
  const [isEmailUpdating, setIsEmailUpdating] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [securityPhone, setSecurityPhone] = useState('');
  const [isPhoneUpdating, setIsPhoneUpdating] = useState(false);

  const [securityCnic, setSecurityCnic] = useState('');
  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);
  const [isCnicUpdating, setIsCnicUpdating] = useState(false);

  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      const userData = userRes.data.user;
      const userBadges = userData?.badges || [];
      setEarnedBadgeIds(userBadges.map(b => b._id));

      if (userData) {
        setSecurityEmail(userData.email || '');
        setSecurityPhone(userData.phoneNumber || '');
        setSecurityCnic(userData.cnicNumber || '');
        
        if (userData.cnicFrontPicture) {
          setCnicFrontPreview(`${apiUrl}/${userData.cnicFrontPicture.replace(/\\/g, '/')}`);
        }
        if (userData.cnicBackPicture) {
          setCnicBackPreview(`${apiUrl}/${userData.cnicBackPicture.replace(/\\/g, '/')}`);
        }
      }

      // 2. Fetch All Possible Badges
      const badgesRes = await axios.get(`${apiUrl}/api/badges`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setAllBadges(badgesRes.data);

      // 3. Fetch Standardized Locations
      try {
        const locationsRes = await axios.get(`${apiUrl}/api/locations`);
        setCitiesList(locationsRes.data);
        
        // Parse user's current location with this dictionary
        const userLoc = userRes.data.user?.location || '';
        if (userLoc) {
          const parts = userLoc.split(',').map(p => p.trim());
          const city = parts[0];
          const sub = parts[1] || '';
          if (locationsRes.data[city]) {
            setSelectedCity(city);
            if (locationsRes.data[city].includes(sub)) {
              setSelectedSubdistrict(sub);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch locations list:', err);
      }

    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    }
  };

  // Synchronize dropdown selection to locationValue string
  useEffect(() => {
    if (selectedCity) {
      if (selectedSubdistrict) {
        setLocationValue(`${selectedCity}, ${selectedSubdistrict}`);
      } else {
        setLocationValue(selectedCity);
      }
    } else {
      setLocationValue('');
    }
  }, [selectedCity, selectedSubdistrict]);

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

    // Reset city and subdistrict dropdowns
    if (originalState.location) {
      const parts = originalState.location.split(',').map(p => p.trim());
      const city = parts[0];
      const sub = parts[1] || '';
      if (citiesList[city]) {
        setSelectedCity(city);
        if (citiesList[city].includes(sub)) {
          setSelectedSubdistrict(sub);
        } else {
          setSelectedSubdistrict('');
        }
      } else {
        setSelectedCity('');
        setSelectedSubdistrict('');
      }
    } else {
      setSelectedCity('');
      setSelectedSubdistrict('');
    }
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

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!securityEmail || !securityEmailPassword) {
      alert(t('fill_all_fields') || 'Please fill in all fields.');
      return;
    }
    setIsEmailUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/security/email`, {
        email: securityEmail,
        password: securityEmailPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = { ...user, email: response.data.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEmail(response.data.email);
      setSecurityEmailPassword('');
      alert(response.data.msg || 'Email updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update email.');
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert(t('fill_all_fields') || 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert(t('password_mismatch_error'));
      return;
    }
    setIsPasswordUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/security/password`, {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert(response.data.msg || 'Password updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update password.');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    if (!securityPhone) {
      alert('Phone number is required.');
      return;
    }
    setIsPhoneUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/security/phone`, {
        phoneNumber: securityPhone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = { ...user, phoneNumber: response.data.phoneNumber };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setPhoneNumber(response.data.phoneNumber);
      alert(response.data.msg || 'Phone number updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update phone number.');
    } finally {
      setIsPhoneUpdating(false);
    }
  };

  const handleUpdateCnic = async (e) => {
    e.preventDefault();
    if (!securityCnic) {
      alert('CNIC number is required.');
      return;
    }
    if (!/^\d{5}-\d{7}-\d{1}$/.test(securityCnic)) {
      alert('Valid CNIC format is required (e.g., 12345-1234567-1)');
      return;
    }
    setIsCnicUpdating(true);
    try {
      const formData = new FormData();
      formData.append('cnicNumber', securityCnic);
      if (cnicFrontFile) {
        formData.append('cnicFrontPicture', cnicFrontFile);
      }
      if (cnicBackFile) {
        formData.append('cnicBackPicture', cnicBackFile);
      }
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/security/cnic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.msg || 'CNIC identification updated successfully!');
      setCnicFrontFile(null);
      setCnicBackFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to update CNIC details.');
    } finally {
      setIsCnicUpdating(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deleteConfirmPassword) {
      alert('Please enter your password to confirm deletion.');
      return;
    }
    if (!window.confirm('WARNING: This action is irreversible. All your skills, reviews, messages, and profile information will be deleted permanently. Are you absolutely sure you want to proceed?')) {
      return;
    }
    setIsDeletingAccount(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/profile/security/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: deleteConfirmPassword }
      });
      alert(response.data.msg || 'Your account has been successfully deleted.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/signup');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to delete account. Please verify your password.');
    } finally {
      setIsDeletingAccount(false);
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
                <div className="form-group full-width location-selectors-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="location-select-container">
                    <label htmlFor="city-select">
                      <MapPin size={16} style={{display:'inline', marginBottom:'-2px', marginRight: '4px'}}/> 
                      {i18n.language === 'ur' ? 'شہر' : i18n.language === 'sd' ? 'شھر' : 'City'}
                    </label>
                    <select
                      id="city-select"
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedSubdistrict(''); // reset subdistrict
                      }}
                      className="input-field select-field"
                    >
                      <option value="">
                        {i18n.language === 'ur' ? 'شہر منتخب کریں' : i18n.language === 'sd' ? 'شھر چونڊيو' : 'Select City'}
                      </option>
                      {Object.keys(citiesList).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="location-select-container">
                    <label htmlFor="subdistrict-select">
                      <MapPin size={16} style={{display:'inline', marginBottom:'-2px', marginRight: '4px'}}/> 
                      {i18n.language === 'ur' ? 'علاقہ / ذیلی ضلع' : i18n.language === 'sd' ? 'علائقو' : 'Subdistrict / Area'}
                    </label>
                    <select
                      id="subdistrict-select"
                      value={selectedSubdistrict}
                      onChange={(e) => setSelectedSubdistrict(e.target.value)}
                      disabled={!selectedCity}
                      className="input-field select-field"
                    >
                      <option value="">
                        {i18n.language === 'ur' ? 'علاقہ منتخب کریں' : i18n.language === 'sd' ? 'علائقو چونڊيو' : 'Select Area / Subdistrict'}
                      </option>
                      {selectedCity && citiesList[selectedCity]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
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
                    <span>{t('unsaved_changes_warning')}</span>
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

            {/* Account Settings & Security Center */}
            <div className="profile-card security-settings-card full-width" style={{ marginTop: '20px' }}>
              <div className="card-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} className="security-icon-glow" style={{ color: 'var(--primary-orange)' }} />
                  {t('security_settings_title')}
                </h3>
              </div>
              <div className="security-accordion-container">
                
                {/* Accordion Item 1: Email Change */}
                <div className={`accordion-item ${activeSecuritySection === 'email' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header"
                    onClick={() => setActiveSecuritySection(activeSecuritySection === 'email' ? null : 'email')}
                  >
                    <span className="accordion-title-wrapper">
                      <Mail size={18} />
                      <span>{t('security_email_title')}</span>
                    </span>
                    <span className="accordion-chevron"></span>
                  </button>
                  <div className="accordion-content">
                    <div className="accordion-inner-form">
                      <div className="form-group">
                        <label htmlFor="security-email">{t('security_new_email_label')}</label>
                        <input
                          id="security-email"
                          type="email"
                          value={securityEmail}
                          onChange={(e) => setSecurityEmail(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_new_email')}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="security-email-password">{t('security_password_verify_label')}</label>
                        <input
                          id="security-email-password"
                          type="password"
                          value={securityEmailPassword}
                          onChange={(e) => setSecurityEmailPassword(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_current_password_verify')}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary-orange"
                        onClick={handleUpdateEmail}
                        disabled={isEmailUpdating}
                        style={{ marginTop: '10px' }}
                      >
                        {isEmailUpdating ? t('saving') : t('update_email_btn')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Item 2: Password Reset */}
                <div className={`accordion-item ${activeSecuritySection === 'password' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header"
                    onClick={() => setActiveSecuritySection(activeSecuritySection === 'password' ? null : 'password')}
                  >
                    <span className="accordion-title-wrapper">
                      <Lock size={18} />
                      <span>{t('security_password_title')}</span>
                    </span>
                    <span className="accordion-chevron"></span>
                  </button>
                  <div className="accordion-content">
                    <div className="accordion-inner-form">
                      <div className="form-group">
                        <label htmlFor="old-password">{t('security_old_password_label')}</label>
                        <input
                          id="old-password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_current_password')}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="new-password">{t('security_new_password_label')}</label>
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_new_password')}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirm-new-password">{t('security_confirm_password_label')}</label>
                        <input
                          id="confirm-new-password"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_confirm_new_password')}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary-orange"
                        onClick={handleUpdatePassword}
                        disabled={isPasswordUpdating}
                        style={{ marginTop: '10px' }}
                      >
                        {isPasswordUpdating ? t('saving') : t('update_password_btn')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Item 3: Phone Update */}
                <div className={`accordion-item ${activeSecuritySection === 'phone' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header"
                    onClick={() => setActiveSecuritySection(activeSecuritySection === 'phone' ? null : 'phone')}
                  >
                    <span className="accordion-title-wrapper">
                      <Phone size={18} />
                      <span>{t('security_phone_title')}</span>
                    </span>
                    <span className="accordion-chevron"></span>
                  </button>
                  <div className="accordion-content">
                    <div className="accordion-inner-form">
                      <div className="form-group">
                        <label htmlFor="security-phone">{t('security_phone_label')}</label>
                        <input
                          id="security-phone"
                          type="text"
                          value={securityPhone}
                          onChange={(e) => setSecurityPhone(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_phone')}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary-orange"
                        onClick={handleUpdatePhone}
                        disabled={isPhoneUpdating}
                        style={{ marginTop: '10px' }}
                      >
                        {isPhoneUpdating ? t('saving') : t('update_phone_btn')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Item 4: CNIC Identification */}
                <div className={`accordion-item ${activeSecuritySection === 'cnic' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header"
                    onClick={() => setActiveSecuritySection(activeSecuritySection === 'cnic' ? null : 'cnic')}
                  >
                    <span className="accordion-title-wrapper">
                      <CreditCard size={18} />
                      <span>{t('security_cnic_title')}</span>
                    </span>
                    <span className="accordion-chevron"></span>
                  </button>
                  <div className="accordion-content">
                    <div className="accordion-inner-form">
                      <div className="form-group">
                        <label htmlFor="security-cnic">{t('security_cnic_label')}</label>
                        <input
                          id="security-cnic"
                          type="text"
                          value={securityCnic}
                          onChange={(e) => setSecurityCnic(e.target.value)}
                          className="input-field"
                          placeholder="12345-1234567-1"
                        />
                        <small style={{ color: 'var(--text-medium)', marginTop: '4px', display: 'block' }}>
                          Format: XXXXX-XXXXXXX-X
                        </small>
                      </div>

                      <div className="cnic-upload-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                        <div className="cnic-upload-box">
                          <label>{t('cnic_front_label')}</label>
                          <div className="cnic-preview-container">
                            {cnicFrontPreview ? (
                              <img src={cnicFrontPreview} alt={t('cnic_front_alt')} className="cnic-img-preview" />
                            ) : (
                              <div className="cnic-placeholder-icon"><CreditCard size={32} /></div>
                            )}
                          </div>
                          <label htmlFor="cnic-front-file" className="btn btn-ghost upload-label" style={{ justifyContent: 'center', marginTop: '8px' }}>
                            <Upload size={16} /> {cnicFrontFile ? cnicFrontFile.name : t('choose_file')}
                            <input
                              type="file"
                              id="cnic-front-file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setCnicFrontFile(file);
                                  setCnicFrontPreview(URL.createObjectURL(file));
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>

                        <div className="cnic-upload-box">
                          <label>{t('cnic_back_label')}</label>
                          <div className="cnic-preview-container">
                            {cnicBackPreview ? (
                              <img src={cnicBackPreview} alt={t('cnic_back_alt')} className="cnic-img-preview" />
                            ) : (
                              <div className="cnic-placeholder-icon"><CreditCard size={32} /></div>
                            )}
                          </div>
                          <label htmlFor="cnic-back-file" className="btn btn-ghost upload-label" style={{ justifyContent: 'center', marginTop: '8px' }}>
                            <Upload size={16} /> {cnicBackFile ? cnicBackFile.name : t('choose_file')}
                            <input
                              type="file"
                              id="cnic-back-file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setCnicBackFile(file);
                                  setCnicBackPreview(URL.createObjectURL(file));
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary-orange"
                        onClick={handleUpdateCnic}
                        disabled={isCnicUpdating}
                        style={{ marginTop: '20px' }}
                      >
                        {isCnicUpdating ? t('saving') : t('update_cnic_btn')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accordion Item 5: Danger Zone */}
                <div className={`accordion-item danger-item ${activeSecuritySection === 'delete' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header danger-header"
                    onClick={() => setActiveSecuritySection(activeSecuritySection === 'delete' ? null : 'delete')}
                  >
                    <span className="accordion-title-wrapper" style={{ color: '#ef4444' }}>
                      <AlertTriangle size={18} />
                      <span>{t('security_danger_title')}</span>
                    </span>
                    <span className="accordion-chevron"></span>
                  </button>
                  <div className="accordion-content danger-content">
                    <div className="accordion-inner-form warning-panel" style={{ borderLeft: '4px solid #ef4444', paddingLeft: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '16px' }}>
                      <p style={{ color: '#ef4444', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                        {t('security_delete_warning_title')}
                      </p>
                      <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', margin: '0 0 16px 0' }}>
                        {t('security_delete_warning_desc')}
                      </p>

                      <div className="form-group">
                        <label htmlFor="delete-confirm-password" style={{ color: '#ef4444' }}>
                          {t('security_delete_password_label')}
                        </label>
                        <input
                          id="delete-confirm-password"
                          type="password"
                          value={deleteConfirmPassword}
                          onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                          className="input-field"
                          placeholder={t('placeholder_enter_password')}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        style={{ background: '#ef4444', color: '#fff', marginTop: '10px' }}
                      >
                        {isDeletingAccount ? t('saving') : t('delete_account_btn')}
                      </button>
                    </div>
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

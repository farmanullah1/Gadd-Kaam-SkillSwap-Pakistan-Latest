// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Bell, Menu, X, Globe, Moon, Sun, Phone, LogOut, LayoutDashboard, User, ChevronDown, LifeBuoy, ShieldCheck
} from 'lucide-react'; 
import LogoutConfirmationModal from './LogoutConfirmationModal';
import NotificationDropdown from './NotificationDropdown';
import '../styles/navbar.css';
import '../styles/notifications.css';

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs for click outside detection
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileNotificationRef = useRef(null); 
  const languageRef = useRef(null);

  // --- SCROLL HANDLER FOR STICKY NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll for notifications
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!props.user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications?page=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data.unreadCount);
      } catch (e) { }
    };

    if (props.user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000); 
      return () => clearInterval(interval);
    }
  }, [props.user]);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  // Updated Click Outside Logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
      
      const clickedDesktopNotif = notificationRef.current && notificationRef.current.contains(event.target);
      const clickedMobileNotif = mobileNotificationRef.current && mobileNotificationRef.current.contains(event.target);
      
      if (!clickedDesktopNotif && !clickedMobileNotif) {
        setShowNotifications(false);
      }

      if (languageRef.current && !languageRef.current.contains(event.target)) setShowLanguageOptions(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);
  const selectLanguage = (langCode) => { i18n.changeLanguage(langCode); setShowLanguageOptions(false); };
  const handleProfileClick = () => setShowProfileMenu(prev => !prev);
  const handleLogoutClick = () => { setShowProfileMenu(false); setIsMenuOpen(false); setShowLogoutConfirm(true); };
  const confirmLogout = () => { props.onLogout(); setShowLogoutConfirm(false); };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleWomenZoneClick = (e) => {
    if (props.user && props.user.gender !== 'Female') {
        e.preventDefault();
        alert("Access Restricted: This zone is exclusively for female users.");
    } else if (!props.user) {
        e.preventDefault();
        navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const getProfileUrl = () => {
    if (props.user && props.user.profilePicture) {
        if(props.user.profilePicture.startsWith('http')) return props.user.profilePicture;
        return `${process.env.REACT_APP_API_URL}/${props.user.profilePicture.replace(/\\/g, '/')}`;
    }
    return 'https://placehold.co/150x150/cccccc/ffffff?text=User';
  };

  const shouldShowWomenZone = !props.user || (props.user && props.user.gender === 'Female');
  const isAdmin = props.user && props.user.role === 'admin'; // Check Admin Role

  const sindhiNavbarStyle = isSindhiMode ? {
    backgroundImage: `url(/Navbar-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  // Helper to check active state
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      {/* 1. TOP UTILITY BAR */}
      <div className="top-utility-bar">
        <div className="top-utility-content">
          <div className="utility-left">
             <span className="welcome-msg">Welcome to Pakistan's Top Skill Marketplace</span>
          </div>
          <div className="utility-actions">
            <button className="utility-btn" onClick={toggleDarkMode} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
              {isDarkMode ? <Sun size={15} className="spin-icon" /> : <Moon size={15} className="spin-icon" />}
            </button>

            <div className="language-wrapper" ref={languageRef}>
              <button className="utility-btn lang-btn" onClick={() => setShowLanguageOptions(!showLanguageOptions)}>
                <Globe size={15} />
                <span>{i18n.language.toUpperCase()}</span>
                <ChevronDown size={12} />
              </button>
              {showLanguageOptions && (
                <div className="language-dropdown slide-in-down">
                  <button onClick={() => selectLanguage('en')}>English</button>
                  <button onClick={() => selectLanguage('ur')}>Urdu</button>
                  <button onClick={() => selectLanguage('sd')}>Sindhi</button>
                </div>
              )}
            </div>

            <button className="utility-btn helpline-btn" onClick={props.onHelplineClick} title="Support">
              <LifeBuoy size={15} />
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: isSticky ? '70px' : '0', transition: 'height 0.3s' }}></div>

      {/* 2. MAIN NAVBAR */}
      <nav 
        className={`main-navbar ${isSticky ? 'fixed-nav' : ''} ${isSindhiMode ? 'sindhi-mode' : ''}`} 
        style={sindhiNavbarStyle}
      >
        <div className="navbar-container">
          
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
            <div className="logo-wrapper">
                <img src="/Gadd_Kaam Light.png" alt="Gadd Kaam" className="brand-logo" onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/40x40?text=GK";}} />
            </div>
            <span className="brand-text">Gadd <span className="highlight-text">Kaam</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-menu-desktop">
            <Link to="/marketplace" className={`nav-item ${isActive('/marketplace')}`}>
                {t("navbar_marketplace")}
            </Link>
            
            {shouldShowWomenZone && (
               <Link to="/women-zone" className={`nav-item pink-zone ${isActive('/women-zone')}`} onClick={handleWomenZoneClick}>
                   {t("navbar_women_zone")}
               </Link>
            )}
            
            <Link to="/about" className={`nav-item ${isActive('/about')}`}>
                {t("navbar_about_us")}
            </Link>
            
            <Link to="/contact" className={`nav-item ${isActive('/contact')}`}>
                {t("navbar_contact")}
            </Link>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                {t("navbar_dashboard")}
            </Link>
          </div>

          {/* Desktop Actions (Hidden on Mobile) */}
          <div className="navbar-actions-desktop">
            {props.user ? (
              <>
                {/* Admin Button (Visible only to Admin) */}
                {isAdmin && (
                  <Link to="/admin" className="icon-btn" title="Admin Dashboard">
                    <ShieldCheck size={22} color="#dc2626" />
                  </Link>
                )}

                {/* Desktop Notification */}
                <div className="notification-container" ref={notificationRef}>
                  <button className="icon-btn bell-btn" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={22} className={unreadCount > 0 ? 'bell-ring' : ''} />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {showNotifications && (
                      <div className="dropdown-wrapper">
                          <NotificationDropdown onClose={() => setShowNotifications(false)} />
                      </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="profile-container" ref={profileMenuRef}>
                  <button className="profile-btn" onClick={handleProfileClick}>
                    <img src={getProfileUrl()} alt="Profile" className="profile-img-anim" />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="dropdown-menu scale-in-tr">
                      <Link to="/dashboard" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                        <LayoutDashboard size={18}/> My Dashboard
                      </Link>
                      <Link to="/dashboard/profile" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                        <User size={18}/> Account Settings
                      </Link>
                      
                      {isAdmin && (
                        <Link to="/admin" className="dropdown-link" onClick={() => setShowProfileMenu(false)} style={{color:'var(--danger-color)'}}>
                           <ShieldCheck size={18}/> Admin Panel
                        </Link>
                      )}

                      <button onClick={handleLogoutClick} className="dropdown-link logout">
                        <LogOut size={18}/> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-login">{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup">{t("navbar_signup_btn")}</Link>
              </div>
            )}
          </div>

          {/* Mobile Actions & Toggle (Visible on Mobile) */}
          <div className="navbar-mobile-toggle">
            
            {/* ✅ MOBILE NOTIFICATION BELL (Added here) */}
            {props.user && (
               <div className="mobile-notification-wrapper" ref={mobileNotificationRef}>
                  <button className="icon-btn bell-btn mobile-bell" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={22} />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {/* Show dropdown on mobile if toggled */}
                  {showNotifications && (
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
               </div>
            )}

            {props.user && (
               <Link to="/dashboard/profile" className="mobile-profile-icon">
                  <img src={getProfileUrl()} alt="Profile" />
               </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-button">
              {isMenuOpen ? <X size={28} className="rotate-icon" /> : <Menu size={28} className="rotate-icon" />}
            </button>
          </div>
        </div>

        {/* 3. MOBILE MENU OVERLAY */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/marketplace" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_marketplace")}</Link>
            {shouldShowWomenZone && (
               <Link to="/women-zone" className="mobile-link pink-mobile" onClick={(e) => {handleWomenZoneClick(e); setIsMenuOpen(false);}}>{t("navbar_women_zone")}</Link>
            )}
            <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_about_us")}</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_contact")}</Link>
            
            <div className="mobile-divider"></div>

            {props.user ? (
              <>
                <Link to="/dashboard" className="mobile-link highlight" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard size={18}/> My Dashboard
                </Link>
                <Link to="/dashboard/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    <User size={18}/> Account Settings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="mobile-link" style={{color:'var(--danger-color)', fontWeight:'bold'}} onClick={() => setIsMenuOpen(false)}>
                      <ShieldCheck size={18}/> Admin Panel
                  </Link>
                )}
                <button className="mobile-link logout" onClick={handleLogoutClick}>
                    <LogOut size={18}/> Sign Out
                </button>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-login-mobile" onClick={() => setIsMenuOpen(false)}>{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup-mobile" onClick={() => setIsMenuOpen(false)}>{t("navbar_signup_btn")}</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LogoutConfirmationModal isOpen={showLogoutConfirm} onConfirm={confirmLogout} onCancel={cancelLogout} />
    </>
  );
}

export default Navbar;
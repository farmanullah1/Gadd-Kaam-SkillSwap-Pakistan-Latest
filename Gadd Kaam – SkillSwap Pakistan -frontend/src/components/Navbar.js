// src/components/Navbar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Bell, Menu, X, Globe, Moon, Sun, LogOut, LayoutDashboard, User,
  ChevronDown, LifeBuoy, ShieldCheck, Search, Zap
} from 'lucide-react'; 
import LogoutConfirmationModal from './LogoutConfirmationModal';
import NotificationDropdown from './NotificationDropdown';
import { io } from 'socket.io-client';

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); 
  const isLandingPage = location.pathname === '/';
  
  // ── State ──────────────────────────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen]           = useState(false);
  const [isSticky, setIsSticky]               = useState(false);
  const [scrollProgress, setScrollProgress]   = useState(0);
  const [isDarkMode, setIsDarkMode]           = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    const savedMode = localStorage.getItem('darkMode');
    return savedMode
      ? JSON.parse(savedMode)
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu]         = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm]     = useState(false);
  const [isSindhiMode, setIsSindhiMode]               = useState(i18n.language === 'sd');
  const [unreadCount, setUnreadCount]                 = useState(0);
  const [showNotifications, setShowNotifications]     = useState(false);
  const [searchOpen, setSearchOpen]                   = useState(false);
  const [searchQuery, setSearchQuery]                 = useState('');

  // ── Refs ───────────────────────────────────────────────────────────────────
  const profileMenuRef      = useRef(null);
  const notificationRef     = useRef(null);
  const mobileNotificationRef = useRef(null); 
  const languageRef         = useRef(null);
  const searchInputRef      = useRef(null);

  // ── Scroll handler: sticky + progress bar ─────────────────────────────────
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsSticky(scrollY > 40);

    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Socket + Notifications ─────────────────────────────────────────────────
  useEffect(() => {
    let socketInstance = null;
    const fetchUnreadCount = async () => {
      if (!props.user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications?page=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data.unreadCount);
      } catch (e) {}
    };

    if (props.user) {
      fetchUnreadCount();
      const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      socketInstance = io(socketUrl, { transports: ['websocket'], upgrade: false });
      socketInstance.emit('join_user', props.user.id);
      socketInstance.on('notification_received', (newNotif) => {
        setUnreadCount(prev => prev + 1);
        window.dispatchEvent(new CustomEvent('socket_notification', { detail: newNotif }));
      });
    }
    return () => { if (socketInstance) socketInstance.disconnect(); };
  }, [props.user]);

  useEffect(() => {
    const handleMarkedAllRead   = () => setUnreadCount(0);
    const handleMarkedSingleRead = () => setUnreadCount(prev => Math.max(0, prev - 1));
    window.addEventListener('notifications_marked_all_read', handleMarkedAllRead);
    window.addEventListener('notification_marked_read_single', handleMarkedSingleRead);
    return () => {
      window.removeEventListener('notifications_marked_all_read', handleMarkedAllRead);
      window.removeEventListener('notification_marked_read_single', handleMarkedSingleRead);
    };
  }, []);

  // ── Theme sync ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && (e.detail === 'dark' || e.detail === 'light'))
        setIsDarkMode(e.detail === 'dark');
    };
    window.addEventListener('theme_changed', handleThemeChange);
    return () => window.removeEventListener('theme_changed', handleThemeChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // ── Language sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  // ── Click outside ─────────────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target))
        setShowProfileMenu(false);
      
      const clickedDesktopNotif  = notificationRef.current && notificationRef.current.contains(event.target);
      const clickedMobileNotif   = mobileNotificationRef.current && mobileNotificationRef.current.contains(event.target);
      if (!clickedDesktopNotif && !clickedMobileNotif) setShowNotifications(false);

      if (languageRef.current && !languageRef.current.contains(event.target))
        setShowLanguageOptions(false);

      if (searchInputRef.current && !searchInputRef.current.contains(event.target))
        setSearchOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleDarkMode = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    window.dispatchEvent(new CustomEvent('theme_changed', { detail: newTheme ? 'dark' : 'light' }));
  };

  const selectLanguage = (langCode, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    i18n.changeLanguage(langCode);
    setShowLanguageOptions(false);
    window.dispatchEvent(new CustomEvent('language_changed', { detail: langCode }));
  };

  const toggleLanguageOptions = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setShowLanguageOptions(prev => !prev);
  };

  const handleSupportClick = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (typeof props.onHelplineClick === 'function') { props.onHelplineClick(); return; }
    navigate('/support');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleProfileClick  = () => setShowProfileMenu(prev => !prev);
  const handleLogoutClick   = () => { setShowProfileMenu(false); setIsMenuOpen(false); setShowLogoutConfirm(true); };
  const confirmLogout        = () => { props.onLogout(); setShowLogoutConfirm(false); };
  const cancelLogout         = () => setShowLogoutConfirm(false);

  const handleWomenZoneClick = (e) => {
    if (props.user && props.user.gender !== 'Female') {
      e.preventDefault();
      alert(t('access_restricted_women_zone'));
    } else if (!props.user) {
      e.preventDefault();
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const getProfileUrl = () => {
    if (props.user && props.user.profilePicture) {
      if (props.user.profilePicture.startsWith('http')) return props.user.profilePicture;
      return `${process.env.REACT_APP_API_URL}/${props.user.profilePicture.replace(/\\/g, '/')}`;
    }
    return 'https://placehold.co/150x150/cccccc/ffffff?text=User';
  };

  const shouldShowWomenZone = !props.user || (props.user && props.user.gender === 'Female');
  const isAdmin             = props.user && props.user.role === 'admin';
  const isActive            = (path) => location.pathname === path 
    ? 'bg-orange-500/10 dark:bg-orange-500/15 text-primary-orange dark:text-orange-400' 
    : 'text-slate-700 dark:text-slate-300 hover:text-primary-orange dark:hover:text-orange-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40';

  const sindhiNavbarStyle = isSindhiMode ? {
    backgroundImage: `url(/Navbar-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  // ── Mobile Links ──────────────────────────────────────────────────────────
  const renderMobileLinks = () => {
    const defaultSindhiTextClass = isSindhiMode ? '[text-shadow:1px_1px_2px_black,-1px_-1px_2px_black] !text-white' : '';
    if (isLandingPage) {
      return (
        <>
          <Link to="/home" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_marketplace')}</Link>
          <Link to="/leaderboard" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_leaderboard')}</Link>
          <Link to="/support" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_help_center')}</Link>
          <Link to="/stories" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_stories')}</Link>
          <Link to="/status" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_status')}</Link>
          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-2 opacity-50" />
          {props.user ? (
            <>
              <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 bg-orange-500/10 hover:bg-orange-500/20 text-primary-orange font-extrabold rounded-2xl border border-transparent hover:border-orange-500/30 transition-all duration-200 shadow-sm ${isSindhiMode ? '!text-white' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard size={18} /> {t('navbar_my_dashboard')}
              </Link>
              <button className="flex items-center gap-3 px-4 py-3.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold rounded-2xl border border-transparent hover:border-red-500/20 transition-all duration-200 w-full text-left" onClick={handleLogoutClick}>
                <LogOut size={18} /> {t('navbar_sign_out')}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3.5 mt-2">
              <Link to="/login" className={`block text-center py-3.5 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-primary-orange hover:text-primary-orange rounded-2xl font-bold transition-all duration-200 ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_login_btn')}</Link>
              <Link to="/signup" className="block text-center py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 text-white hover:to-orange-600 rounded-2xl font-extrabold shadow-lg shadow-orange-500/15 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>{t('navbar_signup_btn')}</Link>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <Link to="/marketplace" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_marketplace')}</Link>
        {shouldShowWomenZone && (
          <Link to="/women-zone" className={`flex items-center gap-3 px-4 py-3.5 bg-pink-500/5 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 hover:border-pink-300 dark:hover:border-pink-900 border border-transparent font-bold rounded-2xl transition-all duration-200 ${isSindhiMode ? '!text-white' : ''}`} onClick={(e) => { handleWomenZoneClick(e); setIsMenuOpen(false); }}>
            {t('navbar_women_zone')}
          </Link>
        )}
        <Link to="/about" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_about_us')}</Link>
        <Link to="/contact" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_contact')}</Link>
        <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-2 opacity-50" />
        {props.user ? (
          <>
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 bg-orange-500/10 hover:bg-orange-500/20 text-primary-orange font-extrabold rounded-2xl border border-transparent hover:border-orange-500/30 transition-all duration-200 shadow-sm ${isSindhiMode ? '!text-white' : ''}`} onClick={() => setIsMenuOpen(false)}>
              <LayoutDashboard size={18} /> {t('navbar_my_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-primary-orange dark:hover:text-orange-400 font-bold rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200 shadow-sm ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>
              <User size={18} /> {t('navbar_account_settings')}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3.5 bg-red-500/5 text-red-600 dark:text-red-400 font-bold rounded-2xl border border-transparent hover:border-red-500/10 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                <ShieldCheck size={18} /> {t('navbar_admin_panel')}
              </Link>
            )}
            <button className="flex items-center gap-3 px-4 py-3.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold rounded-2xl border border-transparent hover:border-red-500/20 transition-all duration-200 w-full text-left" onClick={handleLogoutClick}>
              <LogOut size={18} /> {t('navbar_sign_out')}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3.5 mt-2">
            <Link to="/login" className={`block text-center py-3.5 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-primary-orange hover:text-primary-orange rounded-2xl font-bold transition-all duration-200 ${defaultSindhiTextClass}`} onClick={() => setIsMenuOpen(false)}>{t('navbar_login_btn')}</Link>
            <Link to="/signup" className="block text-center py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 text-white hover:to-orange-600 rounded-2xl font-extrabold shadow-lg shadow-orange-500/15 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>{t('navbar_signup_btn')}</Link>
          </div>
        )}
      </>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const defaultSindhiTextShadow = isSindhiMode ? '[text-shadow:1px_1px_2px_black,-1px_-1px_2px_black] !text-white' : '';
  const defaultSindhiIconColor = isSindhiMode ? '[filter:drop-shadow(1px_1px_1px_rgba(0,0,0,0.7))] !stroke-white' : '';

  return (
    <>
      <header className="relative z-[100000] sticky top-[-40px] transition-all duration-300">

        {/* ── 1. TOP UTILITY BAR ──────────────────────────────────────────── */}
        <div className="w-full h-10 bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md flex items-center z-[100200] text-xs transition-all duration-300">
          <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center relative z-[100201]">
            <div className="hidden md:flex">
              <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-primary-orange text-[11px] font-semibold text-slate-500 dark:text-slate-400 animate-[type-delete-loop_8s_steps(45)_infinite,blink-caret_0.7s_step-end_infinite]">{t('navbar_welcome_msg')}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              {/* Live swapper count pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping flex-shrink-0" />
                <Zap size={11} />
                <strong>247</strong>&nbsp;{t('navbar_live_swappers')}
              </span>

              {/* Dark mode toggle */}
              <button 
                type="button" 
                className="px-2 py-1 bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-orange-500/10 hover:border-orange-500/20 text-slate-600 dark:text-slate-400 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center" 
                onClick={toggleDarkMode} 
                title={isDarkMode ? t('navbar_light_mode') : t('navbar_dark_mode')}
              >
                {isDarkMode ? <Sun size={15} className="hover:rotate-45 transition-transform duration-300" /> : <Moon size={15} className="hover:rotate-12 transition-transform duration-300" />}
              </button>

              {/* Language */}
              <div className="relative" ref={languageRef}>
                <button 
                  type="button" 
                  className={`px-2.5 py-1 bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-orange-500/10 hover:border-orange-500/20 text-slate-600 dark:text-slate-400 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 font-bold ${defaultSindhiTextShadow}`} 
                  onClick={toggleLanguageOptions} 
                  aria-expanded={showLanguageOptions}
                >
                  <Globe size={15} className={defaultSindhiIconColor} />
                  <span>{i18n.language.toUpperCase()}</span>
                  <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: showLanguageOptions ? 'rotate(180deg)' : 'none' }} className={defaultSindhiIconColor} />
                </button>
                {showLanguageOptions && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl min-w-[148px] overflow-hidden z-[100300] animate-alert-pop">
                    <button type="button" className="block w-full text-left px-4 py-2.5 hover:bg-orange-500/5 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-semibold text-xs border-b border-slate-100 dark:border-slate-800/50" onClick={(e) => selectLanguage('en', e)}>{t('lang_en')}</button>
                    <button type="button" className="block w-full text-left px-4 py-2.5 hover:bg-orange-500/5 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-semibold text-xs border-b border-slate-100 dark:border-slate-800/50" onClick={(e) => selectLanguage('ur', e)}>{t('lang_ur')}</button>
                    <button type="button" className="block w-full text-left px-4 py-2.5 hover:bg-orange-500/5 text-slate-800 dark:text-slate-200 hover:text-primary-orange font-semibold text-xs" onClick={(e) => selectLanguage('sd', e)}>{t('lang_sd')}</button>
                  </div>
                )}
              </div>

              {/* Support */}
              <button 
                type="button" 
                className={`px-2.5 py-1 bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-orange-500/10 hover:border-orange-500/20 text-slate-600 dark:text-slate-400 hover:text-primary-orange rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1.5 font-bold ${defaultSindhiTextShadow}`} 
                onClick={handleSupportClick} 
                title={t('navbar_support')}
              >
                <LifeBuoy size={15} className={defaultSindhiIconColor} />
                <span>{t('navbar_support')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN NAVBAR ───────────────────────────────────────────────── */}
        <nav
          className={`w-full relative z-[100100] backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/70 shadow-lg shadow-slate-100/5 dark:shadow-none transition-all duration-300 flex items-center ${isSticky ? 'fixed top-0 left-0 w-full z-[100100] h-[62px] bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-md animate-slide-down-nav' : 'h-[76px]'}`}
          style={sindhiNavbarStyle}
        >
          {/* Scroll Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-[3.5px] bg-gradient-to-r from-primary-orange via-amber-500 to-teal-500 transform-origin-left z-10 pointer-events-none transition-transform duration-100"
            style={{ transform: `scaleX(${scrollProgress / 100})`, width: '100%' }}
            aria-hidden="true"
          />

          <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">

            {/* Logo */}
            <Link to={isLandingPage ? '/' : '/home'} className="flex items-center gap-3 z-1001 group" onClick={() => setIsMenuOpen(false)}>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-white/40 dark:to-slate-900/40 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
                <img
                  src="/Gadd_Kaam.png"
                  alt={t('navbar_brand_alt')}
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40?text=${encodeURIComponent(t('app_initials'))}`; }}
                />
              </div>
              <span className={`text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight ${defaultSindhiTextShadow}`}>{t('navbar_brand_name')}</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {isLandingPage ? (
                <>
                  <Link to="/home" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 relative group flex items-center gap-1.5 ${isActive('/home')}`}>
                    <span>{t('navbar_marketplace')}</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  </Link>
                  <Link to="/leaderboard" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/leaderboard')} ${defaultSindhiTextShadow}`}>{t('navbar_leaderboard')}</Link>
                  <Link to="/support" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/support')} ${defaultSindhiTextShadow}`}>{t('navbar_help_center')}</Link>
                  <Link to="/stories" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/stories')} ${defaultSindhiTextShadow}`}>{t('navbar_stories')}</Link>
                  <Link to="/status" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/status')} ${defaultSindhiTextShadow}`}>{t('navbar_status')}</Link>
                </>
              ) : (
                <>
                  <Link to="/marketplace" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 relative group flex items-center gap-1.5 ${isActive('/marketplace')}`}>
                    <span>{t('navbar_marketplace')}</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  </Link>
                  {shouldShowWomenZone && (
                    <Link to="/women-zone" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 border border-pink-200/30 text-pink-600 dark:text-pink-400 bg-pink-500/5 dark:bg-pink-500/10 hover:bg-pink-500/10 hover:border-pink-300 dark:hover:border-pink-850 animate-[pulse_3s_infinite_alternate] ${isSindhiMode ? '!text-white' : ''}`} onClick={handleWomenZoneClick}>
                      {t('navbar_women_zone')}
                    </Link>
                  )}
                  <Link to="/about" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/about')} ${defaultSindhiTextShadow}`}>{t('navbar_about_us')}</Link>
                  <Link to="/contact" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/contact')} ${defaultSindhiTextShadow}`}>{t('navbar_contact')}</Link>
                  <Link to="/dashboard" className={`px-4 py-2 font-bold text-[13px] rounded-full transition-all duration-200 ${isActive('/dashboard')} ${defaultSindhiTextShadow}`}>{t('navbar_dashboard')}</Link>
                </>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search */}
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center border border-slate-200/50 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 rounded-full p-1 transition-all duration-300 h-9 relative ${searchOpen ? 'w-[240px] border-primary-orange shadow-md shadow-orange-500/10' : 'w-10 overflow-hidden'}`}
                ref={searchInputRef}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('navbar_search_placeholder') || 'Find skills...'}
                  className={`border-none bg-transparent outline-none text-xs text-slate-900 dark:text-white px-2 py-1 w-full transition-opacity duration-200 ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                />
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-orange rounded-full p-1.5 focus:outline-none"
                  onClick={() => {
                    if (searchOpen && searchQuery.trim()) {
                      handleSearchSubmit({ preventDefault: () => {} });
                    } else {
                      setSearchOpen(prev => !prev);
                      setTimeout(() => {
                        if (!searchOpen && searchInputRef.current) {
                          searchInputRef.current.querySelector('input')?.focus();
                        }
                      }, 100);
                    }
                  }}
                >
                  <Search size={18} className={defaultSindhiIconColor} />
                </button>
              </form>

              {props.user ? (
                <>
                  {/* Admin */}
                  {isAdmin && (
                    <Link to="/admin" className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0" title={t('navbar_admin_panel')}>
                      <ShieldCheck size={20} />
                    </Link>
                  )}

                  {/* Notifications */}
                  <div className="relative" ref={notificationRef}>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-primary-orange cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none" onClick={() => setShowNotifications(!showNotifications)}>
                      <Bell size={20} className={unreadCount > 0 ? 'animate-[bellShake_3s_infinite_cubic-bezier(.36,.07,.19,.97)] origin-top' : ''} />
                      {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                    </button>
                    {showNotifications && (
                      <div className="absolute top-[calc(100%+12px)] right-0 z-50">
                        <NotificationDropdown onClose={() => setShowNotifications(false)} />
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileMenuRef}>
                    <button className="bg-none border-none p-0 cursor-pointer focus:outline-none" onClick={handleProfileClick} aria-expanded={showProfileMenu}>
                      <div className="p-[2px] rounded-full bg-gradient-to-r from-primary-orange to-amber-500 transition-all duration-200 hover:scale-105">
                        <img src={getProfileUrl()} alt={t('navbar_profile_alt')} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                      </div>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute top-[calc(100%+12px)] right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-xl w-64 z-50 animate-alert-pop">
                        {/* User info header */}
                        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 dark:border-slate-800">
                          <img src={getProfileUrl()} alt="" className="w-11 h-11 rounded-full object-cover border border-orange-500/20" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                              {props.user.firstName || props.user.username || t('navbar_brand_name')}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{props.user.email || ''}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5 mt-2">
                          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-500/5 text-slate-700 dark:text-slate-300 hover:text-primary-orange font-semibold text-sm transition-all duration-200" onClick={() => setShowProfileMenu(false)}>
                            <LayoutDashboard size={16} /> {t('navbar_my_dashboard')}
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-500/5 text-slate-700 dark:text-slate-300 hover:text-primary-orange font-semibold text-sm transition-all duration-200" onClick={() => setShowProfileMenu(false)}>
                            <User size={16} /> {t('navbar_account_settings')}
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-500/5 text-slate-700 dark:text-slate-300 hover:text-primary-orange font-semibold text-sm transition-all duration-200" onClick={() => setShowProfileMenu(false)} style={{ color: 'var(--danger-color)' }}>
                              <ShieldCheck size={16} /> {t('navbar_admin_panel')}
                            </Link>
                          )}
                          <button onClick={handleLogoutClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-605 font-bold text-sm transition-all duration-200 w-full text-left border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-3.5 focus:outline-none">
                            <LogOut size={16} /> {t('navbar_sign_out')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`px-5 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-orange hover:text-primary-orange rounded-full font-bold text-sm bg-white/40 dark:bg-slate-800/40 transition-all duration-200 ${defaultSindhiTextShadow}`}>{t('navbar_login_btn')}</Link>
                  <Link to="/signup" className="px-6 py-2.5 bg-gradient-to-r from-primary-orange to-orange-500 text-white font-extrabold hover:to-orange-600 rounded-full text-sm shadow-md shadow-orange-500/15 hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">{t('navbar_signup_btn')}</Link>
                </div>
              )}
            </div>

            {/* Mobile Actions & Toggle */}
            <div className="flex lg:hidden items-center gap-3">
              {props.user && (
                <div className="relative" ref={mobileNotificationRef}>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-primary-orange cursor-pointer transition-all duration-200 focus:outline-none" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={20} className={unreadCount > 0 ? 'animate-[bellShake_3s_infinite_cubic-bezier(.36,.07,.19,.97)] origin-top' : ''} />
                    {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {showNotifications && (
                    <div className="absolute top-[calc(100%+12px)] right-0 z-50">
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>
              )}

              {props.user && (
                <Link to="/dashboard/profile" className="p-[2px] rounded-full bg-gradient-to-r from-primary-orange to-amber-500 shadow-sm">
                  <img src={getProfileUrl()} alt={t('navbar_profile_alt')} className="w-7.5 h-7.5 rounded-full object-cover border border-white dark:border-slate-900" />
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-orange-500/10 text-slate-800 dark:text-slate-200 hover:text-primary-orange cursor-pointer transition-all duration-200 focus:outline-none" 
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} className="hover:rotate-90 transition-transform duration-300" /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`fixed left-0 w-full h-[calc(100dvh-68px)] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-900/50 z-[99800] transition-all duration-300 overflow-y-auto ${isSticky ? 'top-[62px]' : 'top-[108px]'} ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[-10px] pointer-events-none'}`}>
            <div className="p-6 flex flex-col gap-2.5">
              {renderMobileLinks()}
            </div>
          </div>
        </nav>
      </header>

      <LogoutConfirmationModal isOpen={showLogoutConfirm} onConfirm={confirmLogout} onCancel={cancelLogout} />
    </>
  );
}

export default Navbar;

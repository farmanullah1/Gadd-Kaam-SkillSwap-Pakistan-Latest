import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; 
import { AlertCircle, User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function LoginPage({ onChatbotToggle }) {
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 3D Card Tilt State
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Interactive 3D tilt calculations
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt threshold of 10 degrees
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        credential,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role) {
        localStorage.setItem('role', response.data.user.role);
      }

      setUser(response.data.user);
      setSuccessMessage(t('login_success_message'));
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      let errorMsg = t('login_unexpected_error');

      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMsg = err.response.data.errors.map(e => e.msg).join(' | ');
        } else if (err.response.data.msg) {
          errorMsg = err.response.data.msg;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.role === 'admin') {
        navigate('/admin');
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* Main Section with Animated Gradient Background */}
      <main className="relative flex-grow flex items-center justify-center py-24 px-4 z-10 overflow-hidden">
        
        {/* Floating 3D Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[120px] animate-[pulse_8s_infinite]"></div>
          <div className="absolute top-[40%] left-[25%] w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-[90px]"></div>
        </div>

        {/* 3D Interactive Tilt Glassmorphism Card */}
        <div 
          className="w-full max-w-[520px] bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl relative transition-all duration-300 hover:shadow-orange-500/5 z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
        >
          {/* Floating 3D Logo Icon Box */}
          <div className="flex justify-center -mt-16 md:-mt-20 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-primary-orange to-orange-400 dark:from-orange-600 dark:to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 border-4 border-white dark:border-slate-900 animate-float">
              <Lock size={32} className="md:size-9" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white text-center tracking-tight mb-2 transition-transform duration-300 [transform:translateZ(30px)]">
            {t("login_welcome_back")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 transition-transform duration-300 [transform:translateZ(20px)]">
            {t("login_access_account")}
          </p>

          <div className="bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/30 rounded-2xl p-4 mb-6 text-xs text-slate-600 dark:text-slate-400 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs text-primary-orange dark:text-orange-400">
              <ShieldCheck size={18} />
              <span>{t("auth_secure_badge")}</span>
            </div>
            <p>{t("login_panel_desc")}</p>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/30 text-[10px] font-bold text-center">
              <span className="px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200/30 dark:border-slate-800/20">{t("auth_trust_verified")}</span>
              <span className="px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200/30 dark:border-slate-800/20">{t("auth_trust_cashless")}</span>
              <span className="px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200/30 dark:border-slate-800/20">{t("auth_trust_support")}</span>
            </div>
          </div>

          {/* Improved Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 animate-alert-pop">
              <AlertCircle className="flex-shrink-0 text-red-500 mt-0.5" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="credential" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-primary-orange dark:text-orange-400" /> 
                {t("login_credential_label")}
              </label>
              <input
                type="text"
                id="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder={t("login_credential_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={14} className="text-primary-orange dark:text-orange-400" /> 
                {t("signup_password_label")}
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login_password_placeholder")}
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/10 focus:outline-none transition-all duration-300 text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer p-1 rounded-lg transition-colors focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? t("auth_hide_password") : t("auth_show_password")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary-orange dark:text-orange-400 hover:underline self-end mt-1">
                {t("login_forgot_password")}
              </Link>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 px-6 mt-4 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> 
                  {t('login_logging_in')}
                </span>
              ) : (
                <> 
                  {t('navbar_login_btn')} 
                  <ArrowRight size={18} /> 
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
              {t("login_no_account_prompt")}{" "}
              <Link to="/signup" className="font-bold text-primary-orange dark:text-orange-400 hover:underline">
                {t("navbar_signup_btn")}
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-primary-orange to-orange-400 dark:from-orange-600 dark:to-orange-400 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 cursor-pointer transition-all z-50"
        aria-label="Open chatbot" 
        onClick={onChatbotToggle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}

      <SuccessMessageModal
        isOpen={showSuccessModal}
        title={t("login_success_title")}
        message={successMessage}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default LoginPage;

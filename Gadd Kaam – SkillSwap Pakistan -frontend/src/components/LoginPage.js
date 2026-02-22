import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import SuccessMessageModal from './SuccessMessageModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; 
import { AlertCircle, User, Lock, ArrowRight } from 'lucide-react'; // Added Icons

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        credential,
        password,
      });

      console.log('Login successful:', response.data);

      // Save Token & User Data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Save role specifically
      if (response.data.user.role) {
        localStorage.setItem('role', response.data.user.role);
      }

      setUser(response.data.user);

      // Show success modal
      setSuccessMessage(t('login_success_message'));
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      
      let errorMsg = t('login_unexpected_error');

      // Enhanced Error Parsing
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
    
    // Redirect based on role
    if (storedUser && storedUser.role === 'admin') {
        navigate('/admin');
    } else {
        navigate('/dashboard');
    }
  };

  return (
    <div className="login-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* Main Section with Animated Gradient Background */}
      <main className="login-section section-container">
        
        {/* Glassmorphism Card */}
        <div className="login-form-card animated-card">
          <h2 className="login-title">{t("login_welcome_back")}</h2>
          <p className="login-subtitle">{t("login_access_account")}</p>

          {/* Improved Error Alert */}
          {error && (
            <div className="error-alert shake-anim">
              <AlertCircle className="error-icon" size={20} />
              <span className="error-text">{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="credential">
                <User size={16} style={{marginRight: 6}}/> 
                {t("login_credential_label")}
              </label>
              <input
                type="text"
                id="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder={t("login_credential_placeholder")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} style={{marginRight: 6}}/> 
                {t("signup_password_label")}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login_password_placeholder")}
                required
              />
              <Link to="/forgot-password" class="forgot-password-link">{t("login_forgot_password")}</Link>
            </div>

            <button type="submit" className="btn btn-primary-orange login-btn pulse-on-hover" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border"></span> {t('login_logging_in')}</span>
              ) : (
                <> {t('navbar_login_btn')} <ArrowRight size={18} style={{marginLeft: 5}}/> </>
              )}
            </button>

            <p className="signup-prompt">
              {t("login_no_account_prompt")} <Link to="/signup" className="signup-link">{t("navbar_signup_btn")}</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      <button className="chatbot-sticky-btn" aria-label="Open chatbot" onClick={onChatbotToggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
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
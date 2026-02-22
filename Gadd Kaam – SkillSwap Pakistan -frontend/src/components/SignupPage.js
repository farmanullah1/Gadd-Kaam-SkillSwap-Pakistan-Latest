import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal';
import axios from 'axios';
import { AlertCircle, User, Mail, Phone, Calendar, CreditCard, Lock, Upload } from 'lucide-react'; 

function SignupPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // File States
  const [profilePicture, setProfilePicture] = useState(null);
  const [cnicFrontPicture, setCnicFrontPicture] = useState(null);
  const [cnicBackPicture, setCnicBackPicture] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t("signup_error_passwords_mismatch"));
      setLoading(false);
      scrollToTop();
      return;
    }
    if (!gender) {
        setError(t("signup_error_gender_required"));
        setLoading(false);
        scrollToTop();
        return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('cnicNumber', cnicNumber);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (profilePicture) formData.append('profilePicture', profilePicture);
    if (cnicFrontPicture) formData.append('cnicFrontPicture', cnicFrontPicture);
    if (cnicBackPicture) formData.append('cnicBackPicture', cnicBackPicture);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Signup successful:', response.data);
      setSuccessMessage(t('signup_success_message'));
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Signup error:', err.response);
      let errorMsg = t('signup_unexpected_error');

      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMsg = err.response.data.errors.map(e => e.msg).join(' | ');
        } else if (err.response.data.msg) {
          errorMsg = err.response.data.msg;
        }
      }
      
      setError(errorMsg);
      scrollToTop();
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="signup-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* Main Section with Animated Background */}
      <main className="signup-section">
        
        {/* Glassmorphism Card */}
        <div className="signup-form-card animated-card">
          <div className="form-header">
            <h2 className="signup-title">{t("signup_join_gadd_kaam")}</h2>
            <p className="signup-subtitle">{t("signup_start_offering_finding")}</p>
          </div>

          {error && (
            <div className="error-alert shake-anim">
              <AlertCircle className="error-icon" size={24} />
              <span className="error-text">{error}</span>
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            
            {/* --- Personal Details --- */}
            <div className="form-group-row">
              <div className="form-group">
                <label><User size={16} style={{marginRight: 5}}/> {t("signup_firstName_label")}</label>
                <input type="text" placeholder={t("signup_firstName_placeholder")} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><User size={16} style={{marginRight: 5}}/> {t("signup_lastName_label")}</label>
                <input type="text" placeholder={t("signup_lastName_placeholder")} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label><Upload size={16} style={{marginRight: 5}}/> {t("signup_profilePicture_label")} <span className="size-hint">(Min 100KB, Max 10MB)</span></label>
              <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} className="file-input" />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>@{t("signup_username_label")}</label>
                <input type="text" placeholder={t("signup_username_placeholder")} value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><Phone size={16} style={{marginRight: 5}}/> {t("signup_phoneNumber_label")}</label>
                <input type="tel" placeholder="0300-1234567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label><Mail size={16} style={{marginRight: 5}}/> {t("signup_email_label")}</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><Calendar size={16} style={{marginRight: 5}}/> {t("signup_dateOfBirth_label")}</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
            </div>

            {/* --- ID Details --- */}
            <div className="form-group">
              <label><CreditCard size={16} style={{marginRight: 5}}/> {t("signup_cnicNumber_label")}</label>
              <input type="text" placeholder="XXXXX-XXXXXXX-X" value={cnicNumber} onChange={(e) => setCnicNumber(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>{t("signup_gender_label")}</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} required />
                  {t("signup_gender_male")}
                </label>
                <label className="radio-label">
                  <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} required />
                  {t("signup_gender_female")}
                </label>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>{t("signup_cnicFrontPic_label")} <span className="size-hint">(Max 6MB)</span></label>
                <input type="file" accept="image/*" onChange={(e) => setCnicFrontPicture(e.target.files[0])} className="file-input" />
              </div>
              <div className="form-group">
                <label>{t("signup_cnicBackPic_label")} <span className="size-hint">(Max 6MB)</span></label>
                <input type="file" accept="image/*" onChange={(e) => setCnicBackPicture(e.target.files[0])} className="file-input" />
              </div>
            </div>

            {/* --- Security --- */}
            <div className="form-group-row">
              <div className="form-group">
                <label><Lock size={16} style={{marginRight: 5}}/> {t("signup_password_label")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label><Lock size={16} style={{marginRight: 5}}/> {t("signup_confirmPassword_label")}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-orange create-account-btn pulse-on-hover" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border"></span> {t('signup_creating_account')}</span>
              ) : (
                t('signup_create_account_btn')
              )}
            </button>
          </form>

          <p className="login-prompt">
            {t("signup_already_have_account")} <Link to="/login" className="login-link">{t("signup_login_link")}</Link>
          </p>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
      <SuccessMessageModal isOpen={showSuccessModal} title={t("signup_success_modal_title")} message={successMessage} onClose={handleSuccessModalClose} />
    </div>
  );
}

export default SignupPage;
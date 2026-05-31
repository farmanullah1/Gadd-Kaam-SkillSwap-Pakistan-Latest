import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal';
import axios from 'axios';
import { AlertCircle, User, Mail, Phone, Calendar, CreditCard, Lock, Upload, ArrowLeft, ArrowRight, Check, UserCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react'; 

function SignupPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

  // 3D Card Tilt State
  const [tiltStyle, setTiltStyle] = useState({});

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

  // Interactive 3D tilt calculations
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt threshold of 8 degrees for the larger signup card
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
  };

  // Custom step validations
  const validateStep1 = () => {
    if (!firstName || !lastName || !username || !phoneNumber || !email || !dateOfBirth || !gender) {
      setError(t("signup_error_fill_required") || "Please fill all required personal details.");
      scrollToTop();
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!cnicNumber) {
      setError(t("signup_error_cnic_required") || "Please enter your CNIC number.");
      scrollToTop();
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("signup_error_passwords_mismatch"));
      scrollToTop();
      return;
    }

    setLoading(true);

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
    <div className="signup-page-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* Main Section with Animated Background */}
      <main className="signup-section" style={{ position: 'relative' }}>
        
        {/* Floating 3D Background Blobs */}
        <div className="form-blob-container">
          <div className="form-blob form-blob-orange"></div>
          <div className="form-blob form-blob-pink"></div>
          <div className="form-blob form-blob-blue"></div>
        </div>

        {/* 3D Interactive Tilt Glassmorphism Card */}
        <div 
          className="signup-form-card animated-card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
        >
          {/* Floating 3D Logo Icon Box */}
          <div className="form-3d-icon-outer">
            <div className="form-3d-icon-box">
              <UserCheck size={36} />
            </div>
          </div>

          <div className="form-header">
            <h2 className="signup-title">{t("signup_join_gadd_kaam")}</h2>
            <p className="signup-subtitle">{t("signup_start_offering_finding")}</p>
          </div>

          <div className="auth-value-panel signup-value-panel">
            <div className="auth-value-header">
              <ShieldCheck size={18} />
              <span>{t("auth_secure_badge")}</span>
            </div>
            <p>{t("signup_panel_desc")}</p>
            <div className="auth-value-grid">
              <span>{t("auth_trust_verified")}</span>
              <span>{t("auth_trust_cashless")}</span>
              <span>{t("auth_trust_support")}</span>
            </div>
          </div>

          {/* Stepper Wizard Progress Indicators (with 3D translate pops) */}
          <div className="stepper-container">
            <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{currentStep > 1 ? <Check size={18} /> : '1'}</div>
              <span className="step-label">{t("step_personal") || "Personal"}</span>
            </div>
            <div className={`step-line ${currentStep > 1 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}></div>
            <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-circle">{currentStep > 2 ? <Check size={18} /> : '2'}</div>
              <span className="step-label">{t("step_verification") || "Identity"}</span>
            </div>
            <div className={`step-line ${currentStep > 2 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}></div>
            <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span className="step-label">{t("step_security") || "Security"}</span>
            </div>
          </div>

          {error && (
            <div className="error-alert shake-anim">
              <AlertCircle className="error-icon" size={24} />
              <span className="error-text">{error}</span>
            </div>
          )}

          <form className="signup-form w-full overflow-hidden relative" onSubmit={handleSubmit}>
            
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                width: '300%', 
                transform: `translateX(-${(currentStep - 1) * 33.333}%)` 
              }}
            >
              {/* STEP 1: Personal Details */}
              <div className={`w-1/3 flex-shrink-0 transition-all duration-500 px-1 ${currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-20 scale-95 pointer-events-none'}`}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label><User size={16} style={{marginRight: 6}}/> {t("signup_firstName_label")}</label>
                    <input type="text" placeholder={t("signup_firstName_placeholder")} value={firstName} onChange={(e) => setFirstName(e.target.value)} required={currentStep === 1} />
                  </div>
                  <div className="form-group">
                    <label><User size={16} style={{marginRight: 6}}/> {t("signup_lastName_label")}</label>
                    <input type="text" placeholder={t("signup_lastName_placeholder")} value={lastName} onChange={(e) => setLastName(e.target.value)} required={currentStep === 1} />
                  </div>
                </div>

                <div className="form-group">
                  <label><Upload size={16} style={{marginRight: 6}}/> {t("signup_profilePicture_label")} <span className="size-hint">{t("signup_profile_size_hint")}</span></label>
                  <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} className="file-input" />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>@{t("signup_username_label")}</label>
                    <input type="text" placeholder={t("signup_username_placeholder")} value={username} onChange={(e) => setUsername(e.target.value)} required={currentStep === 1} />
                  </div>
                  <div className="form-group">
                    <label><Phone size={16} style={{marginRight: 6}}/> {t("signup_phoneNumber_label")}</label>
                    <input type="tel" placeholder={t("signup_phone_placeholder")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required={currentStep === 1} />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label><Mail size={16} style={{marginRight: 6}}/> {t("signup_email_label")}</label>
                    <input type="email" placeholder={t("signup_email_placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} required={currentStep === 1} />
                  </div>
                  <div className="form-group">
                    <label><Calendar size={16} style={{marginRight: 6}}/> {t("signup_dateOfBirth_label")}</label>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required={currentStep === 1} />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t("signup_gender_label")}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} required={currentStep === 1} />
                      {t("signup_gender_male")}
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} required={currentStep === 1} />
                      {t("signup_gender_female")}
                    </label>
                  </div>
                </div>

                <div className="stepper-actions">
                  <div></div> {/* Spacer */}
                  <button type="button" className="btn btn-primary-orange pulse-on-hover" style={{width: 'auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => { if (validateStep1()) setCurrentStep(2); }}>
                    {t("btn_next") || "Next"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* STEP 2: Identity Verification Details */}
              <div className={`w-1/3 flex-shrink-0 transition-all duration-500 px-1 ${currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-95 pointer-events-none'}`}>
                <div className="form-group">
                  <label><CreditCard size={16} style={{marginRight: 6}}/> {t("signup_cnicNumber_label")}</label>
                  <input type="text" placeholder={t("signup_cnicNumber_placeholder")} value={cnicNumber} onChange={(e) => setCnicNumber(e.target.value)} required={currentStep === 2} />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>{t("signup_cnicFrontPic_label")} <span className="size-hint">{t("signup_cnic_size_hint")}</span></label>
                    <input type="file" accept="image/*" onChange={(e) => setCnicFrontPicture(e.target.files[0])} className="file-input" />
                  </div>
                  <div className="form-group">
                    <label>{t("signup_cnicBackPic_label")} <span className="size-hint">{t("signup_cnic_size_hint")}</span></label>
                    <input type="file" accept="image/*" onChange={(e) => setCnicBackPicture(e.target.files[0])} className="file-input" />
                  </div>
                </div>

                <div className="stepper-actions">
                  <button type="button" className="btn-secondary-back" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft size={18} /> {t("btn_back") || "Back"}
                  </button>
                  <button type="button" className="btn btn-primary-orange pulse-on-hover" style={{width: 'auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => { if (validateStep2()) setCurrentStep(3); }}>
                    {t("btn_next") || "Next"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* STEP 3: Security & Passwords */}
              <div className={`w-1/3 flex-shrink-0 transition-all duration-500 px-1 ${currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-20 scale-95 pointer-events-none'}`}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label><Lock size={16} style={{marginRight: 6}}/> {t("signup_password_label")}</label>
                    <div className="password-field-shell">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required={currentStep === 3} />
                      <button
                        type="button"
                        className="password-visibility-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t("auth_hide_password") : t("auth_show_password")}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label><Lock size={16} style={{marginRight: 6}}/> {t("signup_confirmPassword_label")}</label>
                    <div className="password-field-shell">
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={currentStep === 3} />
                      <button
                        type="button"
                        className="password-visibility-btn"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? t("auth_hide_password") : t("auth_show_password")}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="stepper-actions">
                  <button type="button" className="btn-secondary-back" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft size={18} /> {t("btn_back") || "Back"}
                  </button>
                  <button type="submit" className="btn btn-primary-orange pulse-on-hover" disabled={loading} style={{width: 'auto', padding: '1rem 2rem'}}>
                    {loading ? (
                      <span><span className="spinner-border"></span> {t('signup_creating_account')}</span>
                    ) : (
                      t('signup_create_account_btn')
                    )}
                  </button>
                </div>
              </div>
            </div>

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

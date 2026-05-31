// src/pages/SafetyTipsPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { ShieldAlert, Users, PhoneCall, AlertOctagon, Sparkles, MapPin, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


function SafetyTipsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const tips = [
    {
      title: t("safety_page_tip1_title"),
      desc: t("safety_page_tip1_desc"),
      icon: <ShieldCheckIcon />,
      accent: "var(--primary-orange)"
    },
    {
      title: t("safety_page_tip2_title"),
      desc: t("safety_page_tip2_desc"),
      icon: <MapPin size={28} />,
      accent: "#3b82f6"
    },
    {
      title: t("safety_page_tip3_title"),
      desc: t("safety_page_tip3_desc"),
      icon: <Eye size={28} />,
      accent: "#ec4899"
    },
    {
      title: t("safety_page_tip4_title"),
      desc: t("safety_page_tip4_desc"),
      icon: <Users size={28} />,
      accent: "#e11d48"
    }
  ];

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="content-container" style={{ marginTop: '2rem' }}>
        
        {/* Title Header */}
        <header className="content-hero-section reveal fade-up" style={{ paddingTop: '3rem' }}>
          <span className="landing-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("safety_page_badge")}
          </span>
          <h1>{t("safety_page_title")}</h1>
          <p>{t("safety_page_subtitle")}</p>
        </header>

        {/* Informative Visual Panel */}
        <section className="safety-notice-banner reveal fade-up">
          <div className="flex-container">
            <div className="notice-icon-box red-glow">
              <AlertOctagon size={32} />
            </div>
            <div className="notice-text">
              <h3>{t("safety_page_report_title")}</h3>
              <p>{t("safety_page_report_desc")}</p>
            </div>
          </div>
        </section>

        {/* Tips Layout Grid */}
        <section className="grid-two-col reveal fade-up">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className="card-3d reveal fade-up" 
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div 
                className="safety-indicator-bar" 
                style={{ background: tip.accent }} 
              />

              <div className="safety-card-flex">
                <div 
                  className="safety-icon-wrapper" 
                  style={{ color: tip.accent, background: `${tip.accent}14` }}
                >
                  {tip.icon}
                </div>
                <div className="safety-card-text">
                  <h3>{tip.title}</h3>
                  <p>{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Vetted Badges System Banner */}
        <section className="vetted-cta-banner reveal fade-up">
          <Sparkles size={32} style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }} />
          <h2>{t("safety_page_badge_title")}</h2>
          <p>{t("safety_page_badge_desc")}</p>
          <button 
            className="btn btn-signup vetted-cta-btn" 
            onClick={() => setShowHelplinePopup(true)}
          >
            <PhoneCall size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> {t("safety_page_badge_btn")}
          </button>
        </section>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

// Simple internal helper component for shield check icon
function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

export default SafetyTipsPage;

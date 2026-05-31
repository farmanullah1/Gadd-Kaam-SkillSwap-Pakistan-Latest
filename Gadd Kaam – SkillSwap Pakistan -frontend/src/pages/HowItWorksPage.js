// src/pages/HowItWorksPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { CheckCircle2, Coins, Compass, Shield, UserPlus, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


function HowItWorksPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const steps = [
    {
      title: t("how_page_step1_title"),
      desc: t("how_page_step1_desc"),
      icon: <UserPlus size={32} />,
      color: "var(--primary-orange)"
    },
    {
      title: t("how_page_step2_title"),
      desc: t("how_page_step2_desc"),
      icon: <Compass size={32} />,
      color: "#3b82f6"
    },
    {
      title: t("how_page_step3_title"),
      desc: t("how_page_step3_desc"),
      icon: <Zap size={32} />,
      color: "#ec4899"
    },
    {
      title: t("how_page_step4_title"),
      desc: t("how_page_step4_desc"),
      icon: <CheckCircle2 size={32} />,
      color: "#10b981"
    }
  ];

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="content-container" style={{ marginTop: '2rem' }}>
        
        {/* Header */}
        <header className="content-hero-section reveal fade-up" style={{ paddingTop: '3rem' }}>
          <span className="landing-badge">{t("how_page_badge")}</span>
          <h1>{t("how_page_title")}</h1>
          <p>{t("how_page_subtitle")}</p>
        </header>

        {/* Vision Statement Panel */}
        <div className="glass-panel reveal fade-up">
          <div className="timeline-flex-wrapper">
            <div 
              className="step-icon-box" 
              style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, #ff8c00 100%)', boxShadow: '0 10px 25px hsl(var(--primary-hsl) / 20%)', flexShrink: 0 }}
            >
              <Coins size={36} />
            </div>
            <div className="step-info-text">
              <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', color: 'var(--primary-orange)', fontWeight: '700' }}>
                {t("how_page_ethos_title")}
              </h3>
              <p style={{ margin: 0, lineHeight: '1.6' }}>
                {t("how_page_ethos_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Steps Timeline Navigation */}
        <div className="timeline-tabs reveal fade-up">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`timeline-tab-btn ${activeStep === index ? 'active' : ''}`}
            >
              {t("how_page_step_btn")} {index + 1}
            </button>
          ))}
        </div>

        {/* Selected Step Card Details */}
        <div className="timeline-step-detail reveal fade-up" style={{ border: `1px solid ${steps[activeStep].color}33`, marginBottom: '4rem' }}>
          {/* Subtle colored mesh highlight */}
          <div 
            className="glow-bg-mesh"
            style={{ 
              background: `radial-gradient(circle, ${steps[activeStep].color} 0%, transparent 70%)`
            }} 
          />

          <div className="timeline-flex-wrapper">
            <div 
              className="step-icon-box"
              style={{ 
                background: steps[activeStep].color, 
                boxShadow: `0 15px 30px ${steps[activeStep].color}40`,
                flexShrink: 0
              }}
            >
              {steps[activeStep].icon}
            </div>

            <div className="step-info-text">
              <h2>{steps[activeStep].title}</h2>
              <p>{steps[activeStep].desc}</p>
            </div>
          </div>
        </div>

        {/* Core Pillars / Barter Rules */}
        <h2 className="reveal fade-up" style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '2.5rem' }}>
          {t("how_page_conduct_title")}
        </h2>
        
        <div className="grid-three-col">
          <div className="card-3d pillar-top-border reveal fade-up">
            <Shield size={24} style={{ color: 'var(--primary-orange)', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.6rem', color: 'var(--text-dark)' }}>
              {t("how_page_conduct_s1_title")}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-medium)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {t("how_page_conduct_s1_desc")}
            </p>
          </div>

          <div className="card-3d pillar-blue-border reveal fade-up" style={{ transitionDelay: '0.15s' }}>
            <Coins size={24} style={{ color: '#3b82f6', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.6rem', color: 'var(--text-dark)' }}>
              {t("how_page_conduct_s2_title")}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-medium)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {t("how_page_conduct_s2_desc")}
            </p>
          </div>

          <div className="card-3d pillar-green-border reveal fade-up" style={{ transitionDelay: '0.3s' }}>
            <CheckCircle2 size={24} style={{ color: '#10b981', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.6rem', color: 'var(--text-dark)' }}>
              {t("how_page_conduct_s3_title")}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-medium)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {t("how_page_conduct_s3_desc")}
            </p>
          </div>
        </div>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default HowItWorksPage;

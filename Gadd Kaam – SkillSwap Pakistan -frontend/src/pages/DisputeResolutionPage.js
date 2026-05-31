// src/pages/DisputeResolutionPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { AlertCircle, Scale, ShieldAlert, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


function DisputeResolutionPage({ onChatbotToggle }) {
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

  const steps = [
    { num: "01", title: t("dispute_s1_title"), desc: t("dispute_s1_desc"), accent: "var(--primary-orange)" },
    { num: "02", title: t("dispute_s2_title"), desc: t("dispute_s2_desc"), accent: "#3b82f6" },
    { num: "03", title: t("dispute_s3_title"), desc: t("dispute_s3_desc"), accent: "#10b981", lists: [t("dispute_s3_l1"), t("dispute_s3_l2"), t("dispute_s3_l3")] }
  ];

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <header className="content-hero-section reveal fade-up">
        <span className="landing-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <Scale size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("dispute_badge") || "Fair Swap Guarantee"}
        </span>
        <h1>{t("dispute_title")}</h1>
        <p>{t("dispute_subtitle")}</p>
      </header>

      <main className="content-container">
        {/* Core Informative Glass Panel */}
        <section className="glass-panel reveal fade-up">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Scale style={{ color: 'var(--primary-orange)' }} /> {t("dispute_how_title")}
          </h2>
          <p style={{ color: 'var(--text-medium)', lineHeight: '1.7', margin: 0, fontSize: '1.05rem' }}>
            {t("dispute_how_desc")}
          </p>
        </section>

        {/* Dynamic 3D Steps Cards Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="reveal fade-up" style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '2.5rem' }}>
            {t("dispute_workflow_title") || "Resolution Protocol"}
          </h2>
          <div className="grid-three-col">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="card-3d reveal fade-up" 
                style={{ 
                  borderTop: `4px solid ${step.accent}`,
                  transitionDelay: `${index * 0.15}s`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: step.accent, opacity: '0.6' }}>
                    {step.num}
                  </span>
                  <Sparkles size={16} style={{ color: step.accent }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '0.8rem' }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-medium)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
                {step.lists && (
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                    {step.lists.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Warn Alert Notice Banner */}
        <section className="safety-notice-banner reveal fade-up">
          <div className="flex-container">
            <div className="notice-icon-box red-glow">
              <ShieldAlert size={32} />
            </div>
            <div className="notice-text">
              <h3>{t("dispute_note_title")}</h3>
              <p>{t("dispute_note_desc")}</p>
            </div>
          </div>
        </section>

        {/* Support Helpline CTA */}
        <section 
          className="vetted-cta-banner reveal fade-up" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(239, 68, 68, 0.03) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.15)'
          }}
        >
          <AlertCircle size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
          <h2>{t("dispute_help_title") || "Escalate to Mediation Support"}</h2>
          <p>
            {t("dispute_help_desc") || "If mutual negotiations fail or the barter partner breaches trust guidelines, open an official ticket for assistance."}
          </p>
          <button 
            className="btn btn-signup vetted-cta-btn" 
            onClick={() => setShowHelplinePopup(true)}
            style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#ffffff' }}
          >
            {t("dispute_help_btn") || "File Dispute Ticket"}
          </button>
        </section>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default DisputeResolutionPage;
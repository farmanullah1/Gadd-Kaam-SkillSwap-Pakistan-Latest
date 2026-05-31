// src/pages/AboutUsPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


function AboutUsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useScrollReveal(); // Trigger scroll animations

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const teamMembers = [
    { name: "Bilal Khan", role: t("about_role_lead") || "Lead Architect", initial: "BK", desc: t("about_desc_bk") || "Passionate about leveraging technology to empower local communities in Pakistan." },
    { name: "Ayesha Ahmed", role: t("about_role_dev") || "Frontend Engineer", initial: "AA", desc: t("about_desc_aa") || "Crafting rich, interactive, and beautiful user interfaces with high accessibility." },
    { name: "Farhan Ali", role: t("about_role_community") || "Community Lead", initial: "FA", desc: t("about_desc_fa") || "Connecting creators and fostering sustainable skill exchanges across cities." }
  ];

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <header className="content-hero-section reveal fade-up">
        <span className="landing-badge">{t("about_badge") || "Our Ethos"}</span>
        <h1>{t("about_title")}</h1>
        <p>{t("about_subtitle")}</p>
      </header>

      <main className="content-container">
        {/* Core Mission and Pillars */}
        <section className="glass-panel reveal fade-up">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
            {t("about_mission_title")}
          </h2>
          <p style={{ color: 'var(--text-medium)', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            {t("about_mission_desc")}
          </p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
            {t("about_fyp_title")}
          </h2>
          <p style={{ color: 'var(--text-medium)', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            {t("about_fyp_desc")}
          </p>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '1.25rem' }}>
            {t("about_why_title")}
          </h2>
          <p style={{ color: 'var(--text-medium)', lineHeight: '1.7', margin: 0, fontSize: '1.05rem' }}>
            {t("about_why_desc")}
          </p>
        </section>

        {/* Dynamic Interactive Team Section */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 className="reveal fade-up" style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '2.5rem' }}>
            {t("about_team_title") || "Meet the Visionaries"}
          </h2>
          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="card-3d team-member-card reveal fade-up"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="team-avatar-box">
                  {member.initial}
                </div>
                <h4>{member.name}</h4>
                <span>{member.role}</span>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default AboutUsPage;
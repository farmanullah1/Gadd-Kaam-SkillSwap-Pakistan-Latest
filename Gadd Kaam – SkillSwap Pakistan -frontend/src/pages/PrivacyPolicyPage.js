// src/pages/PrivacyPolicyPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { ShieldCheck, Info, Database, Eye, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


const PrivacyPolicyPage = ({ onChatbotToggle }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useScrollReveal(); // Trigger scroll animations

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <header className="content-hero-section reveal fade-up">
        <span className="landing-badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("privacy_badge") || "Protected Privacy"}
        </span>
        <h1>{t("privacy_title")}</h1>
        <p>{t("privacy_updated")}</p>
      </header>

      <main className="content-container">
        <div className="legal-split-layout">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="legal-sidebar reveal fade-up">
            <span className="sidebar-heading">{t("privacy_sidebar_title") || "Sections"}</span>
            
            <button 
              className={`sidebar-nav-link ${activeSection === 'intro' ? 'active' : ''}`}
              onClick={() => scrollToSection('intro')}
            >
              <Info size={16} style={{ marginRight: '8px' }} />
              {t("privacy_intro_title") || "1. Introduction"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 'collect' ? 'active' : ''}`}
              onClick={() => scrollToSection('collect')}
            >
              <Database size={16} style={{ marginRight: '8px' }} />
              {t("privacy_collect_title") || "2. Data Collection"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 'use' ? 'active' : ''}`}
              onClick={() => scrollToSection('use')}
            >
              <Eye size={16} style={{ marginRight: '8px' }} />
              {t("privacy_use_title") || "3. How We Use Data"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 'sec' ? 'active' : ''}`}
              onClick={() => scrollToSection('sec')}
            >
              <Lock size={16} style={{ marginRight: '8px' }} />
              {t("privacy_sec_title") || "4. Security Protocols"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              <Mail size={16} style={{ marginRight: '8px' }} />
              {t("privacy_contact_title") || "5. Get In Touch"}
            </button>
          </aside>

          {/* Main Legal Content Panel */}
          <div className="legal-main-content reveal fade-up">
            
            <section id="intro">
              <h3><Info size={22} style={{ color: 'var(--primary-orange)' }} /> {t("privacy_intro_title")}</h3>
              <div className="legal-callout">
                <p>{t("privacy_legal_summary") || "Summary: We respect your privacy, exchange without money, and keep your contact metrics secure."}</p>
              </div>
              <p>{t("privacy_intro_desc")}</p>
            </section>

            <section id="collect">
              <h3><Database size={22} style={{ color: '#3b82f6' }} /> {t("privacy_collect_title")}</h3>
              <p>{t("privacy_collect_intro") || "We gather details that help connect swaps and maintain safety filters across Pakistan:"}</p>
              <ul>
                <li>{t("privacy_collect_l1")}</li>
                <li>{t("privacy_collect_l2")}</li>
                <li>{t("privacy_collect_l3")}</li>
                <li>{t("privacy_collect_l4")}</li>
              </ul>
            </section>

            <section id="use">
              <h3><Eye size={22} style={{ color: '#ec4899' }} /> {t("privacy_use_title")}</h3>
              <p>{t("privacy_use_desc")}</p>
              <ul>
                <li>{t("privacy_use_l1")}</li>
                <li>{t("privacy_use_l2")}</li>
                <li>{t("privacy_use_l3")}</li>
                <li>{t("privacy_use_l4")}</li>
              </ul>
            </section>

            <section id="sec">
              <h3><Lock size={22} style={{ color: '#10b981' }} /> {t("privacy_sec_title")}</h3>
              <p>{t("privacy_sec_desc")}</p>
            </section>

            <section id="contact">
              <h3><Mail size={22} style={{ color: 'var(--primary-orange)' }} /> {t("privacy_contact_title")}</h3>
              <p>
                {t("privacy_contact_desc")} <a href="/contact-us" style={{ color: 'var(--primary-orange)', fontWeight: '600' }}>{t("navbar_contact")}</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
};

export default PrivacyPolicyPage;
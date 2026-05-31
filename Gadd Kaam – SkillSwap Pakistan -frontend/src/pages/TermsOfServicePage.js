// src/pages/TermsOfServicePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { Scale, BookOpen, UserCheck, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


const TermsOfServicePage = ({ onChatbotToggle }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [activeSection, setActiveSection] = useState('s1');

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
        <span className="landing-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <Scale size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("terms_badge") || "Community Rules"}
        </span>
        <h1>{t("terms_title")}</h1>
        <p>{t("terms_subtitle")}</p>
      </header>

      <main className="content-container">
        <div className="legal-split-layout">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="legal-sidebar reveal fade-up">
            <span className="sidebar-heading">{t("terms_sidebar_title") || "Chapters"}</span>
            
            <button 
              className={`sidebar-nav-link ${activeSection === 's1' ? 'active' : ''}`}
              onClick={() => scrollToSection('s1')}
            >
              <FileText size={16} style={{ marginRight: '8px' }} />
              {t("terms_s1_title") || "1. Acceptance"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 's2' ? 'active' : ''}`}
              onClick={() => scrollToSection('s2')}
            >
              <BookOpen size={16} style={{ marginRight: '8px' }} />
              {t("terms_s2_title") || "2. Platform Role"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 's3' ? 'active' : ''}`}
              onClick={() => scrollToSection('s3')}
            >
              <UserCheck size={16} style={{ marginRight: '8px' }} />
              {t("terms_s3_title") || "3. Conduct Rules"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 's4' ? 'active' : ''}`}
              onClick={() => scrollToSection('s4')}
            >
              <AlertTriangle size={16} style={{ marginRight: '8px' }} />
              {t("terms_s4_title") || "4. Liability Limit"}
            </button>

            <button 
              className={`sidebar-nav-link ${activeSection === 's5' ? 'active' : ''}`}
              onClick={() => scrollToSection('s5')}
            >
              <RefreshCw size={16} style={{ marginRight: '8px' }} />
              {t("terms_s5_title") || "5. Policy Changes"}
            </button>
          </aside>

          {/* Main Legal Content Panel */}
          <div className="legal-main-content reveal fade-up">
            
            <section id="s1">
              <h3><FileText size={22} style={{ color: 'var(--primary-orange)' }} /> {t("terms_s1_title")}</h3>
              <p>{t("terms_s1_desc")}</p>
            </section>

            <section id="s2">
              <h3><BookOpen size={22} style={{ color: '#3b82f6' }} /> {t("terms_s2_title")}</h3>
              <div className="legal-callout">
                <p>{t("terms_s2_desc")}</p>
              </div>
            </section>

            <section id="s3">
              <h3><UserCheck size={22} style={{ color: '#10b981' }} /> {t("terms_s3_title")}</h3>
              <p>{t("terms_s3_desc")}</p>
              <ul>
                <li>{t("terms_s3_l1")}</li>
                <li>{t("terms_s3_l2")}</li>
                <li>{t("terms_s3_l3")}</li>
                <li>{t("terms_s3_l4")}</li>
              </ul>
            </section>

            <section id="s4">
              <h3><AlertTriangle size={22} style={{ color: '#ef4444' }} /> {t("terms_s4_title")}</h3>
              <p>{t("terms_s4_desc")}</p>
            </section>

            <section id="s5">
              <h3><RefreshCw size={22} style={{ color: '#ec4899' }} /> {t("terms_s5_title")}</h3>
              <p>{t("terms_s5_desc")}</p>
            </section>

          </div>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
};

export default TermsOfServicePage;
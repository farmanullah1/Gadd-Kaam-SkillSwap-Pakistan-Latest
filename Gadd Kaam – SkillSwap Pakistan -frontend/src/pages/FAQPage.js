// src/pages/FAQPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';


function FAQPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0); // Default open first item

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    { q: t("faq_page_q1"), a: t("faq_page_a1") },
    { q: t("faq_page_q2"), a: t("faq_page_a2") },
    { q: t("faq_page_q3"), a: t("faq_page_a3") },
    { q: t("faq_page_q4"), a: t("faq_page_a4") }
  ];

  return (
    <div className="content-page-layout">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <header className="content-hero-section reveal fade-up">
        <span className="landing-badge" style={{ background: 'rgba(255, 126, 41, 0.1)', color: 'var(--primary-orange)' }}>
          <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("faq_page_badge") || "Support Center"}
        </span>
        <h1>{t("faq_page_title")}</h1>
        <p>{t("faq_page_subtitle") || "Answers to the most common questions about money-less bartering in Pakistan."}</p>
      </header>

      <main className="content-container">
        {/* Accordion Group */}
        <div className="faq-accordion-group reveal fade-up">
          {faqs.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-accordion-item ${isExpanded ? 'expanded' : ''}`}
              >
                <button 
                  className="faq-question-header"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isExpanded}
                >
                  <span>
                    <HelpCircle size={20} style={{ marginRight: '12px', color: isExpanded ? 'var(--primary-orange)' : 'var(--text-light)', flexShrink: 0 }} />
                    {item.q}
                  </span>
                  <ChevronDown className="faq-chevron" size={18} />
                </button>
                <div 
                  className="faq-answer-panel"
                  style={{ maxHeight: isExpanded ? '250px' : '0' }}
                >
                  <div className="faq-answer-content">
                    <p style={{ margin: 0, lineHeight: '1.7' }}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Helpdesk CTA card */}
        <div 
          className="card-3d reveal fade-up" 
          style={{ 
            padding: '2.5rem', 
            textAlign: 'center', 
            marginBottom: '5rem',
            background: 'linear-gradient(135deg, hsl(var(--primary-hsl) / 2%) 0%, rgba(59, 130, 246, 0.02) 100%)' 
          }}
        >
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.8rem' }}>
            {t("faq_unresolved_title") || "Still Have Questions?"}
          </h3>
          <p style={{ color: 'var(--text-medium)', maxWidth: '600px', margin: '0 auto 1.8rem auto', lineHeight: '1.6' }}>
            {t("faq_unresolved_desc") || "Our support team is available 24/7 to guide you through verification, disputing exchanges, or getting started."}
          </p>
          <button 
            className="btn btn-signup" 
            style={{ padding: '0.8rem 2.2rem', cursor: 'pointer' }}
            onClick={() => setShowHelplinePopup(true)}
          >
            {t("faq_unresolved_btn") || "Contact Support Helpline"}
          </button>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default FAQPage;
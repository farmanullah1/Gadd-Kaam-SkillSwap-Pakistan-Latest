// src/pages/HelpCenterPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, User, Shield, HelpCircle, AlertOctagon, Send, FileText } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function HelpCenterPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setTicketSuccess(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setTicketSuccess(false), 5000);
  };

  const faqs = [
    {
      q: t("landing_faq_q1") || "Is there really no cash involved?",
      a: t("landing_faq_a1") || "Yes, absolutely! Gadd Kaam operates strictly on a cashless system where you barter one hour of your talent for one hour of someone else's.",
      cat: "mechanics"
    },
    {
      q: t("landing_faq_q2") || "How is safety guaranteed?",
      a: t("landing_faq_a2") || "All accounts require CNIC verification, profile vetting, and secure remote escrow confirmations to protect both swappers.",
      cat: "safety"
    },
    {
      q: t("landing_faq_q3") || "Can I swap remote services?",
      a: t("landing_faq_a3") || "Yes! Gadd Kaam supports both in-person local swaps and completely digital/remote swaps (like graphic design or coding).",
      cat: "mechanics"
    },
    {
      q: t("landing_faq_q4") || "What is the Women-Only Zone?",
      a: t("landing_faq_a4") || "A secure, verified private safe space exclusively visible to female swappers to practice safe and comfortable barter.",
      cat: "safety"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="helpcenter-page-container">
      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="helpcenter-main">
        {/* Header Block */}
        <div className="helpcenter-header reveal fade-up">
          <span className="landing-badge">{t("support_badge")}</span>
          <h1 className="reveal fade-up">{t("support_page_title") || "Gadd Kaam Help Center"}</h1>
          <p className="reveal fade-up">{t("support_page_subtitle") || "How can we assist you today? Search our self-help topics or submit a request."}</p>

          <div className="helpcenter-search reveal fade-up">
            <Search size={20} style={{ color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder={t("support_search_placeholder") || "Search support articles (e.g. 'verification', 'escrow')..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="helpcenter-categories reveal fade-up">
          <div className="help-cat-card">
            <div className="help-cat-icon"><User size={24} /></div>
            <h3>{t("support_cat_account") || "Account & Profile"}</h3>
          </div>
          <div className="help-cat-card">
            <div className="help-cat-icon"><Shield size={24} /></div>
            <h3>{t("support_cat_safety") || "Safety & CNIC Verification"}</h3>
          </div>
          <div className="help-cat-card">
            <div className="help-cat-icon"><HelpCircle size={24} /></div>
            <h3>{t("support_cat_mechanics") || "Barter Mechanics"}</h3>
          </div>
          <div className="help-cat-card">
            <div className="help-cat-icon"><AlertOctagon size={24} /></div>
            <h3>{t("support_cat_disputes") || "Dispute Settlement"}</h3>
          </div>
        </div>

        {/* FAQ Accordions */}
        <h2 className="faq-section-title reveal fade-up">{t("landing_faq_title") || "Frequently Swapped Queries"}</h2>
        <div className="faq-list reveal fade-up">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button className="faq-question-btn" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && (
                <div className="faq-answer">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ticket Form Card */}
        <div className="ticket-form-card reveal scale-up">
          <h2>{t("support_submit_request") || "Submit a Support Ticket"}</h2>
          {ticketSuccess && (
            <div style={{ background: '#dcfce7', border: '1px solid #22c55e', color: '#16a34a', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
              {t("support_ticket_success") || "Support ticket submitted successfully! Our team will contact you shortly."}
            </div>
          )}
          <form onSubmit={handleFormSubmit}>
            <div className="helpcenter-form-group">
              <label>{t("support_form_subject") || "Subject of Inquiry"}</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder={t("support_subject_placeholder")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="helpcenter-form-group">
              <label>{t("support_form_message") || "Describe your issue in detail..."}</label>
              <textarea 
                className="textarea-field" 
                rows="5"
                placeholder={t("support_message_placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button type="submit" className="btn btn-primary-orange animate-glow" style={{ padding: '0.8rem 3rem', gap: '8px' }}>
                <Send size={18} /> {t("support_form_submit") || "Send Support Ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default HelpCenterPage;

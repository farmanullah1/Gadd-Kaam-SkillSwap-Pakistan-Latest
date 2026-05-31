// src/pages/ContactUsPage.js
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle,
  MessageSquare, Twitter, Linkedin, Github, HeadphonesIcon
} from 'lucide-react';


function ContactUsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '', category: ''
  });
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    // Simulate async send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const infoCards = [
    {
      icon: <Mail size={22} />,
      colorClass: 'orange',
      title: t('contact_email_lbl'),
      content: 'support@gaddkaam.com',
      isLink: true,
      href: 'mailto:support@gaddkaam.com',
    },
    {
      icon: <Phone size={22} />,
      colorClass: 'blue',
      title: t('phone_label'),
      content: '+92 300 1234567',
      isLink: true,
      href: 'tel:+923001234567',
    },
    {
      icon: <MapPin size={22} />,
      colorClass: 'green',
      title: t('contact_address_lbl'),
      content: t('contact_address_val'),
      isLink: false,
    },
    {
      icon: <Clock size={22} />,
      colorClass: 'purple',
      title: t('contact_hours_lbl') || 'Support Hours',
      content: t('contact_hours_val') || 'Mon–Fri: 9am–6pm PKT',
      isLink: false,
      showAvailability: true,
    },
  ];

  const offices = [
    { city: 'Karachi', detail: t('contact_office_karachi') || 'Main Office – Block 4, PECHS, Karachi, Sindh' },
    { city: 'Lahore', detail: t('contact_office_lahore') || 'Regional Office – Gulberg III, Lahore, Punjab' },
    { city: 'Islamabad', detail: t('contact_office_islamabad') || 'Operations Hub – F-7 Markaz, Islamabad' },
    { city: 'Peshawar', detail: t('contact_office_peshawar') || 'KPK Hub – University Road, Peshawar' },
  ];

  return (
    <div className="contact-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      {/* ─── HERO ─── */}
      <section className="contact-hero">
        <div className="contact-hero-blob contact-hero-blob-1" />
        <div className="contact-hero-blob contact-hero-blob-2" />
        <div className="contact-hero-blob contact-hero-blob-3" />
        <div className="contact-hero-ring" />
        <div className="contact-hero-ring-inner" />

        <div className="contact-hero-content">
          <div className="contact-hero-badge">
            <HeadphonesIcon size={14} />
            {t('contact_badge') || 'We\'re Here To Help'}
          </div>
          <h1>
            {t('contact_hero_title_line1') || 'Get in'}{' '}
            <span>{t('contact_hero_title_line2') || 'Touch With Us'}</span>
          </h1>
          <p>{t('contact_subtitle') || 'Have a question, suggestion, or issue? Our team responds within 24 hours.'}</p>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="contact-main">
        <div className="contact-grid">

          {/* INFO COLUMN */}
          <div className="contact-info-col">
            {infoCards.map((card, i) => (
              <div className="contact-info-card" key={i}>
                <div className={`contact-info-icon-box ${card.colorClass}`}>
                  {card.icon}
                </div>
                <div className="contact-info-text">
                  <h4>{card.title}</h4>
                  {card.isLink
                    ? <a href={card.href}>{card.content}</a>
                    : <p>{card.content}</p>
                  }
                  {card.showAvailability && (
                    <div className="contact-availability">
                      <span className="contact-availability-dot" />
                      {t('contact_online_now') || 'Online Now'}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="contact-info-card" style={{ flexDirection: 'column', gap: '0.8rem' }}>
              <div className="contact-info-text">
                <h4 style={{ marginBottom: '0.5rem' }}>{t('contact_follow_us') || 'Follow Us'}</h4>
              </div>
              <div className="contact-social-row">
                <a href="#!" className="contact-social-link"><Twitter size={14} /> Twitter</a>
                <a href="#!" className="contact-social-link"><Linkedin size={14} /> LinkedIn</a>
                <a href="#!" className="contact-social-link"><Github size={14} /> GitHub</a>
                <a href="#!" className="contact-social-link"><MessageSquare size={14} /> Discord</a>
              </div>
            </div>
          </div>

          {/* FORM COLUMN */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              {submitted ? (
                <div className="contact-success-message">
                  <div className="contact-success-icon">
                    <CheckCircle size={32} />
                  </div>
                  <h3>{t('contact_sent_title') || 'Message Sent!'}</h3>
                  <p>{t('contact_sent_desc') || 'Thank you for reaching out. Our team will get back to you within 24 hours.'}</p>
                  <button
                    className="contact-submit-btn"
                    style={{ marginTop: '1rem', width: 'auto', padding: '0.75rem 2rem' }}
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '', category: '' }); setCharCount(0); }}
                  >
                    {t('contact_send_another') || 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="contact-form-title">{t('contact_form_title') || 'Send Us a Message'}</h2>
                  <p className="contact-form-subtitle">{t('contact_form_subtitle') || 'Fill in the form and we\'ll respond as soon as possible.'}</p>

                  <form onSubmit={handleSubmit}>
                    <div className="contact-form-row">
                      <div className="contact-form-group">
                        <label className="contact-form-label">
                          {t('contact_name_lbl')} <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="contact-form-input"
                          placeholder={t('contact_name_ph') || 'Your full name'}
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="contact-form-group">
                        <label className="contact-form-label">
                          {t('contact_email_lbl')} <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="contact-form-input"
                          placeholder={t('contact_email_ph') || 'your@email.com'}
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">
                        {t('contact_category_lbl') || 'Category'}
                      </label>
                      <select
                        name="category"
                        className="contact-form-select"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">{t('contact_category_ph') || 'Select a topic...'}</option>
                        <option value="general">{t('contact_cat_general') || 'General Inquiry'}</option>
                        <option value="support">{t('contact_cat_support') || 'Technical Support'}</option>
                        <option value="billing">{t('contact_cat_billing') || 'Billing & Payments'}</option>
                        <option value="dispute">{t('contact_cat_dispute') || 'Dispute Resolution'}</option>
                        <option value="feedback">{t('contact_cat_feedback') || 'Feedback & Suggestions'}</option>
                        <option value="partnership">{t('contact_cat_partner') || 'Partnership'}</option>
                      </select>
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">
                        {t('contact_subject_lbl') || 'Subject'}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        className="contact-form-input"
                        placeholder={t('contact_subject_ph') || 'Brief summary of your issue'}
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="contact-form-group">
                      <label className="contact-form-label">
                        {t('contact_msg_lbl')} <span className="required">*</span>
                      </label>
                      <textarea
                        name="message"
                        className="contact-form-textarea"
                        placeholder={t('contact_msg_ph') || 'Describe your issue or question in detail...'}
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={2000}
                        required
                      />
                      <div className="contact-char-count">{charCount}/2000</div>
                    </div>

                    <button type="submit" className="contact-submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'contactSpinSlow 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          {t('contact_sending') || 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          {t('contact_send_btn')}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ─── OFFICES ─── */}
      <section className="contact-office-section">
        <h2 className="contact-office-title">{t('contact_our_offices') || 'Our Offices'}</h2>
        <div className="contact-office-grid">
          {offices.map((office, i) => (
            <div className="contact-office-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <h4>📍 {office.city}</h4>
              <p>{office.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default ContactUsPage;
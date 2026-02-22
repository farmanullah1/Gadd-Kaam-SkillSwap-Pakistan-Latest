// src/components/TermsOfServicePage.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';

const TermsOfServicePage = ({ onChatbotToggle }) => {
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

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

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="section-container" style={{ maxWidth: '900px', padding: '4rem 1.5rem' }}>
        <h1 className="section-title">Terms of Service</h1>
        <p className="section-subtitle">Please read these terms carefully before using our service.</p>

        <div className="card-panel" style={{ padding: '3rem', marginTop: '2rem' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h3>1. Acceptance of Terms</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              By accessing and using <strong>Gadd Kaam</strong>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>2. Educational Project Disclaimer</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6', borderLeft: '4px solid var(--primary-orange)', paddingLeft: '15px' }}>
              <strong>Please Note:</strong> This platform is developed as a Final Year Project (FYP). While fully functional, it is intended primarily for educational and demonstration purposes. The developers are not liable for any real-world service disputes arising from swaps arranged here.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>3. User Conduct</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              You agree not to use the Service to:
            </p>
            <ul style={{ marginLeft: '20px', color: 'var(--text-medium)', lineHeight: '1.6', listStyleType: 'disc' }}>
              <li>Violate any local, state, national, or international law.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Post content that is hateful, threatening, or pornographic.</li>
              <li>Impersonate any person or entity or falsely state your affiliation with a person or entity.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>4. Account Termination</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h3>5. Changes to Terms</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
};

export default TermsOfServicePage;
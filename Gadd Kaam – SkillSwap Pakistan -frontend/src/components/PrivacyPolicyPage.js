// src/components/PrivacyPolicyPage.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';

const PrivacyPolicyPage = ({ onChatbotToggle }) => {
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
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-subtitle">Last Updated: January 2026</p>

        <div className="card-panel" style={{ padding: '3rem', marginTop: '2rem' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h3>1. Introduction</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              Welcome to <strong>Gadd Kaam (SkillSwap Pakistan)</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>2. Data We Collect</h3>
            <ul style={{ marginLeft: '20px', color: 'var(--text-medium)', lineHeight: '1.6', listStyleType: 'disc' }}>
              <li><strong>Identity Data:</strong> First name, last name, username, and profile pictures.</li>
              <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
              <li><strong>Verification Data:</strong> CNIC images (used strictly for verification purposes in the Women-Only Zone).</li>
              <li><strong>Technical Data:</strong> IP address and browser type (for security logs).</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>3. How We Use Your Data</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              We will only use your personal data when the law allows us to. Most commonly, we use your personal data in the following circumstances:
            </p>
            <ul style={{ marginLeft: '20px', color: 'var(--text-medium)', lineHeight: '1.6', listStyleType: 'disc' }}>
              <li>To register you as a new user.</li>
              <li>To enable skill swapping and connecting with other users.</li>
              <li>To verify gender for access to the Women-Only Zone.</li>
              <li>To manage our relationship with you (e.g., notifying you about changes to our terms).</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3>4. Data Security</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. As this is a Final Year Project, we strive to adhere to industry standards for educational purposes.
            </p>
          </section>

          <section>
            <h3>5. Contact Us</h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>
              If you have any questions about this privacy policy or our privacy practices, please contact us via our <a href="/contact-us" style={{ color: 'var(--primary-orange)' }}>Contact Page</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
};

export default PrivacyPolicyPage;
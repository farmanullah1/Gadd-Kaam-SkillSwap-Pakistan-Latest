// src/components/ContactUsPage.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/forms.css'; // Reusing form styles

function ContactUsPage({ onChatbotToggle }) {
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="section-container" style={{maxWidth: '800px', marginTop: '4rem'}}>
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We'd love to hear from you!</p>

        <div className="card-panel" style={{padding: '2.5rem'}}>
          <div style={{marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '10px'}}>Get in Touch</h3>
            <p style={{color: 'var(--text-medium)'}}>
              Have a question about the project? Want to report a bug? 
              Or just want to say hi? Fill out the form below or reach us directly.
            </p>
            <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-dark)'}}>
              <li style={{marginBottom: '8px'}}>📧 <strong>Email:</strong> support@gaddkaam.com</li>
              <li style={{marginBottom: '8px'}}>📍 <strong>Address:</strong> University of Sindh, Jamshoro</li>
              <li>📞 <strong>Phone:</strong> +92 300 1234567</li>
            </ul>
          </div>

          <form>
            <div className="form-group" style={{marginBottom: '1rem'}}>
                <label className="input-label">Your Name</label>
                <input type="text" className="input-field" placeholder="Ali Khan" />
            </div>
            <div className="form-group" style={{marginBottom: '1rem'}}>
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" placeholder="ali@example.com" />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label className="input-label">Message</label>
                <textarea className="textarea-field" rows="5" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="btn btn-primary-orange" style={{width: '100%'}}>Send Message</button>
          </form>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default ContactUsPage;
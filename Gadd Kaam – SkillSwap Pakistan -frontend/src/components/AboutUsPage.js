// src/components/AboutUsPage.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/global.css'; // Use global styles

function AboutUsPage({ onChatbotToggle }) {
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

      <main className="section-container" style={{maxWidth: '900px', marginTop: '4rem'}}>
        <h1 className="section-title">About Gadd Kaam</h1>
        <p className="section-subtitle">Empowering Pakistan through Skills</p>

        <div className="card-panel" style={{padding: '2rem', marginTop: '2rem'}}>
          <h3>Our Mission</h3>
          <p style={{lineHeight: '1.6', color: 'var(--text-medium)', marginBottom: '1.5rem'}}>
            <strong>Gadd Kaam (SkillSwap Pakistan)</strong> is a community-driven platform designed to connect people who want to learn with those who can teach. 
            In a world where services are becoming expensive, we believe in the power of <strong>barter</strong>. 
            Our mission is to create a cashless economy where talent is the only currency you need.
          </p>

          <h3>Final Year Project</h3>
          <p style={{lineHeight: '1.6', color: 'var(--text-medium)', marginBottom: '1.5rem'}}>
            This platform was developed as a <strong>Final Year Project (FYP)</strong>. 
            It represents months of research, design, and coding to solve a real-world problem in Pakistan: 
            the lack of accessible skill-sharing networks.
          </p>

          <h3>Why "Gadd Kaam"?</h3>
          <p style={{lineHeight: '1.6', color: 'var(--text-medium)'}}>
            "Gadd" implies connecting or knotting together, and "Kaam" means work. 
            Together, it signifies a network of work and cooperation. 
            Whether you are a student, a professional, or a hobbyist, Gadd Kaam is your place to grow.
          </p>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default AboutUsPage;
// src/components/DisputeResolutionPage.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';

function DisputeResolutionPage({ onChatbotToggle }) {
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
        <h1 className="section-title">Dispute Resolution</h1>
        <p className="section-subtitle">Ensuring fairness and trust in our community</p>

        <div className="card-panel" style={{padding: '2rem', marginTop: '2rem'}}>
          <h3>How We Handle Disputes</h3>
          <p style={{lineHeight: '1.6', color: 'var(--text-medium)', marginBottom: '1.5rem'}}>
            At Gadd Kaam, we strive to maintain a respectful and honest community. 
            However, if a disagreement arises between users during a skill swap, we are here to help.
          </p>

          <h4>1. Report the Issue</h4>
          <p style={{marginBottom: '1rem', color: 'var(--text-medium)'}}>
            If a swap didn't go as planned or a user violated our terms, you can use the <strong>"Report"</strong> button 
            on their profile or chat. This will alert our admin team.
          </p>

          <h4>2. Admin Review</h4>
          <p style={{marginBottom: '1rem', color: 'var(--text-medium)'}}>
            Our admins will review the chat history and the details of the skill offer. 
            We look for evidence of completed work or policy violations.
          </p>

          <h4>3. Resolution</h4>
          <p style={{marginBottom: '1rem', color: 'var(--text-medium)'}}>
            Based on the evidence, we may:
            <ul style={{marginLeft: '20px', marginTop: '5px'}}>
                <li>Issue a warning to the offending user.</li>
                <li>Remove the user from the platform (Ban).</li>
                <li>Mark the swap as cancelled or completed manually.</li>
            </ul>
          </p>

          <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--background-section)', borderRadius: '8px'}}>
            <strong>Note:</strong> We encourage users to try and resolve minor misunderstandings via chat before filing a formal dispute.
          </div>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default DisputeResolutionPage;
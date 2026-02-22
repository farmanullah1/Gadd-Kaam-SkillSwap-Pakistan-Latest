// src/components/FAQPage.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';

function FAQPage({ onChatbotToggle }) {
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

  const faqs = [
    {
        q: "What is Gadd Kaam?",
        a: "Gadd Kaam is a skill-swapping platform where users can exchange services without using money. For example, you can teach English in exchange for learning how to fix a computer."
    },
    {
        q: "Is it free to use?",
        a: "Yes! Gadd Kaam is completely free. Our goal is to promote skill sharing in Pakistan."
    },
    {
        q: "What is the Women-Only Zone?",
        a: "This is a special section of our app dedicated to female users, ensuring a safe and comfortable environment for women to swap skills with other women."
    },
    {
        q: "How do I earn badges?",
        a: "You earn badges by completing swaps and receiving positive reviews. For example, completing your first swap earns you the 'First Swap' badge."
    }
  ];

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="section-container" style={{maxWidth: '900px', marginTop: '4rem'}}>
        <h1 className="section-title">Frequently Asked Questions</h1>
        
        <div style={{marginTop: '2rem'}}>
            {faqs.map((item, index) => (
                <div key={index} className="card-panel" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
                    <h3 style={{color: 'var(--primary-orange)', marginBottom: '0.5rem'}}>{item.q}</h3>
                    <p style={{color: 'var(--text-dark)', lineHeight: '1.5'}}>{item.a}</p>
                </div>
            ))}
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default FAQPage;
// src/pages/SuccessStoriesPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { Quote, Sparkles, Star, Award, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import useScrollReveal from '../hooks/useScrollReveal';

function SuccessStoriesPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const stories = [
    {
      names: t("stories_page_success_s1_names"),
      location: "Karachi, Sindh",
      skills: "Graphic Design ↔ React Web Dev",
      hours: "12 Hours Swapped",
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=ZA",
      quote: t("stories_page_success_s1_quote")
    },
    {
      names: t("stories_page_success_s2_names"),
      location: "Lahore, Punjab",
      skills: "Plumbing ↔ English Practice",
      hours: "8 Hours Swapped",
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=BT",
      quote: t("stories_page_success_s2_quote")
    },
    {
      names: t("stories_page_success_s3_names"),
      location: "Peshawar, KPK",
      skills: "Python Coding ↔ Urdu Copywriting",
      hours: "18 Hours Swapped",
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=KM",
      quote: t("stories_page_success_s3_quote")
    },
    {
      names: t("stories_page_success_s4_names"),
      location: "Quetta, Balochistan",
      skills: "Mobile Repair ↔ Math Tutoring",
      hours: "6 Hours Swapped",
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=GZ",
      quote: t("stories_page_success_s4_quote")
    }
  ];

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="section-container" style={{ maxWidth: '1000px', marginTop: '4rem', padding: '0 1rem' }}>
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} className="reveal fade-up">
          <span className="landing-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Award size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("stories_page_success_badge")}
          </span>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>{t("stories_page_success_title")}</h1>
          <p className="section-subtitle">{t("stories_page_success_subtitle")}</p>
        </div>

        {/* Global Stats Highlight Panel */}
        <div 
          className="card-panel reveal fade-up" 
          style={{ 
            padding: '2rem 1.5rem', 
            marginBottom: '4rem', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-orange)', margin: '0 0 0.5rem 0' }}>45,000+</h2>
              <p style={{ margin: 0, color: 'var(--text-medium)', fontWeight: 'bold' }}>{t("stories_page_success_stat_hours")}</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '60px', alignSelf: 'center' }} className="mobile-hide" />
            <div>
              <h2 style={{ fontSize: '2.5rem', color: '#3b82f6', margin: '0 0 0.5rem 0' }}>15,000+</h2>
              <p style={{ margin: 0, color: 'var(--text-medium)', fontWeight: 'bold' }}>{t("stories_page_success_stat_swappers")}</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '60px', alignSelf: 'center' }} className="mobile-hide" />
            <div>
              <h2 style={{ fontSize: '2.5rem', color: '#10b981', margin: '0 0 0.5rem 0' }}>98.6%</h2>
              <p style={{ margin: 0, color: 'var(--text-medium)', fontWeight: 'bold' }}>{t("stories_page_success_stat_rating")}</p>
            </div>
          </div>
        </div>

        {/* Stories Listing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '5rem' }} className="reveal fade-up">
          {stories.map((story, index) => (
            <div 
              key={index} 
              className="card-panel hover-lift" 
              style={{ 
                padding: '2.5rem', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
              }}
            >
              {/* Dynamic Province Ranking Icon */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '1.5rem', 
                  right: '1.5rem', 
                  background: 'rgba(255, 126, 41, 0.08)', 
                  color: 'var(--primary-orange)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Navigation size={12} /> {story.location}
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={story.avatar} 
                    alt={story.names} 
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      borderRadius: '50%', 
                      border: '3px solid rgba(255, 126, 41, 0.3)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-4px', 
                      right: '-4px', 
                      background: '#10b981', 
                      borderRadius: '50%', 
                      padding: '4px',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--card-bg)'
                    }}
                  >
                    <Star size={10} fill="#fff" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '280px' }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', margin: '0 0 0.3rem 0' }}>{story.names}</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    <span style={{ color: 'var(--primary-orange)', fontWeight: 'bold' }}>{story.skills}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 'bold' }}>{story.hours}</span>
                  </div>
                  
                  <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                    <Quote size={32} style={{ color: 'rgba(255, 126, 41, 0.08)', position: 'absolute', top: '-1.5rem', left: '-1rem' }} />
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-medium)', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>
                      "{story.quote}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Panel */}
        <div 
          className="card-panel reveal fade-up animate-glow" 
          style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            border: '1px solid rgba(255, 126, 41, 0.3)', 
            marginBottom: '4rem',
            background: 'rgba(255,126,41,0.02)'
          }}
        >
          <Sparkles size={36} style={{ color: 'var(--primary-orange)', marginBottom: '1.2rem' }} />
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '0.8rem' }}>{t("stories_page_success_write_title")}</h2>
          <p style={{ maxWidth: '650px', margin: '0 auto 2rem auto', color: 'var(--text-medium)', lineHeight: '1.6' }}>
            {t("stories_page_success_write_desc")}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-signup" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} onClick={() => window.location.href='/home'}>
              {t("stories_page_success_btn_start")}
            </button>
            <button className="btn btn-login" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }} onClick={() => window.location.href='/marketplace'}>
              {t("stories_page_success_btn_browse")}
            </button>
          </div>
        </div>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default SuccessStoriesPage;

// src/pages/BarterStoriesPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Search, Quote, Award, Sparkles, Navigation } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function BarterStoriesPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const stories = [
    {
      names: t("story_1_names"),
      location: t("story_1_location"),
      skills: t("story_1_skills"),
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=ZA",
      quote: t("story_1_quote")
    },
    {
      names: t("story_2_names"),
      location: t("story_2_location"),
      skills: t("story_2_skills"),
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=BT",
      quote: t("story_2_quote")
    },
    {
      names: t("story_3_names"),
      location: t("story_3_location"),
      skills: t("story_3_skills"),
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=KM",
      quote: t("story_3_quote")
    },
    {
      names: t("story_4_names"),
      location: t("story_4_location"),
      skills: t("story_4_skills"),
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=GZ",
      quote: t("story_4_quote")
    }
  ];

  const filteredStories = stories.filter(story => 
    story.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.names.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="barterstories-page-container">
      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="barterstories-main">
        {/* Header Block */}
        <div className="barterstories-header reveal fade-up">
          <span className="landing-badge">{t("stories_badge")}</span>
          <h1 className="reveal fade-up">{t("stories_page_title") || "Talent Swap Case Studies"}</h1>
          <p className="reveal fade-up">{t("stories_page_subtitle") || "Real localized success diaries of zero-cash hourly exchanges across Pakistan."}</p>

          <div className="stories-search-bar reveal fade-up" style={{ marginTop: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder={t("stories_search_placeholder") || "Filter case studies by province or city..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', right: '1.2rem', top: '1rem', color: 'var(--text-light)' }} />
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="stories-grid reveal fade-up">
          {filteredStories.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-img-container">
                <img 
                  src={`https://images.unsplash.com/photo-${index === 0 ? '1460925895917-afdab827c52f' : index === 1 ? '1504307651254-35680f356dfd' : index === 2 ? '1517694712202-14dd9538aa97' : '1531297484001-80022131f5a1'}?auto=format&fit=crop&w=500&q=80`} 
                  alt={story.names} 
                  className="story-img"
                />
                <span className="story-location-badge">
                  <Navigation size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {story.location}
                </span>
              </div>

              <div className="story-content">
                <div className="story-meta">{story.skills}</div>
                <h3 className="story-title">{story.names}</h3>
                
                <div className="story-quote">
                  <Quote size={24} style={{ color: 'rgba(227, 139, 64, 0.1)', position: 'absolute', top: '-1rem', left: '-0.5rem' }} />
                  <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>
                    "{story.quote}"
                  </p>
                </div>

                <div className="story-author-info">
                  <img src={story.avatar} alt={story.names} className="story-author-avatar" />
                  <div>
                    <div className="story-author-name">{story.names.split(" & ")[0]}</div>
                    <div className="story-author-role">{t("stories_author_role")}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default BarterStoriesPage;

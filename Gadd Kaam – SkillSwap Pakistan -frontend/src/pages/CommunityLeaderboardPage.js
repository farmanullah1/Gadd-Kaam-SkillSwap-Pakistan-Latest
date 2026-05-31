// src/pages/CommunityLeaderboardPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Star, Award, Search, Trophy, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function CommunityLeaderboardPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // Mock Leaders Data
  const leaders = [
    {
      name: "Zainab Bibi",
      role: "Professional Graphic Designer",
      province: "Sindh",
      location: "Karachi",
      swaps: 48,
      hours: 96,
      rating: 4.9,
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=ZB",
      badges: ["top_swapper", "verified", "pillar"]
    },
    {
      name: "Muhammad Bilal",
      role: "AC Technician & Plumber",
      province: "Punjab",
      location: "Lahore",
      swaps: 42,
      hours: 84,
      rating: 4.8,
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=MB",
      badges: ["top_swapper", "verified"]
    },
    {
      name: "Maria Khan",
      role: "English Language Tutor",
      province: "KPK",
      location: "Peshawar",
      swaps: 36,
      hours: 72,
      rating: 5.0,
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=MK",
      badges: ["top_swapper", "pillar"]
    },
    {
      name: "Tariq Baloch",
      role: "Smartphone Repair Expert",
      province: "Balochistan",
      location: "Quetta",
      swaps: 28,
      hours: 56,
      rating: 4.7,
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=TB",
      badges: ["first_swap", "verified"]
    },
    {
      name: "Kanza Yasmin",
      role: "SEO Copywriter",
      province: "Sindh",
      location: "Karachi",
      swaps: 24,
      hours: 48,
      rating: 4.9,
      avatar: "https://placehold.co/100x100/a78bfa/ffffff?text=KY",
      badges: ["verified"]
    },
    {
      name: "Sajid Ali",
      role: "Mathematics Tutor",
      province: "Punjab",
      location: "Multan",
      swaps: 18,
      hours: 36,
      rating: 4.6,
      avatar: "https://placehold.co/100x100/64748b/ffffff?text=SA",
      badges: ["first_swap"]
    }
  ];

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          leader.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          leader.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === '' || leader.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="leaderboard-page-container">
      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="leaderboard-main">
        {/* Header Block */}
        <div className="leaderboard-header reveal fade-up">
          <span className="landing-badge" style={{ background: 'rgba(255, 126, 41, 0.1)', color: 'var(--primary-orange)' }}>
            <Trophy size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> {t("leaderboard_badge")}
          </span>
          <h1 className="reveal fade-up">{t("leaderboard_page_title") || "Community Talent Leaderboard"}</h1>
          <p className="reveal fade-up">{t("leaderboard_page_subtitle") || "Meet Pakistan's top talent barter champions and verified community pillars."}</p>
        </div>

        {/* Filters */}
        <div className="leaderboard-search-filters reveal fade-up">
          <div style={{ display: 'flex', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input 
                type="text" 
                className="leaderboard-search-input" 
                placeholder={t("leaderboard_search_placeholder") || "Search swappers by name, skill, or province..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', right: '1.2rem', top: '1rem', color: 'var(--text-light)' }} />
            </div>
            <select 
              className="leaderboard-select-filter"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">{t("leaderboard_all_provinces")}</option>
              <option value="Punjab">{t("province_punjab")}</option>
              <option value="Sindh">{t("province_sindh")}</option>
              <option value="KPK">{t("province_kpk")}</option>
              <option value="Balochistan">{t("province_balochistan")}</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="leaderboard-table-card reveal scale-up">
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>{t("leaderboard_rank") || "Rank"}</th>
                  <th>{t("leaderboard_user") || "User"}</th>
                  <th>{t("leaderboard_province") || "Province"}</th>
                  <th>{t("leaderboard_swaps") || "Successful Swaps"}</th>
                  <th>{t("leaderboard_hours") || "Hours Swapped"}</th>
                  <th>{t("leaderboard_rating") || "Rating"}</th>
                  <th>{t("leaderboard_badges") || "Honors & Badges"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.map((leader, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="leaderboard-user-cell">
                        <img src={leader.avatar} alt={leader.name} className="leaderboard-avatar" />
                        <div>
                          <div className="leaderboard-user-name">{leader.name}</div>
                          <div className="leaderboard-user-role">{leader.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                        <Navigation size={12} /> {leader.location}, {t(`province_${leader.province.toLowerCase()}`, leader.province)}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-dark)' }}>{t("leaderboard_swaps_unit", { count: leader.swaps })}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-orange)' }}>{t("leaderboard_hours_unit", { count: leader.hours })}</strong>
                    </td>
                    <td>
                      <div className="leaderboard-rating-cell" style={{ color: 'var(--star-filled-color)' }}>
                        <Star size={14} fill="currentColor" /> {leader.rating}
                      </div>
                    </td>
                    <td>
                      <div className="leaderboard-badges-list">
                        {leader.badges.map((b, bIdx) => (
                          <span key={bIdx} className={`leaderboard-honor-badge badge-${b.replace('_', '-')}`}>
                            {t(`leaderboard_badge_${b}`, b.replace('_', ' '))}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default CommunityLeaderboardPage;

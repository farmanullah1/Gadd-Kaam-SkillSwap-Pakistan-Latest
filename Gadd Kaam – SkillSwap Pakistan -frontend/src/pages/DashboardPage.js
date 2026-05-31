import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Lucide Icons
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star,
  Briefcase, CheckCircle, Clock, Bell, ArrowRight, PlusCircle, Search,
  Activity, TrendingUp, Zap, Award, ChevronRight
} from 'lucide-react';



/* Mock recent activity items */
const MOCK_ACTIVITY = [
  { id: 1, type: 'swap_request', icon: <Mail size={16} />, colorClass: 'blue-bg',  msgKey: 'dash_activity_request_received',   time: '2 min ago' },
  { id: 2, type: 'review',        icon: <Star size={16} />, colorClass: 'yellow-bg', msgKey: 'dash_activity_review_received',    time: '1 hr ago'  },
  { id: 3, type: 'skill_posted',  icon: <Zap size={16} />, colorClass: 'orange-bg', msgKey: 'dash_activity_skill_posted',       time: '3 hr ago'  },
  { id: 4, type: 'swap_done',     icon: <CheckCircle size={16} />, colorClass: 'green-bg', msgKey: 'dash_activity_swap_done', time: 'Yesterday' },
];

function DashboardPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    skillsOffered: 0,
    skillsReceived: 0,
    pendingRequests: 0,
    unreadNotifications: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchDashboardStats();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const currentPath = location.pathname;

  // Skill completion progress bars (mock data, replace with real API)
  const skillProgress = [
    { label: t('skills_offered_title'), value: Math.min((stats.skillsOffered / 10) * 100, 100), color: '#e38b40' },
    { label: t('skills_received_title'), value: Math.min((stats.skillsReceived / 10) * 100, 100), color: '#22c55e' },
    { label: t('pending_requests_section_title'), value: Math.min((stats.pendingRequests / 5) * 100, 100), color: '#eab308' },
  ];

  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {t('navbar_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {t('navbar_my_profile')}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {t('navbar_my_skills')}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {t('navbar_marketplace')}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {t('navbar_women_zone')}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {t('received_requests_page_title')}
            </Link>
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} /> {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} /> {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="dashboard-header">
            <div>
                <h1 className="dashboard-welcome-heading">
                    {t('dashboard_welcome_heading', { username: user.firstName || user.username })}
                </h1>
                <p className="dashboard-sub-heading">{t('dashboard_sub_heading')}</p>
            </div>
            {/* Quick Rating Badge */}
            <div className="user-rating-badge">
                <Star size={18} fill="#e38b40" stroke="#e38b40" />
                <span>{stats.averageRating}</span>
                <span className="review-count">({stats.totalReviews})</span>
            </div>
          </div>

          {loading ? <LoadingSpinner /> : (
            <>
              {/* Stats Grid */}
              <div className="dashboard-summary-grid">
                
                {/* 1. Skills Offered */}
                <div className="summary-card" onClick={() => navigate('/dashboard/my-skills')}>
                  <div className="summary-icon-container orange-bg">
                    <Briefcase size={24} className="summary-icon" />
                  </div>
                  <div className="summary-text">
                    <h3 className="summary-value">{stats.skillsOffered}</h3>
                    <p className="summary-title">{t('skills_offered_title')}</p>
                  </div>
                </div>

                {/* 2. Skills Received (Completed) */}
                <div className="summary-card" onClick={() => navigate('/dashboard/reviews')}>
                  <div className="summary-icon-container green-bg">
                    <CheckCircle size={24} className="summary-icon" />
                  </div>
                  <div className="summary-text">
                    <h3 className="summary-value">{stats.skillsReceived}</h3>
                    <p className="summary-title">{t('skills_received_title')}</p>
                  </div>
                </div>

                {/* 3. Pending Requests */}
                <div className="summary-card" onClick={() => navigate('/dashboard/received-requests')}>
                  <div className="summary-icon-container yellow-bg">
                    <Clock size={24} className="summary-icon" />
                  </div>
                  <div className="summary-text">
                    <h3 className="summary-value">{stats.pendingRequests}</h3>
                    <p className="summary-title">{t('pending_requests_section_title')}</p>
                  </div>
                </div>

                {/* 4. Unread Notifications/Messages */}
                <div className="summary-card" onClick={() => navigate('/dashboard/messages')}>
                  <div className="summary-icon-container blue-bg">
                    <Bell size={24} className="summary-icon" />
                  </div>
                  <div className="summary-text">
                    <h3 className="summary-value">{stats.unreadNotifications}</h3>
                    <p className="summary-title">{t('unread_messages_title')}</p>
                  </div>
                </div>
              </div>

              {/* ── TWO COLUMN LAYOUT: Actions + Activity ── */}
              <div className="dashboard-bottom-grid">

                {/* Quick Actions Column */}
                <div>
                  <h2 className="section-title-left" style={{marginBottom: '1rem'}}>
                    {t('quick_actions')}
                  </h2>
                  
                  <div className="dashboard-action-cards">
                    <div className="action-card primary-action">
                      <div className="action-content">
                        <div className="action-icon-circle"><Search size={28}/></div>
                        <div>
                            <h3 className="action-title">{t('find_skill_title')}</h3>
                            <p className="action-description">{t('find_skill_description')}</p>
                        </div>
                      </div>
                      <Link to="/marketplace" className="btn-action-arrow">
                        <ArrowRight size={24} />
                      </Link>
                    </div>

                    <div className="action-card secondary-action">
                      <div className="action-content">
                        <div className="action-icon-circle"><PlusCircle size={28}/></div>
                        <div>
                            <h3 className="action-title">{t('offer_skill_title_card')}</h3>
                            <p className="action-description">{t('offer_skill_description_card')}</p>
                        </div>
                      </div>
                      <Link to="/offer-skill" className="btn-action-arrow">
                        <ArrowRight size={24} />
                      </Link>
                    </div>
                  </div>

                  {/* Skill Progress */}
                  <div className="dashboard-progress-card">
                    <div className="dashboard-progress-header">
                      <TrendingUp size={18} />
                      <h3>{t('dash_progress_title') || 'Your Progress'}</h3>
                    </div>
                    {skillProgress.map((item, i) => (
                      <div className="dashboard-progress-item" key={i}>
                        <div className="dashboard-progress-label">
                          <span>{item.label}</span>
                          <span style={{ color: item.color, fontWeight: '700' }}>{Math.round(item.value)}%</span>
                        </div>
                        <div className="dashboard-progress-track">
                          <div
                            className="dashboard-progress-fill"
                            style={{ width: `${item.value}%`, background: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Column */}
                <div>
                  <h2 className="section-title-left" style={{marginBottom: '1rem'}}>
                    <Activity size={18} style={{marginRight: '0'}} />
                    {t('dash_recent_activity') || 'Recent Activity'}
                  </h2>

                  <div className="dashboard-activity-feed">
                    {MOCK_ACTIVITY.map(item => (
                      <div className="dashboard-activity-item" key={item.id}>
                        <div className={`summary-icon-container ${item.colorClass}`} style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div className="dashboard-activity-text">
                          <p>{t(item.msgKey) || item.msgKey}</p>
                          <span>{item.time}</span>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                      </div>
                    ))}

                    <Link to="/dashboard/messages" className="dashboard-activity-see-all">
                      {t('dash_see_all_activity') || 'See All Activity'} <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Achievement Badge */}
                  <div className="dashboard-achievement-card">
                    <div className="dashboard-achievement-icon">
                      <Award size={28} />
                    </div>
                    <div>
                      <h4>{t('dash_achievement_title') || 'Keep Swapping!'}</h4>
                      <p>{t('dash_achievement_desc') || 'Complete 5 swaps to earn your Top Swapper badge.'}</p>
                    </div>
                    <div className="dashboard-achievement-bar">
                      <div className="dashboard-achievement-fill" style={{ width: `${Math.min((stats.skillsOffered / 5) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default DashboardPage;
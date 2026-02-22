import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import '../styles/dashboard.css';
import '../styles/requests.css';
import axios from 'axios';
import { FaCheck, FaTimes, FaMapMarkerAlt, FaGlobeAmericas, FaPhone, FaEnvelope, FaExchangeAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Import icons from lucide-react
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react';

const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// ✅ FIX: Robust Image URL Helper
const getProfileImageUrl = (path) => {
  if (!path) return getPlaceholderImage(80);
  
  // 1. Clean backslashes
  const cleanPath = path.replace(/\\/g, '/');
  
  // 2. Ensure path starts with / if not present (assuming relative path)
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // 3. Return full URL
  return `${process.env.REACT_APP_API_URL}${formattedPath}`;
};

// Component to render Request Card
const RequestCard = ({ request, onAccept, onCancel }) => {
  const { t } = useTranslation();
  
  return (
    <div className="request-card">
      <div className="request-card-top">
        <div className="sender-profile">
          <img
            src={getProfileImageUrl(request.sender.profilePicture)}
            alt={request.sender.username}
            className="request-profile-pic"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(80); }}
          />
          <div className="sender-details">
            <h3>{request.sender.username || t('anonymous_label')}</h3>
            <span className="request-date">
              {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
        
        {/* Location Badge */}
        <div className="request-badge">
          {request.isRemote ? (
            <span className="badge remote"><FaGlobeAmericas /> {t('remotely_label')}</span>
          ) : (
            <span className="badge location"><FaMapMarkerAlt /> {request.location || t('not_specified')}</span>
          )}
        </div>
      </div>

      <div className="request-exchange-visual">
        <div className="exchange-side my-side">
          <span className="label-sm">{t('requested_your_skill')}</span>
          <p className="skill-highlight">{request.skillOffer.skills.join(', ')}</p>
        </div>
        
        <div className="exchange-icon">
          <FaExchangeAlt />
        </div>

        <div className="exchange-side their-side">
          <span className="label-sm">{t('sender_offers_in_return')}</span>
          <p className="skill-highlight">{request.skillRequested}</p>
        </div>
      </div>

      <div className="request-message-box">
        <p>"{request.message}"</p>
      </div>

      <div className="request-card-actions">
        <button className="btn btn-cancel" onClick={() => onCancel(request._id)}>
          <FaTimes /> {t("decline_btn")}
        </button>
        <button className="btn btn-accept" onClick={() => onAccept(request._id)}>
          <FaCheck /> {t("accept_btn")}
        </button>
      </div>
    </div>
  );
};

// Component for Accepted Requests (Contact Card Style)
const AcceptedRequestNotification = ({ request, currentUserId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const otherParticipant = request.sender._id === currentUserId ? request.receiver : request.sender;

  const handleMessageClick = () => {
    navigate('/dashboard/messages', { state: { activeConversationRequestId: request._id } });
  };

  return (
    <div className="accepted-request-card">
      <div className="accepted-status-line">
        <div className="status-dot"></div>
        <span>{t('request_accepted_notification')}</span>
      </div>
      
      <div className="accepted-card-content">
        <img
          src={getProfileImageUrl(otherParticipant.profilePicture)}
          alt={otherParticipant.username}
          className="user-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(70); }}
        />
        
        <div className="contact-details">
          <h4>{otherParticipant.firstName} {otherParticipant.lastName}</h4>
          <p className="username">@{otherParticipant.username}</p>
          
          <div className="contact-row">
            <FaPhone className="icon" />
            <span>{otherParticipant.phoneNumber || t('not_specified')}</span>
          </div>
          <div className="contact-row">
            <FaEnvelope className="icon" />
            <span>{otherParticipant.email || t('not_specified')}</span>
          </div>
        </div>

        <button className="btn btn-primary-orange message-btn" onClick={handleMessageClick}>
          <MessageSquare size={18} /> {t('message_btn')}
        </button>
      </div>
    </div>
  );
};

function ReceivedRequestsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRequests(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRequests = async (currentUserId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const allRequestsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allRequests = allRequestsResponse.data;

      const pending = [];
      const active = [];

      allRequests.forEach(req => {
        const isCurrentUserSender = req.sender._id === currentUserId;
        const isCurrentUserReceiver = req.receiver._id === currentUserId;

        // Pending requests received by me
        if (req.status === 'pending' && isCurrentUserReceiver) {
          pending.push(req);
        }
        // Active/Completed requests involved in
        else if ((req.status === 'accepted' || req.status === 'completed') && (isCurrentUserSender || isCurrentUserReceiver)) {
          active.push({ ...req, isCurrentUserSender: isCurrentUserSender });
        }
      });

      setPendingRequests(pending);
      setActiveRequests(active);

    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(t('failed_to_load_requests_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(user.id);
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError(err.response?.data?.msg || t('failed_to_accept_request_error'));
    }
  };

  const handleCancelRequest = async (requestId) => {
    if(!window.confirm("Are you sure you want to decline this request?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(user.id);
    } catch (err) {
      console.error('Failed to cancel request:', err);
      setError(err.response?.data?.msg || t('failed_to_cancel_request_error'));
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

  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {t("received_requests_page_title")}
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
          <h1 className="dashboard-welcome-heading">{t("received_requests_page_title")}</h1>
          <p className="dashboard-sub-heading">{t("received_requests_page_subtitle")}</p>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="requests-page-layout">
              {/* PENDING REQUESTS SECTION */}
              <div className="requests-section">
                <h2 className="section-title">
                  {t("pending_requests_section_title")} 
                  <span className="count-badge">{pendingRequests.length}</span>
                </h2>
                
                {pendingRequests.length === 0 ? (
                   <div className="empty-state">
                     <Mail size={40} className="empty-icon" />
                     <p>{t("no_requests_received")}</p>
                   </div>
                ) : (
                  <div className="request-cards-grid">
                    {pendingRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onAccept={handleAcceptRequest}
                        onCancel={handleCancelRequest}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ACCEPTED REQUESTS SECTION */}
              <div className="requests-section">
                <h2 className="section-title">
                  {t("accepted_requests_section_title")}
                  <span className="count-badge">{activeRequests.length}</span>
                </h2>
                
                {activeRequests.length === 0 ? (
                   <div className="empty-state">
                     <p className="muted-text">No active exchanges at the moment.</p>
                   </div>
                ) : (
                  <div className="accepted-list">
                    {activeRequests.map((request) => (
                      <AcceptedRequestNotification
                        key={request._id}
                        request={request}
                        currentUserId={user.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default ReceivedRequestsPage;
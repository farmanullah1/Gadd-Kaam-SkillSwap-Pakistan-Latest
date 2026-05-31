import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import LoadingSpinner from '../components/LoadingSpinner';


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
const AcceptedRequestNotification = ({ request, currentUserId, onConfirm }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isSender = request.sender._id === currentUserId;
  const otherParticipant = isSender ? request.receiver : request.sender;

  const hasCurrentUserConfirmed = isSender ? request.senderConfirmedReceived : request.receiverConfirmedReceived;

  const handleMessageClick = () => {
    navigate('/dashboard/messages', { state: { activeConversationRequestId: request._id } });
  };

  const handleWriteReviewClick = () => {
    navigate(`/dashboard/reviews?requestId=${request._id}`);
  };

  return (
    <div className="accepted-request-card">
      <div className={`accepted-status-line ${request.status === 'completed' ? 'completed-status-line' : ''}`} style={request.status === 'completed' ? { backgroundColor: '#d1fae5', color: '#065f46' } : {}}>
        <div className={`status-dot ${request.status === 'completed' ? 'completed-status-dot' : ''}`} style={request.status === 'completed' ? { backgroundColor: '#059669' } : {}}></div>
        <span>
          {request.status === 'completed' 
            ? t('swap_completed_notification', 'Swap Completed! 🎉') 
            : t('request_accepted_notification')}
        </span>
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

        <div className="accepted-actions-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
          <button className="btn btn-primary-orange message-btn" onClick={handleMessageClick} style={{ width: '100%' }}>
            <MessageSquare size={18} /> {t('message_btn')}
          </button>
          
          {request.status === 'completed' ? (
            <button className="btn btn-write-review-success" onClick={handleWriteReviewClick} style={{ width: '100%', backgroundColor: '#10b981', color: 'white' }}>
              <Star size={18} /> {t('write_a_review_tab')}
            </button>
          ) : !hasCurrentUserConfirmed ? (
            <button className="btn btn-confirm-received" onClick={() => onConfirm(request._id)} style={{ width: '100%', backgroundColor: 'var(--logo-orange)', color: 'white' }}>
              <FaCheck size={14} /> {t('confirm_skill_received_btn', 'Confirm Skill Received')}
            </button>
          ) : (
            <span className="waiting-other-party" style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', textAlign: 'center', display: 'block', padding: '4px' }}>
              {t('waiting_other_party_label', 'Waiting for other party...')}
            </span>
          )}
        </div>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if(!window.confirm(t('confirm_decline_request_alert') || "Are you sure you want to decline this request?")) return;
    
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

  const handleConfirmSkillReceived = async (requestId) => {
    if(!window.confirm(t('confirm_skill_received_confirm_message', "Are you sure you have received the skill and want to confirm this swap?"))) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/confirm-skill-received`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedReq = response.data.request;
      
      if (updatedReq.status === 'completed') {
        alert(t('confirm_skill_received_success_completed', "Double confirmation complete! Swap has been successfully completed, and you have earned your 'First Swap' badge. Redirecting to leave a review!"));
        navigate(`/dashboard/reviews?requestId=${requestId}`);
      } else {
        alert(t('confirm_skill_received_success_pending', "You have successfully confirmed receiving the skill! Once the other participant also confirms, the swap will be marked as complete."));
        fetchRequests(user.id);
      }
    } catch (err) {
      console.error('Failed to confirm skill received:', err);
      setError(err.response?.data?.msg || t('failed_to_confirm_skill_received', 'Failed to confirm skill received.'));
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
                     <p className="muted-text">{t("no_active_exchanges")}</p>
                   </div>
                ) : (
                  <div className="accepted-list">
                    {activeRequests.map((request) => (
                      <AcceptedRequestNotification
                        key={request._id}
                        request={request}
                        currentUserId={user.id}
                        onConfirm={handleConfirmSkillReceived}
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
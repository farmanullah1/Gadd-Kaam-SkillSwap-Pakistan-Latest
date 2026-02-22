import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
// Footer is intentionally removed from this page layout per request
// import Footer from './Footer'; 
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; 
import ReportUserModal from './ReportUserModal'; // ✅ Imported Report Modal
import '../styles/my-skills.css'; 
import '../styles/messages.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Send, CheckCircle, AlertTriangle
} from 'lucide-react';

const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

const ChatMessage = ({ message, currentUserId }) => {
  const isCurrentUser = message.sender._id === currentUserId; 
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`chat-message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      <div className="message-content">{message.text}</div>
      <div className="message-time">{messageTime}</div>
    </div>
  );
};

const ConversationInterface = ({ activeConversation, onSkillReceivedConfirmed, currentUserId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Modals State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // ✅ Report Modal State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const messagesEndRef = useRef(null);
  const lastJsonMessage = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!activeConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/${activeConversation.requestId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      const currentJson = JSON.stringify(sortedMessages);
      if (currentJson !== lastJsonMessage.current) {
          setMessages(sortedMessages);
          lastJsonMessage.current = currentJson;
          setTimeout(scrollToBottom, 100); 
      }

    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [activeConversation]);

  // Initial load
  useEffect(() => {
    setMessages([]);
    lastJsonMessage.current = ""; 
    if (activeConversation) {
      fetchMessages();
      const pollingInterval = setInterval(fetchMessages, 5000);
      return () => clearInterval(pollingInterval);
    }
  }, [activeConversation, fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || activeConversation.status === 'completed') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests/${activeConversation.requestId}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newMsg = response.data;
      setMessages(prev => {
          const updated = [...prev, newMsg];
          lastJsonMessage.current = JSON.stringify(updated);
          return updated;
      });
      setNewMessage('');
      setTimeout(scrollToBottom, 50);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err.response?.data?.msg || t('failed_to_send_message_error');
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  };

  const handleConfirmSkillReceived = async () => {
    setShowConfirmModal(false);
    try {
      const token = localStorage.getItem('token');
      const requestIdToConfirm = activeConversation?.requestId;
      
      if (!requestIdToConfirm) {
        setErrorMessage(t('error_no_request_id'));
        setShowErrorModal(true);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests/${requestIdToConfirm}/confirm-skill-received`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/dashboard/reviews?requestId=${requestIdToConfirm}`);
      onSkillReceivedConfirmed(response.data.request, response.data.request.status === 'completed');

    } catch (err) {
      console.error('Error confirming skill received:', err);
      const msg = err.response?.data?.msg || t('error_confirming_skill_received_generic');
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  };

  // ✅ NEW: Handle Reporting User
  const handleReportUser = async (reason) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reports`, {
        reportedUserId: activeConversation.participantId, // Ensure this exists in activeConversation
        description: reason,
        requestId: activeConversation.requestId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowReportModal(false);
      setSuccessMessage(t('report_submitted_success', 'Report submitted successfully.'));
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Report failed", err);
      setShowReportModal(false);
      setErrorMessage(err.response?.data?.msg || "Failed to submit report.");
      setShowErrorModal(true);
    }
  };

  if (!activeConversation) {
    return (
      <div className="no-active-conversation">
        <MessageSquare size={64} className="no-conversation-icon" />
        <p>{t('select_conversation_message')}</p>
        <p className="no-conversation-subtext">{t('choose_chat_to_start')}</p>
      </div>
    );
  }

  const needsConfirmation = (activeConversation.isCurrentUserSender && !activeConversation.senderConfirmed) ||
                            (!activeConversation.isCurrentUserSender && !activeConversation.receiverConfirmed);

  const isExchangeCompleted = activeConversation.status === 'completed';

  const headerProfilePic = activeConversation.profilePicUrl 
    ? activeConversation.profilePicUrl 
    : getPlaceholderImage(45);

  return (
    <div className="conversation-container">
      <div className="chat-header">
        <div className="chat-partner-info">
          <img
            src={headerProfilePic}
            alt={activeConversation.participant}
            className="chat-partner-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(45); }}
          />
          <h3>{activeConversation.participant}</h3>
        </div>
        <div className="chat-actions">
          {needsConfirmation && (
            <button
              className="btn btn-primary-orange chat-action-btn"
              onClick={() => setShowConfirmModal(true)}
              disabled={isExchangeCompleted}
            >
              <CheckCircle size={16} style={{marginRight: '6px'}} /> {t('skill_received_btn')}
            </button>
          )}
          {/* ✅ REPORT BUTTON */}
          <button 
            className="btn btn-secondary-outline chat-action-btn" 
            onClick={() => setShowReportModal(true)}
            title="Report User"
          >
            <AlertTriangle size={16} style={{marginRight: '6px'}} /> {t('report_btn')}
          </button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="messages-display" style={{backgroundImage: 'radial-gradient(#e38b401a 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        {messages.map(msg => (
          <ChatMessage key={msg._id || Math.random()} message={msg} currentUserId={currentUserId} />
        ))}
        <div ref={messagesEndRef} />
        
        {isExchangeCompleted && (
            <div className="exchange-completed-banner" style={{textAlign:'center', padding:'10px', backgroundColor:'#d4edda', color:'#155724', borderRadius:'8px', marginTop:'10px', border: '1px solid #c3e6cb'}}>
                <p>{t('exchange_completed_chat_view_only')}</p>
            </div>
        )}
      </div>

      {!isExchangeCompleted ? (
        <div className="message-input-area">
          <input
            type="text"
            placeholder={t('type_your_message_placeholder')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          />
          <button className="btn-send" onClick={handleSendMessage}>
            <Send size={20} />
          </button>
        </div>
      ) : (
        <div className="message-input-area locked" style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed', justifyContent: 'center'}}>
           <p style={{textAlign: 'center', color: '#999', margin:0, fontStyle:'italic'}}>
             Chat is closed for this completed exchange.
           </p>
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Confirm Received */}
      {showConfirmModal && (
        <SuccessMessageModal
          isOpen={showConfirmModal}
          title={t('confirm_skill_received_title')}
          message={t('confirm_skill_received_message')}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSkillReceived}
          type="confirm"
        />
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <SuccessMessageModal
          isOpen={showErrorModal}
          title={t('error_title')}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
          type="error"
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessMessageModal
          isOpen={showSuccessModal}
          title="Success"
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
          type="success"
        />
      )}

      {/* ✅ REPORT MODAL */}
      {showReportModal && (
        <ReportUserModal 
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportUser}
            reportedUserName={activeConversation.participant}
        />
      )}

    </div>
  );
};

function MessagesPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchConversations(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (conversations.length > 0 && location.state?.activeConversationRequestId) {
      const { activeConversationRequestId } = location.state;
      const foundConv = conversations.find(conv => conv.requestId === activeConversationRequestId);
      if (foundConv) {
        setActiveConversation(foundConv);
        window.history.replaceState({}, document.title);
      }
    }
  }, [conversations, location.state]);


  const fetchConversations = async (currentUserId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        navigate('/login');
        return;
      }

      const requestsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allRequests = requestsResponse.data;
      const uniqueConversationsMap = new Map();

      allRequests.forEach(req => {
        if (req.status === 'accepted' || req.status === 'completed') {
          const isCurrentUserSender = req.sender._id === currentUserId;
          const otherParticipant = isCurrentUserSender ? req.receiver : req.sender;

          if (!otherParticipant || !otherParticipant.username) return;

          const participantName = otherParticipant.username || t('anonymous_label');
          const conversationId = req._id;

          const lastMsg = req.messages && req.messages.length > 0
            ? req.messages[req.messages.length - 1].text
            : (req.status === 'completed' ? t('exchange_completed_chat_summary') : t('chat_message_initial'));

          let cleanProfilePic = null;
          if (otherParticipant.profilePicture) {
             const rawPath = otherParticipant.profilePicture.replace(/\\/g, '/');
             const pathWithSlash = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
             cleanProfilePic = `${process.env.REACT_APP_API_URL}${pathWithSlash}`;
          }

          if (!uniqueConversationsMap.has(conversationId)) {
            uniqueConversationsMap.set(conversationId, {
              id: conversationId,
              requestId: req._id,
              participant: participantName,
              profilePicUrl: cleanProfilePic,
              lastMessage: lastMsg,
              status: req.status,
              senderConfirmed: req.senderConfirmedReceived,
              receiverConfirmed: req.receiverConfirmedReceived,
              isCurrentUserSender: isCurrentUserSender,
              participantId: otherParticipant._id, // ✅ Critical for Reporting
              skillOfferSkills: req.skillOffer && req.skillOffer.skills ? req.skillOffer.skills.join(', ') : ''
            });
          }
        }
      });

      const sortedConversations = Array.from(uniqueConversationsMap.values()).sort((a, b) => {
        return b.id.localeCompare(a.id);
      });

      setConversations(sortedConversations);

    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participant || '';
    const lastMessage = conv.lastMessage || '';
    const skillOfferSkills = conv.skillOfferSkills || '';

    return participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
           skillOfferSkills.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSkillReceivedConfirmation = (updatedRequest, completed) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.requestId === updatedRequest._id) {
          const updatedConv = {
            ...conv,
            status: updatedRequest.status,
            senderConfirmed: updatedRequest.senderConfirmedReceived,
            receiverConfirmed: updatedRequest.receiverConfirmedReceived,
            lastMessage: completed ? t('exchange_completed_chat_summary') : conv.lastMessage
          };
          if (activeConversation && activeConversation.id === conv.id) {
              setActiveConversation(updatedConv);
          }
          return updatedConv;
        }
        return conv;
      })
    );

    if (completed) {
      navigate(`/dashboard/reviews?requestId=${updatedRequest._id}`);
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

  if (!user) {
    return null;
  }

  const currentPath = location.pathname;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} />
              {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} />
              {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} />
              {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} />
              {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} />
                {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} />
              {t("received_requests_page_title")}
            </Link>
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} />
              {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} />
              {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area messages-page">
          <h1 className="dashboard-welcome-heading">{t("messages_page_title")}</h1>
          <p className="dashboard-sub-heading">{t("messages_page_subtitle")}</p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="messages-page-wrapper">
              <div className="messages-list-sidebar">
                <div className="messages-header">
                  <h1>{t('navbar_messages')}</h1>
                  <p>{t('messages_page_subtitle')}</p>
                </div>
                <div className="conversation-search">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder={t('search_messages_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="messages-list">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                      <div
                        key={conv.id}
                        className={`conversation-list-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                        onClick={() => setActiveConversation(conv)}
                      >
                        <img
                          src={conv.profilePicUrl || getPlaceholderImage(50)}
                          alt={conv.participant}
                          className="conversation-item-avatar"
                          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(50); }}
                        />
                        <div className="conversation-item-info">
                          <h4>{conv.participant}</h4>
                          <p className="last-message-preview">{conv.lastMessage}</p>
                          {conv.status === 'accepted' && (
                            <span className={`status-badge ${
                              (conv.isCurrentUserSender && !conv.senderConfirmed) || (!conv.isCurrentUserSender && !conv.receiverConfirmed)
                                ? 'pending-confirmation-badge'
                                : '' 
                            }`}>
                              { (conv.isCurrentUserSender && !conv.senderConfirmed) && t('your_confirmation_pending')}
                              { (!conv.isCurrentUserSender && !conv.receiverConfirmed) && t('partner_confirmation_pending')}
                            </span>
                          )}
                           {conv.status === 'completed' && (
                            <span className="status-badge completed-badge">
                              {t('exchange_completed_label')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages-found">
                      {searchQuery ? t('no_messages_found') : t('no_messages_yet')}
                    </p>
                  )}
                </div>
              </div>

              <div className="active-conversation-area">
                <ConversationInterface
                  activeConversation={activeConversation}
                  onSkillReceivedConfirmed={handleSkillReceivedConfirmation}
                  currentUserId={user.id}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default MessagesPage;
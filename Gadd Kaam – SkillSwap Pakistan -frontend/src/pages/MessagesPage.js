import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
// Footer is intentionally removed from this page layout per request
// import Footer from '../components/Footer'; 
import HelplinePopup from '../components/HelplinePopup';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessMessageModal from '../components/SuccessMessageModal'; 
import ReportUserModal from '../components/ReportUserModal'; // ✅ Imported Report Modal


import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Send, CheckCircle, AlertTriangle, Paperclip, Image, Video, FileText, Phone, PhoneOff, Mic, MicOff, VideoOff, Monitor
} from 'lucide-react';

const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

const ChatMessage = ({ message, currentUserId }) => {
  const isCurrentUser = message.sender._id === currentUserId; 
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getFileName = () => {
    if (message.text && message.text.startsWith('📎 Shared')) {
      return message.text.replace(/^📎 Shared (image|video|document): /, '');
    }
    return 'shared_attachment';
  };

  const renderMedia = () => {
    if (!message.mediaType || message.mediaType === 'none') return null;

    if (message.mediaType === 'image') {
      return (
        <div className="message-media image-media">
          <img 
            src={message.mediaUrl} 
            alt={getFileName()} 
            className="chat-media-image" 
            onClick={() => {
              const newTab = window.open();
              if (newTab) {
                newTab.document.write(`<img src="${message.mediaUrl}" style="max-width:100%; height:auto; display:block; margin:20px auto; box-shadow:0 4px 10px rgba(0,0,0,0.1); border-radius:8px;" />`);
              }
            }} 
          />
        </div>
      );
    }

    if (message.mediaType === 'video') {
      return (
        <div className="message-media video-media">
          <video src={message.mediaUrl} controls className="chat-media-video" />
        </div>
      );
    }

    if (message.mediaType === 'document') {
      const fileName = getFileName();
      return (
        <div className="message-media document-media">
          <a href={message.mediaUrl} download={fileName} className="chat-media-document" target="_blank" rel="noreferrer">
            <FileText size={24} className="doc-icon" />
            <div className="doc-info">
              <span className="doc-name">{fileName}</span>
              <span className="doc-size">Click to Download</span>
            </div>
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`chat-message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      {renderMedia()}
      <div className="message-content">{message.text}</div>
      <div className="message-time">{messageTime}</div>
    </div>
  );
};

const ConversationInterface = ({ activeConversation, onSkillReceivedConfirmed, currentUserId, socket, onNewMessage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  // Custom File Uploader Ref
  const fileInputRef = useRef(null);

  // Calling Simulation States
  const [callState, setCallState] = useState(null); // null, 'ringing', 'connected', 'ended'
  const [callType, setCallType] = useState('voice'); // 'voice', 'video'
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Modals State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // ✅ Report Modal State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSendMedia = async (type, url, name) => {
    setShowAttachmentMenu(false);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests/${activeConversation.requestId}/messages`,
        { 
          text: `📎 Shared ${type}: ${name}`,
          mediaUrl: url,
          mediaType: type
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newMsg = response.data;
      handleNewMessageReceived(newMsg);
    } catch (err) {
      console.error('Failed to send media:', err);
      setErrorMessage('Failed to share file attachment');
      setShowErrorModal(true);
    }
  };

  // Handle Real File Selection and FileReader Base64 encoding
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File is too large. Please select a file smaller than 10MB.");
      setShowErrorModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      let mediaType = 'document';
      if (file.type.startsWith('image/')) {
        mediaType = 'image';
      } else if (file.type.startsWith('video/')) {
        mediaType = 'video';
      }
      
      await handleSendMedia(mediaType, base64Data, file.name);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setErrorMessage("Error reading file");
      setShowErrorModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Calling Controls Flow
  const startCall = (type) => {
    setCallType(type);
    setCallState('ringing');
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setCallDuration(0);

    // Auto-connect call after 3 seconds of simulated ringing
    setTimeout(() => {
      setCallState('connected');
    }, 3000);
  };

  const endCall = () => {
    setCallState('ended');
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setTimeout(() => {
      setCallState(null);
    }, 2000);
  };

  // Calling Timer
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Handle Real Webcam Stream Hook
  useEffect(() => {
    if (callState === 'connected' && callType === 'video' && !isCameraOff && !isScreenSharing) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Webcam media access denied/error:", err);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callState, callType, isCameraOff, isScreenSharing]);

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
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

  const handleNewMessageReceived = useCallback((newMsg) => {
    setMessages(prev => {
      if (prev.some(m => m._id === newMsg._id)) return prev;
      const updated = [...prev, newMsg];
      lastJsonMessage.current = JSON.stringify(updated);
      return updated;
    });

    if (onNewMessage) {
      onNewMessage(activeConversation.requestId, newMsg);
    }

    setTimeout(scrollToBottom, 50);
  }, [onNewMessage, activeConversation]);

  useEffect(() => {
    setMessages([]);
    lastJsonMessage.current = ""; 
    if (activeConversation) {
      fetchMessages();
    }
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    if (!socket || !activeConversation) return;

    const roomId = activeConversation.requestId;
    console.log(`Joining socket room ${roomId}`);
    socket.emit('join_room', roomId);

    socket.on('new_message', handleNewMessageReceived);

    return () => {
      console.log(`Leaving socket room ${roomId}`);
      socket.emit('leave_room', roomId);
      socket.off('new_message', handleNewMessageReceived);
    };
  }, [socket, activeConversation, handleNewMessageReceived]);

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
      handleNewMessageReceived(newMsg);
      setNewMessage('');
      
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

  const handleReportUser = async (reason) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reports`, {
        reportedUserId: activeConversation.participantId, 
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
          <div>
            <h3>{activeConversation.participant}</h3>
            <span className="user-online-status">● Online</span>
          </div>
        </div>
        <div className="chat-actions">
          {/* Simulated Calling Trigger Buttons */}
          <button 
            className="btn btn-call-icon" 
            onClick={() => startCall('voice')}
            title={t('voice_call_btn', 'Voice Call')}
            disabled={isExchangeCompleted}
          >
            <Phone size={18} />
          </button>
          <button 
            className="btn btn-call-icon" 
            onClick={() => startCall('video')}
            title={t('video_call_btn', 'Video Call')}
            disabled={isExchangeCompleted}
          >
            <Video size={18} />
          </button>

          {needsConfirmation && (
            <button
              className="btn btn-primary-orange chat-action-btn"
              onClick={() => setShowConfirmModal(true)}
              disabled={isExchangeCompleted}
            >
              <CheckCircle size={16} style={{marginRight: '6px'}} /> {t('skill_received_btn')}
            </button>
          )}
          
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
        <div className="message-input-area-container" style={{ position: 'relative', width: '100%' }}>
          {showAttachmentMenu && (
            <div className="attachment-popover-menu slide-in-up">
              <div className="attachment-popover-header">
                <span>{t("attachment_menu_title")}</span>
              </div>
              <div className="attachment-popover-body">
                {/* Premium Real File Trigger Options */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                />
                
                <button className="attachment-option-item upload-custom-btn" onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}>
                  <Paperclip size={16} style={{color: 'var(--primary-orange)'}} />
                  <strong>{t("attachment_upload_device")}</strong>
                </button>
                
                <hr style={{border: 'none', borderBottom: '1px solid var(--border-color-light)', margin: '8px 0'}} />

                <button className="attachment-option-item" onClick={() => handleSendMedia('image', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80', 'SkillSwap_Wireframe.png')}>
                  <Image size={16} />
                  <span>{t("attachment_design_mockup")}</span>
                </button>
                <button className="attachment-option-item" onClick={() => handleSendMedia('image', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', 'SourceCode_Snippet.png')}>
                  <Image size={16} />
                  <span>{t("attachment_code_sample")}</span>
                </button>
                <button className="attachment-option-item" onClick={() => handleSendMedia('video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Figma_Swapping_Tutorial.mp4')}>
                  <Video size={16} />
                  <span>{t("attachment_video_demo")}</span>
                </button>
                <button className="attachment-option-item" onClick={() => handleSendMedia('document', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Project_Proposal_Draft.pdf')}>
                  <FileText size={16} />
                  <span>{t("attachment_document")}</span>
                </button>
              </div>
            </div>
          )}

          <div className="message-input-area">
            <button 
              className={`btn-attachment-toggle ${showAttachmentMenu ? 'active' : ''}`} 
              onClick={() => setShowAttachmentMenu(prev => !prev)}
              title={t("attach_media_title")}
              style={{
                background: 'none',
                border: 'none',
                color: showAttachmentMenu ? 'var(--primary-orange)' : 'var(--text-light)',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
                marginRight: '8px'
              }}
            >
              <Paperclip size={20} />
            </button>
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
        </div>
      ) : (
        <div className="message-input-area locked" style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed', justifyContent: 'center'}}>
           <p style={{textAlign: 'center', color: '#999', margin:0, fontStyle:'italic'}}>
             Chat is closed for this completed exchange.
           </p>
        </div>
      )}

      {/* --- SIMULATED CALLING SUITE OVERLAY --- */}
      {callState && (
        <div className="calling-overlay-modal fade-in">
          <div className="calling-card glass-panel animate-zoom">
            
            {/* Ringing UI State */}
            {callState === 'ringing' && (
              <div className="call-layout call-ringing">
                <div className="caller-avatar-wrapper">
                  <div className="ring-pulse orange-pulse"></div>
                  <div className="ring-pulse green-pulse"></div>
                  <img
                    src={headerProfilePic}
                    alt={activeConversation.participant}
                    className="call-avatar pulsing"
                    onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(100); }}
                  />
                </div>
                <h2>{activeConversation.participant}</h2>
                <p className="calling-status-text">{t('calling_ringing_status')}</p>
                <span className="call-type-badge">{callType === 'video' ? t('call_type_video') : t('call_type_voice')}</span>

                <div className="call-controls">
                  <button onClick={endCall} className="control-btn decline active-pulse" title={t("hang_up")}>
                    <PhoneOff size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* Connected UI State */}
            {callState === 'connected' && (
              <div className={`call-layout call-connected ${callType}`}>
                
                {/* Voice Call Visualizer */}
                {callType === 'voice' && (
                  <div className="voice-call-container">
                    <div className="caller-avatar-wrapper voice-active">
                      <img
                        src={headerProfilePic}
                        alt={activeConversation.participant}
                        className="call-avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(100); }}
                      />
                    </div>
                    <h2>{activeConversation.participant}</h2>
                    <div className="calling-timer">{formatCallDuration(callDuration)}</div>
                    
                    {/* Simulated Speech Wave Visualizer */}
                    <div className="audio-visualizer-wave">
                      <div className="bar"></div>
                      <div className="bar delay-1"></div>
                      <div className="bar delay-2"></div>
                      <div className="bar delay-3"></div>
                      <div className="bar delay-1"></div>
                      <div className="bar delay-4"></div>
                    </div>
                  </div>
                )}

                {/* Video Call Live Grid */}
                {callType === 'video' && (
                  <div className="video-call-grid">
                    
                    {/* Main Frame: Simulated Remote Participant Video */}
                    <div className="remote-video-frame glass-panel">
                      {isScreenSharing ? (
                        <div className="screen-share-simulated">
                          <Monitor size={48} className="share-icon orange-glow" />
                          <span>{t("screen_share_simulating")}</span>
                        </div>
                      ) : (
                        <div className="simulated-camera-placeholder">
                          <img
                            src={headerProfilePic}
                            alt={activeConversation.participant}
                            className="video-placeholder-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(100); }}
                          />
                          <p>{activeConversation.participant}</p>
                          <div className="call-audio-bars">
                            <span className="bar"></span>
                            <span className="bar delay-1"></span>
                            <span className="bar delay-2"></span>
                          </div>
                        </div>
                      )}
                      
                      <div className="call-overlay-indicator">
                        <span>{activeConversation.participant}</span>
                        {isMuted && <span className="muted-badge"><MicOff size={12} /> {t("partner_muted")}</span>}
                      </div>
                    </div>

                    {/* Picture-in-Picture: Real Local Camera Preview */}
                    <div className="local-video-frame shadow-large">
                      {isCameraOff ? (
                        <div className="local-camera-off">
                          <VideoOff size={20} />
                          <span>{t("camera_off")}</span>
                        </div>
                      ) : (
                        <video 
                          ref={localVideoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="local-video-element"
                        />
                      )}
                      <div className="call-overlay-indicator local">
                        <span>{t("you_label")}</span>
                      </div>
                    </div>

                    <div className="calling-timer overlay-timer">{formatCallDuration(callDuration)}</div>
                  </div>
                )}

                {/* calling control actions footer */}
                <div className="call-controls connected-controls">
                  <button 
                    onClick={() => setIsMuted(prev => !prev)} 
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    title={isMuted ? t('unmute') : t('mute')}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  
                  {callType === 'video' && (
                    <>
                      <button 
                        onClick={() => setIsCameraOff(prev => !prev)} 
                        className={`control-btn ${isCameraOff ? 'active' : ''}`}
                        title={isCameraOff ? t('turn_camera_on') : t('turn_camera_off')}
                      >
                        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
                      </button>
                      <button 
                        onClick={() => setIsScreenSharing(prev => !prev)} 
                        className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                        title={isScreenSharing ? t('stop_presenting') : t('share_screen')}
                      >
                        <Monitor size={20} style={{color: isScreenSharing ? 'var(--primary-orange)' : 'inherit'}} />
                      </button>
                    </>
                  )}
                  
                  <button onClick={endCall} className="control-btn decline active-pulse" title={t("hang_up")}>
                    <PhoneOff size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* Call Ended UI State */}
            {callState === 'ended' && (
              <div className="call-layout call-ended">
                <div className="ended-icon-wrapper red-glow">
                  <PhoneOff size={40} className="ended-icon" />
                </div>
                <h2>{t("call_ended")}</h2>
                <p className="call-summary-duration">{t("call_duration", { duration: formatCallDuration(callDuration) })}</p>
                <p className="closing-prompt">{t("disconnecting_secure_link")}</p>
              </div>
            )}

          </div>
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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchConversations(parsedUser.id);
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Set up socket connection
  useEffect(() => {
    if (!user) return;

    const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
      upgrade: false
    });

    setSocket(socketInstance);

    // Join the private notification room
    socketInstance.emit('join_user', user.id);

    // Handle incoming notifications globally to update the sidebar lastMessage preview
    socketInstance.on('notification_received', (notification) => {
      console.log('Notification received in MessagesPage socket:', notification);
      if (notification.type === 'message') {
        setConversations(prevConversations =>
          prevConversations.map(conv => {
            if (conv.requestId === notification.referenceId) {
              return {
                ...conv,
                lastMessage: notification.text
              };
            }
            return conv;
          })
        );
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const handleSidebarMessageUpdate = useCallback((requestId, newMsg) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.requestId === requestId) {
          return {
            ...conv,
            lastMessage: newMsg.text
          };
        }
        return conv;
      })
    );
  }, []);

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
                  socket={socket}
                  onNewMessage={handleSidebarMessageUpdate}
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
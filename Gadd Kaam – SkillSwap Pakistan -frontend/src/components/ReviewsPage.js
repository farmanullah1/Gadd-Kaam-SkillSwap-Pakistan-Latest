import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal';
import '../styles/dashboard.css';
import '../styles/reviews.css'; 
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Icons
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, ThumbsUp, Quote
} from 'lucide-react';

const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// ✅ FIX: Robust Image URL Helper
const getProfileImageUrl = (path) => {
  if (!path) return getPlaceholderImage(80);
  const cleanPath = path.replace(/\\/g, '/');
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${process.env.REACT_APP_API_URL}${formattedPath}`;
};

// Component to render static star rating
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="star-rating-display">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rating ? 'star-filled' : 'star-empty'}
          fill={index < rating ? "#f59e0b" : "none"} // Gold fill for active
          stroke={index < rating ? "#f59e0b" : "#cbd5e1"} // Gold stroke for active, Gray for empty
        />
      ))}
    </div>
  );
};

// 1. Modern Received Review Card
const ReceivedReviewCard = ({ review }) => {
  const { t } = useTranslation();
  
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-profile">
          <img
            src={getProfileImageUrl(review.reviewer.profilePicture)}
            alt={review.reviewer.username}
            className="review-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(60); }}
          />
          <div>
            <h4 className="reviewer-name">{review.reviewer.username}</h4>
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="review-rating-badge">
          <StarRatingDisplay rating={review.rating} />
        </div>
      </div>

      <div className="review-body">
        <Quote size={24} className="quote-icon" />
        <p className="review-text">{review.comment}</p>
      </div>

      {review.endorsedSkills && review.endorsedSkills.length > 0 && (
        <div className="review-footer">
          <span className="endorse-label"><ThumbsUp size={14} /> {t('endorsed_skills_label', 'Endorsed:')}</span>
          <div className="endorsement-tags">
            {review.endorsedSkills.map((skill, idx) => (
              <span key={idx} className="skill-pill">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Modern Pending Review Card (Action Item)
const PendingReviewCard = ({ pendingReview, onWriteReview }) => {
  const { t } = useTranslation();
  const otherUser = pendingReview.isCurrentUserSenderOfRequest
    ? pendingReview.receiver
    : pendingReview.sender;

  return (
    <div className="pending-review-card">
      <div className="pending-header">
        <div className="pending-user-info">
          <img
            src={getProfileImageUrl(otherUser?.profilePicture)}
            alt={otherUser?.username}
            className="pending-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(60); }}
          />
          <div>
            <h4>{t('rate_experience_with', { name: otherUser?.username || t('anonymous_label') })}</h4>
            <p className="pending-context">{t('exchange_completed_label')}</p>
          </div>
        </div>
        <button className="btn btn-primary-orange btn-sm" onClick={() => onWriteReview(pendingReview.requestId)}>
          {t('write_a_review_tab')}
        </button>
      </div>
      
      <div className="pending-details">
        <div className="detail-item">
          <span className="label">{t('skill_offered_label')}:</span>
          <span className="value">{pendingReview.skillOffer?.skills?.join(', ') || t('not_specified')}</span>
        </div>
        <div className="detail-arrow">↔</div>
        <div className="detail-item">
          <span className="label">{t('skill_requested_label')}:</span>
          <span className="value">{pendingReview.skillRequested || t('not_specified')}</span>
        </div>
      </div>
    </div>
  );
};

// 3. Interactive Review Form
const ReviewForm = ({
  exchangeDetails,
  rating,
  setRating,
  reviewText,
  setReviewText,
  endorsableSkills,
  endorsementCounts,
  handleEndorseSkill,
  handleSubmitReview,
  onCancel,
  t,
}) => {
    const participantReviewed = exchangeDetails.isCurrentUserSenderOfRequest
        ? exchangeDetails.receiver
        : exchangeDetails.sender;

    return (
        <div className="review-form-container">
            <h3 className="form-heading">{t('write_review_for_label', { username: participantReviewed?.username })}</h3>
            <p className="form-subheading">{t('share_feedback_helper', 'Your feedback helps the community grow.')}</p>

            <div className="form-section rating-section">
                <label>{t('rate_exchange_label')}</label>
                <div className="interactive-stars"> 
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <Star
                                key={index}
                                size={36}
                                fill={starValue <= rating ? "#f59e0b" : "transparent"}
                                stroke={starValue <= rating ? "#f59e0b" : "#cbd5e1"}
                                onClick={() => setRating(starValue)}
                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                className="star-interaction"
                            />
                        );
                    })}
                </div>
                <span className="rating-text">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent!"}
                </span>
            </div>

            <div className="form-section">
                <label htmlFor="reviewComment">{t('your_comments_label')}</label>
                <textarea
                    id="reviewComment"
                    className="textarea-field"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t('review_comment_placeholder')}
                    rows="4"
                ></textarea>
            </div>

            {endorsableSkills.length > 0 && (
                <div className="form-section">
                    <label>{t('endorse_skills_optional')}</label>
                    <div className="endorse-selection-grid">
                        {endorsableSkills.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={`endorse-chip ${endorsementCounts[skill] > 0 ? 'active' : ''}`}
                                onClick={() => handleEndorseSkill(skill)}
                            >
                                {endorsementCounts[skill] > 0 ? <ThumbsUp size={14} /> : null}
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button className="btn btn-secondary-light" onClick={onCancel}>{t('cancel_btn')}</button>
                <button className="btn btn-primary-orange" onClick={handleSubmitReview}>{t('submit_review_btn')}</button>
            </div>
        </div>
    );
};


function ReviewsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentRequestIdToReview, setCurrentRequestIdToReview] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(0); 
  const [reviewText, setReviewText] = useState('');
  const [exchangeDetails, setExchangeDetails] = useState(null);
  const [endorsableSkills, setEndorsableSkills] = useState([]);
  const [endorsementCounts, setEndorsementCounts] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const urlParams = new URLSearchParams(location.search);
  const initialRequestId = urlParams.get('requestId');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchPendingReviews(parsedUser.id);
      fetchReceivedReviews(parsedUser.id);

      if (initialRequestId) {
        setActiveTab('write');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, initialRequestId]);

  useEffect(() => {
      if (initialRequestId && pendingReviews.length > 0) {
          const foundPending = pendingReviews.find(pr => pr.requestId === initialRequestId);
          if (foundPending) {
              setCurrentRequestIdToReview(initialRequestId);
              setExchangeDetails(foundPending);
              setRating(0);
              setReviewText('');
              setReviewSubmitted(false);
              setEndorsableSkills(Array.isArray(foundPending.endorsableSkills) ? foundPending.endorsableSkills : []);
              setEndorsementCounts(
                  (Array.isArray(foundPending.endorsableSkills) ? foundPending.endorsableSkills : [])
                  .reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {})
              );
              navigate(location.pathname, { replace: true, state: {} });
          }
      }
  }, [initialRequestId, pendingReviews, location.pathname, navigate]);


  const fetchReceivedReviews = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceivedReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch received reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch pending reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReviewClick = (requestId) => {
    const foundPending = pendingReviews.find(pr => pr.requestId === requestId);
    if (foundPending) {
        setCurrentRequestIdToReview(requestId);
        setExchangeDetails(foundPending);
        setRating(0);
        setReviewText('');
        setReviewSubmitted(false);
        setEndorsableSkills(Array.isArray(foundPending.endorsableSkills) ? foundPending.endorsableSkills : []);
        setEndorsementCounts(
            (Array.isArray(foundPending.endorsableSkills) ? foundPending.endorsableSkills : [])
            .reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {})
        );
        setActiveTab('write');
    }
  };

  const handleEndorseSkill = (skill) => {
    setEndorsementCounts(prev => ({
        ...prev,
        [skill]: (prev[skill] || 0) + 1 > 0 ? 0 : 1 // Toggle logic: 1 or 0
    }));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
        setConfirmationMessage(t('please_provide_rating'));
        setShowConfirmationModal(true);
        return;
    }
    if (!reviewText.trim()) {
        setConfirmationMessage(t('please_provide_review_comment'));
        setShowConfirmationModal(true);
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const payload = {
            requestId: currentRequestIdToReview,
            rating: rating,
            comment: reviewText,
            endorsedSkills: Object.keys(endorsementCounts).filter(skill => endorsementCounts[skill] > 0),
        };

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setReviewSubmitted(true);
        setConfirmationMessage(t('review_submitted_success'));
        setShowConfirmationModal(true);

        setRating(0);
        setReviewText('');
        setEndorsementCounts({});
        setCurrentRequestIdToReview(null);
        setExchangeDetails(null);
        
        // Refresh data
        fetchPendingReviews(user.id);
        fetchReceivedReviews(user.id);
        
        setActiveTab('received');
    } catch (err) {
        console.error('Failed to submit review:', err.response?.data || err);
        setConfirmationMessage(err.response?.data?.msg || t('failed_to_submit_review_error'));
        setShowConfirmationModal(true);
    } finally {
        setLoading(false);
    }
  };

  const handleCancelReview = () => {
    setCurrentRequestIdToReview(null);
    setExchangeDetails(null);
    setActiveTab('pending');
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

        <section className="dashboard-content-area reviews-page">
          <div className="reviews-header">
            <h1>{t("reviews_page_title")}</h1>
            <p>{t("reviews_page_subtitle")}</p>
          </div>

          <div className="reviews-tabs">
            <button
              className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              {t('received_reviews_tab')} ({receivedReviews.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'pending' || activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              {t('write_a_review_tab')} ({pendingReviews.length})
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="reviews-content-wrapper">
              {activeTab === 'received' && (
                <div className="reviews-list-grid">
                  {receivedReviews.length > 0 ? (
                    receivedReviews.map(review => (
                      <ReceivedReviewCard key={review._id} review={review} />
                    ))
                  ) : (
                    <div className="empty-state">
                        <Star size={48} className="empty-icon" />
                        <p>{t('no_received_reviews')}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pending' && (
                <div className="pending-reviews-list">
                  {pendingReviews.length > 0 ? (
                    pendingReviews.map(pendingReview => (
                      <PendingReviewCard
                        key={pendingReview.requestId}
                        pendingReview={pendingReview}
                        onWriteReview={handleWriteReviewClick}
                      />
                    ))
                  ) : (
                    <div className="empty-state">
                        <ThumbsUp size={48} className="empty-icon" />
                        <p>{t('no_pending_reviews')}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'write' && exchangeDetails && (
                <div className="write-review-wrapper">
                    <ReviewForm
                      exchangeDetails={exchangeDetails}
                      rating={rating}
                      setRating={setRating}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      endorsableSkills={endorsableSkills}
                      endorsementCounts={endorsementCounts}
                      handleEndorseSkill={handleEndorseSkill}
                      handleSubmitReview={handleSubmitReview}
                      onCancel={handleCancelReview}
                      t={t}
                    />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
      {showConfirmationModal && (
        <SuccessMessageModal
          isOpen={showConfirmationModal}
          title={t('review_submission_status')}
          message={confirmationMessage}
          onClose={() => setShowConfirmationModal(false)}
          type={reviewSubmitted ? 'success' : 'error'}
        />
      )}
    </div>
  );
}

export default ReviewsPage;
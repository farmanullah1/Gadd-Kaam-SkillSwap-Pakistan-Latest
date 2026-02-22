// src/components/RequestSkillForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal';
import { X, MapPin } from 'lucide-react'; // Import icons for close and location

const RequestSkillForm = ({ skillOffer, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [skillRequested, setSkillRequested] = useState('');
  const [isRemote, setIsRemote] = useState(true); // Default to remote work
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form fields when the skillOffer prop changes (e.g., when opening for a new skill)
  useEffect(() => {
    setSkillRequested('');
    setIsRemote(true);
    setLocation('');
  }, [skillOffer]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic form validation
    if (!skillRequested.trim()) {
      setErrorMessage(t('specify_skill_required'));
      setShowError(true);
      return;
    }
    if (!isRemote && !location.trim()) {
      setErrorMessage(t('location_required_for_non_remote'));
      setShowError(true);
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const token = localStorage.getItem('token'); // Get authentication token from local storage
      const payload = {
        receiverId: skillOffer.user._id, // The ID of the user who owns the skill offer
        skillOfferId: skillOffer._id,    // The ID of the specific skill offer
        skillRequested: skillRequested.trim(), // The skill the current user is requesting
        isRemote: isRemote,              // Whether the work can be done remotely
        location: isRemote ? null : location.trim(), // Location is null if remote, otherwise trimmed value
      };

      // Make API call to send the skill request
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/send`, payload, {
        headers: { Authorization: `Bearer ${token}` } // Include auth token in headers
      });

      console.log('Request sent successfully:', response.data);
      setShowSuccess(true); // Show success message modal

      // Call the onSuccess callback provided by the parent component (e.g., MarketplacePage)
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Error sending request:', err);
      // Display error message from backend or a generic one
      setErrorMessage(err.response?.data?.msg || t('failed_to_send_request'));
      setShowError(true);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // If no skill offer is provided, don't render anything (shouldn't happen with proper parent handling)
  if (!skillOffer) return null;

  return (
    <div className="request-skill-modal-overlay">
      <div className="request-skill-modal-content">
        {/* Close button for the modal */}
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{t('request_skill_title')}</h2>
        <p className="request-skill-subtitle">{t('request_skill_from_user', { username: skillOffer.user.username })}</p>
        <p className="skill-offer-details">
          {/* Display the skill being offered by the other user */}
          <strong>{t('offered_skill_label')}:</strong> {skillOffer.skills.join(', ')}
        </p>

        <form onSubmit={handleSubmit} className="request-skill-form">
          {/* Input for the skill the user wants */}
          <div className="form-group">
            <label htmlFor="skillRequested">{t('specify_skill_wanted_label')}</label>
            <input
              id="skillRequested"
              type="text"
              placeholder={t('specify_skill_wanted_placeholder')}
              value={skillRequested}
              onChange={(e) => setSkillRequested(e.target.value)}
              required
            />
          </div>

          {/* Toggle switch for remote work */}
          <div className="form-group switch-group">
            <label htmlFor="isRemote">{t('work_remote_label')}</label>
            <div className="switch-toggle">
              <input
                type="checkbox"
                id="isRemote"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              <label htmlFor="isRemote" className="slider"></label>
            </div>
          </div>

          {/* Location input, shown only if work is not remote */}
          {!isRemote && (
            <div className="form-group">
              <label htmlFor="location" className="location-label">
                <MapPin size={18} style={{ marginRight: '5px' }} />
                {t('location_label')}
              </label>
              <input
                id="location"
                type="text"
                placeholder={t('location_placeholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required={!isRemote} // Make location required if not remote
              />
            </div>
          )}

          {/* Send Request button */}
          <button type="submit" className="btn btn-primary-orange send-request-btn" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : t('send_request_btn')}
          </button>
        </form>

        {/* Success message modal */}
        {showSuccess && (
          <SuccessMessageModal
            isOpen={showSuccess}
            title={t('request_sent_title')}
            message={t('request_sent_message', { username: skillOffer.user.username })}
            onClose={() => {
              setShowSuccess(false);
              onClose(); // Close the form after success message is acknowledged
            }}
            type="success"
          />
        )}
        {/* Error message modal */}
        {showError && (
          <SuccessMessageModal
            isOpen={showError}
            title={t('error_title')}
            message={errorMessage}
            onClose={() => setShowError(false)}
            type="error"
          />
        )}
      </div>
    </div>
  );
};

export default RequestSkillForm;

// src/components/OfferSkillSteps/Step2.js
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaImage, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Step2 = ({ onNext, onBack, data, user }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [description, setDescription] = useState(data.description || '');
  const [username, setUsername] = useState(data.username || '');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [location, setLocation] = useState(data.location || '');
  const [photo, setPhoto] = useState(data.photo || null);
  const [isAnonymous, setIsAnonymous] = useState(data.anonymous || false);
  const [isRemote, setIsRemote] = useState(data.remotely || false);
  const [shareWomenOnly, setShareWomenOnly] = useState(data.shareWithWomenZone || false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      setError('Please fill in description and location.');
      return;
    }
    setError(null);
    onNext({
      description,
      location,
      username,
      phoneNumber,
      photo,
      anonymous: isAnonymous,
      remotely: isRemote,
      shareWithWomenZone: shareWomenOnly,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="step-content-heading">{t('step2_offer_skill')}</h2>
      <p className="step-content-subheading">{t('step2_offer_skill_desc')}</p>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label>{t('step2_photo_label')}</label>
        <div
          className={`image-upload-wrapper ${photo ? 'has-image' : ''}`}
          onClick={handleImageClick}
        >
          {photo ? (
            <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt="Skill" />
          ) : (
            <>
              <FaImage className="upload-icon" />
              <p className="upload-text">Click to upload a photo</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">{t('step2_description_label')}</label>
        <textarea
          id="description"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('step2_description_placeholder')}
          className="form-input"
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Your phone number"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">{t('step2_location_label')}</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('step2_location_placeholder')}
          className="form-input"
          required
        />
      </div>
      
      <div className="switch-group">
        <span className="switch-label">{t('step2_go_anonymous_switch')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="switch-group">
        <span className="switch-label">{t('step2_remotely_switch')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isRemote}
            onChange={() => setIsRemote(!isRemote)}
          />
          <span className="slider"></span>
        </label>
      </div>
      
      {user && user.gender === 'Female' && (
        <div className="switch-group">
          <span className="switch-label">{t('step2_women_zone_switch')}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={shareWomenOnly}
              onChange={() => setShareWomenOnly(!shareWomenOnly)}
            />
            <span className="slider"></span>
          </label>
        </div>
      )}

      <div className="offer-skill-actions">
        <button type="button" className="btn-secondary-outline" onClick={onBack}>
          <FaChevronLeft style={{ marginRight: '8px' }} /> {t('go_back_btn')}
        </button>
        <button type="submit" className="btn-primary-orange">
          Next <FaChevronRight style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </form>
  );
};

export default Step2;
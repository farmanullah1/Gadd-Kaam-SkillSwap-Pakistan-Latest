// src/components/OfferSkillSteps/Step4.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaPaperPlane } from 'react-icons/fa';

const Step4 = ({ onBack, onPublish, data }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="step-content-heading">{t('step4_offer_skill')}</h2>
      <p className="step-content-subheading">{t('step4_offer_skill_desc')}</p>

      <div className="review-section">
        <div className="review-section-header">Your Offered Skills</div>
        <div className="review-info">
          <span className="review-info-label">{t('offer_skill_label')}:</span>
          <span className="review-info-value">{data.skills.join(', ')}</span>
        </div>
        {data.skillsToSwap.length > 0 && (
          <div className="review-info">
            <span className="review-info-label">Skills You Need:</span>
            <span className="review-info-value">{data.skillsToSwap.join(', ')}</span>
          </div>
        )}
        <div className="review-info">
          <span className="review-info-label">{t('remotely_label')}:</span>
          <span className="review-info-value">{data.remotely ? t('yes') : t('no')}</span>
        </div>
        <div className="review-info">
          <span className="review-info-label">{t('anonymous_label')}:</span>
          <span className="review-info-value">{data.anonymous ? t('yes') : t('no')}</span>
        </div>
        {data.shareWithWomenZone !== undefined && (
          <div className="review-info">
            <span className="review-info-label">{t('step2_women_zone_switch')}:</span>
            <span className="review-info-value">{data.shareWithWomenZone ? t('yes') : t('no')}</span>
          </div>
        )}
      </div>

      <div className="review-section">
        <div className="review-section-header">Contact Information</div>
        {data.anonymous ? (
          <p className="review-info-value" style={{ fontStyle: 'italic' }}>
            Contact information is hidden.
          </p>
        ) : (
          <>
            <div className="review-info">
              <span className="review-info-label">Username:</span>
              <span className="review-info-value">{data.username}</span>
            </div>
            <div className="review-info">
              <span className="review-info-label">Phone Number:</span>
              <span className="review-info-value">{data.phoneNumber}</span>
            </div>
            <div className="review-info">
              <span className="review-info-label">{t('location_label')}:</span>
              <span className="review-info-value">{data.location}</span>
            </div>
          </>
        )}
      </div>

      <div className="review-section">
        <div className="review-section-header">Description</div>
        <div className="review-description">
          <p>{data.description}</p>
        </div>
      </div>
      
      {data.photo && (
        <div className="review-section">
          <div className="review-section-header">Offer Photo</div>
          <img
            src={typeof data.photo === 'string' ? data.photo : URL.createObjectURL(data.photo)}
            alt="Skill Offer Preview"
            className="review-image-preview"
          />
        </div>
      )}

      <p className="step-content-subheading" style={{ textAlign: 'center' }}>{t('step4_review_message')}</p>

      <div className="offer-skill-actions">
        <button type="button" className="btn-secondary-outline" onClick={onBack}>
          <FaChevronLeft style={{ marginRight: '8px' }} /> {t('go_back_btn')}
        </button>
        <button type="button" className="btn-primary-orange" onClick={onPublish}>
          {t('step4_confirm_publish_btn')} <FaPaperPlane style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default Step4;
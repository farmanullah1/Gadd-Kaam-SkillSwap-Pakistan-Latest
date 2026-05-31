// src/pages/SurveyPage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';


function SurveyPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  useScrollReveal();

  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="survey-page-container">
      <Navbar user={user} onHelplineClick={() => {}} onChatbotToggle={onChatbotToggle} />

      <section className="survey-hero">
        <h1 className="reveal fade-up">{t('survey_page_title').split(' ').map((w, i) => i === 1 ? <span key={i}> {w}</span> : (i > 0 ? ' ' + w : w))}</h1>
        <p className="reveal fade-up">{t('survey_page_subtitle')}</p>
      </section>

      <div className="survey-content">
        {submitted ? (
          <div className="survey-success reveal fade-up">
            <CheckCircle2 size={64} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
            <h2>🎉 {t('survey_thank_you')}</h2>
            <p>{t('survey_success_desc')}</p>
          </div>
        ) : (
          <form className="survey-form reveal fade-up" onSubmit={handleSubmit}>
            <div className="survey-field">
              <label>{t('survey_rating_label')}</label>
              <div className="survey-rating-group">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button type="button" key={n} className={`survey-rating-btn ${rating === n ? 'active' : ''}`} onClick={() => setRating(n)}>{n}</button>
                ))}
              </div>
            </div>

            <div className="survey-field">
              <label>{t('survey_like_label')}</label>
              <textarea placeholder="..." />
            </div>

            <div className="survey-field">
              <label>{t('survey_improve_label')}</label>
              <textarea placeholder="..." />
            </div>

            <div className="survey-field">
              <label>{t('survey_recommend_label')}</label>
              <select defaultValue="">
                <option value="" disabled>---</option>
                <option value="yes">{t('survey_recommend_definitely')}</option>
                <option value="maybe">{t('survey_recommend_maybe')}</option>
                <option value="no">{t('survey_recommend_not_yet')}</option>
              </select>
            </div>

            <button type="submit" className="survey-submit-btn">{t('survey_submit_btn')}</button>
          </form>
        )}
      </div>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
    </div>
  );
}

export default SurveyPage;

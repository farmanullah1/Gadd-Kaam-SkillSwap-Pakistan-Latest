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
            <h2>🎉 {t('survey_page_title') === 'Community Survey' ? 'Thank you for your feedback!' : t('survey_page_title') === 'کمیونٹی سروے' ? 'آپ کی رائے کا شکریہ!' : 'توهان جي راءِ جو مهرباني!'}</h2>
            <p>{t('survey_page_title') === 'Community Survey' ? 'Your response helps us improve Gadd Kaam.' : t('survey_page_title') === 'کمیونٹی سروے' ? 'آپ کا جواب گڈ کام کو بہتر بنانے میں مدد کرتا ہے۔' : 'توهان جو جواب گڏ ڪم کي بهتر بنائڻ ۾ مدد ڪري ٿو.'}</p>
          </div>
        ) : (
          <form className="survey-form reveal fade-up" onSubmit={handleSubmit}>
            <div className="survey-field">
              <label>{t('survey_page_title') === 'Community Survey' ? 'How would you rate your experience? (1-10)' : t('survey_page_title') === 'کمیونٹی سروے' ? 'آپ اپنے تجربے کو کس طرح درجہ بندی کریں گے؟ (1-10)' : 'توهان پنهنجي تجربي کي ڪيئن درجه بندي ڪندؤ؟ (1-10)'}</label>
              <div className="survey-rating-group">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button type="button" key={n} className={`survey-rating-btn ${rating === n ? 'active' : ''}`} onClick={() => setRating(n)}>{n}</button>
                ))}
              </div>
            </div>

            <div className="survey-field">
              <label>{t('survey_page_title') === 'Community Survey' ? 'What do you like most about Gadd Kaam?' : t('survey_page_title') === 'کمیونٹی سروے' ? 'آپ کو گڈ کام میں سب سے زیادہ کیا پسند ہے؟' : 'توهان کي گڏ ڪم ۾ سڀ کان وڌيڪ ڇا پسند آهي؟'}</label>
              <textarea placeholder="..." />
            </div>

            <div className="survey-field">
              <label>{t('survey_page_title') === 'Community Survey' ? 'What can we improve?' : t('survey_page_title') === 'کمیونٹی سروے' ? 'ہم کیا بہتر کر سکتے ہیں؟' : 'اسان ڇا بهتر ڪري سگهون ٿا؟'}</label>
              <textarea placeholder="..." />
            </div>

            <div className="survey-field">
              <label>{t('survey_page_title') === 'Community Survey' ? 'Would you recommend Gadd Kaam to a friend?' : t('survey_page_title') === 'کمیونٹی سروے' ? 'کیا آپ گڈ کام کی سفارش کریں گے؟' : 'ڇا توهان گڏ ڪم جي سفارش ڪندؤ؟'}</label>
              <select defaultValue="">
                <option value="" disabled>---</option>
                <option value="yes">{t('survey_page_title') === 'Community Survey' ? 'Definitely!' : t('survey_page_title') === 'کمیونٹی سروے' ? 'بالکل!' : 'يقينن!'}</option>
                <option value="maybe">{t('survey_page_title') === 'Community Survey' ? 'Maybe' : t('survey_page_title') === 'کمیونٹی سروے' ? 'شاید' : 'شايد'}</option>
                <option value="no">{t('survey_page_title') === 'Community Survey' ? 'Not yet' : t('survey_page_title') === 'کمیونٹی سروے' ? 'ابھی نہیں' : 'اڃا نه'}</option>
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

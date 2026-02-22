import React from 'react';
import { useTranslation } from 'react-i18next';
import { VscClose } from 'react-icons/vsc'; // Import VscClose icon

function HelplinePopup({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="popup-overlay" onClick={onClose}> {/* Use generic popup-overlay class */}
      <div className="popup-content" onClick={e => e.stopPropagation()}> {/* Use generic popup-content class */}
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <VscClose /> {/* Use VscClose icon */}
        </button>
        <h3 className="popup-title">{t("helpline_popup_title")}</h3> {/* Use translation */}
        <p className="popup-message">{t("helpline_number")}</p> {/* Use translation for the number itself, allowing it to be locale-specific if needed */}
        <p className="helpline-note">{t("helpline_note")}</p> {/* Use translation */}
        <div className="popup-actions">
          <button onClick={onClose} className="btn-primary-orange popup-btn">
            {t("ok")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelplinePopup;
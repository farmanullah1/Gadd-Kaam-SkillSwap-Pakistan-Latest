import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../styles/popup.css'; // Reusing your existing popup styles

function LogoutConfirmationModal({ isOpen, onConfirm, onCancel }) {
  const { t } = useTranslation(); // Initialize useTranslation

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 className="popup-title">{t("logout_confirm_title")}</h3> {/* Translated title */}
        <p className="popup-message">{t("logout_confirm_message")}</p> {/* Translated message */}
        <div className="popup-actions">
          <button onClick={onCancel} className="btn btn-secondary-light popup-btn">
            {t("logout_cancel_btn")} {/* Translated button text */}
          </button>
          <button onClick={onConfirm} className="btn btn-primary-orange popup-btn">
            {t("logout_confirm_btn")} {/* Translated button text */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
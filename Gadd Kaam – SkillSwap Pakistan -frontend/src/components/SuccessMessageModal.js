import React from 'react';
import { VscClose } from 'react-icons/vsc';
import '../styles/popup.css'; // Ensure this CSS file exists and contains relevant styles
import { useTranslation } from 'react-i18next'; // Added for consistency, though 'Ok' might be the only translatable part initially

function SuccessMessageModal({ isOpen, title, message, onClose, onConfirm, type = 'info' }) {
  const { t } = useTranslation(); // Initialize useTranslation

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-content ${type}`} onClick={e => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <VscClose />
        </button>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          {type === 'confirm' ? (
            <>
              <button onClick={onConfirm} className="btn-primary-orange popup-btn confirm-btn">
                {t("confirm")} {/* Translated "Confirm" */}
              </button>
              <button onClick={onClose} className="btn-secondary-cancel popup-btn">
                {t("cancel_btn")} {/* Translated "Cancel" */}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="btn-primary-orange popup-btn">
              {t("ok")} {/* Translated "Ok" */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuccessMessageModal;
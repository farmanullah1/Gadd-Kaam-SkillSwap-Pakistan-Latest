// src/components/ReportUserModal.js
import React, { useState } from 'react';
import '../styles/popup.css'; // Reusing popup styles
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReportUserModal = ({ isOpen, onClose, onSubmit, reportedUserName }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason.trim()) return;
    onSubmit(finalReason);
  };

  const reasons = [
    "Harassment or bullying",
    "Spam or scam",
    "Inappropriate content",
    "Did not deliver agreed service",
    "Fake profile",
    "Other"
  ];

  return (
    <div className="popup-overlay">
      <div className="popup-content report-modal">
        <button className="close-btn" onClick={onClose}><X size={20}/></button>
        
        <div className="popup-header">
            <div className="icon-circle red">
                <AlertTriangle size={32} />
            </div>
            <h2 className="popup-title">{t('report_user_title', { name: reportedUserName })}</h2>
        </div>

        <p className="popup-message">{t('report_user_desc')}</p>

        <div className="report-options">
            {reasons.map((r) => (
                <label key={r} className="radio-option">
                    <input 
                        type="radio" 
                        name="reportReason" 
                        value={r} 
                        checked={reason === r} 
                        onChange={(e) => setReason(e.target.value)} 
                    />
                    <span>{r}</span>
                </label>
            ))}
        </div>

        {reason === 'Other' && (
            <textarea 
                className="textarea-field" 
                placeholder="Please describe the issue..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                style={{marginTop: '10px'}}
            />
        )}

        <div className="popup-actions">
          <button className="btn btn-secondary" onClick={onClose}>{t('cancel_btn')}</button>
          <button 
            className="btn btn-danger" 
            onClick={handleSubmit}
            disabled={!reason || (reason === 'Other' && !customReason.trim())}
          >
            {t('submit_report_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
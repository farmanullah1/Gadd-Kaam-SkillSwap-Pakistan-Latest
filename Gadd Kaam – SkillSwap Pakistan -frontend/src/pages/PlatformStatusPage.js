// src/pages/PlatformStatusPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Shield, Activity, Users, Lock, Server, CheckCircle2 } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function PlatformStatusPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [logs, setLogs] = useState([
    { time: "11:32:04", text: t("status_log_initial_1"), type: "success" },
    { time: "11:34:12", text: t("status_log_initial_2"), type: "info" },
    { time: "11:35:48", text: t("status_log_initial_3"), type: "info" }
  ]);

  useScrollReveal();

  useEffect(() => {
    setLogs([
      { time: "11:32:04", text: t("status_log_initial_1"), type: "success" },
      { time: "11:34:12", text: t("status_log_initial_2"), type: "info" },
      { time: "11:35:48", text: t("status_log_initial_3"), type: "info" }
    ]);
  }, [t]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // Add random emulated transaction logs in realtime
  useEffect(() => {
    const logInterval = setInterval(() => {
      const time = new Date().toTimeString().split(' ')[0];
      const randType = Math.random();
      let logText = "";
      let logType = "info";

      if (randType < 0.4) {
        logText = t("status_log_dynamic_1");
        logType = "success";
      } else if (randType < 0.7) {
        logText = t("status_log_dynamic_2", { id: Math.floor(Math.random() * 8000 + 1000) });
        logType = "info";
      } else {
        logText = t("status_log_dynamic_3");
        logType = "success";
      }

      setLogs(prev => [
        { time, text: logText, type: logType },
        ...prev.slice(0, 15)
      ]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, [t]);

  return (
    <div className="platformstatus-page-container">
      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="platformstatus-main">
        {/* Header Block */}
        <div className="platformstatus-header reveal fade-up">
          <span className="landing-badge">{t("status_badge")}</span>
          <h1 className="reveal fade-up">{t("status_page_title") || "Futuristic System Status & Nodes Dashboard"}</h1>
          <p className="reveal fade-up">{t("status_page_subtitle") || "Live real-time health indicators of Gadd Kaam cashless transaction channels."}</p>
        </div>

        {/* Operational Indicator Banner */}
        <div className="status-indicator-banner reveal scale-up">
          <div className="status-pulse-dot"></div>
          <span>{t("status_banner", { status: t("status_operational") })}</span>
        </div>

        {/* Dashboard Grid */}
        <div className="metrics-dashboard-grid reveal fade-up">
          <div className="metric-status-card">
            <div className="metric-icon-box"><Server size={24} /></div>
            <div className="metric-value-text">14,204</div>
            <div className="metric-label-text">{t("status_nodes_active") || "Barter Nodes Active"}</div>
            <div className="metric-sub-label">{t("status_sub_across_provinces")}</div>
          </div>

          <div className="metric-status-card">
            <div className="metric-icon-box"><Shield size={24} /></div>
            <div className="metric-value-text">100%</div>
            <div className="metric-label-text">{t("status_escrow_shield") || "Escrow Safety Factor"}</div>
            <div className="metric-sub-label">{t("status_sub_double_confirm")}</div>
          </div>

          <div className="metric-status-card">
            <div className="metric-icon-box"><Activity size={24} /></div>
            <div className="metric-value-text">99.98%</div>
            <div className="metric-label-text">{t("status_uptime") || "Platform Uptime"}</div>
            <div className="metric-sub-label">{t("status_sub_high_performance")}</div>
          </div>

          <div className="metric-status-card">
            <div className="metric-icon-box"><Lock size={24} /></div>
            <div className="metric-value-text">{t("status_metric_optimal")}</div>
            <div className="metric-label-text">{t("status_chat_load") || "Encrypted Chat Load"}</div>
            <div className="metric-sub-label">{t("status_sub_encrypted_chat")}</div>
          </div>
        </div>

        {/* Live Transaction Ledger Card */}
        <div className="live-logs-card reveal scale-up">
          <h2>
            <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
            {t("status_live_ledger") || "Live Secure Barter Transaction Logs"}
          </h2>
          <div className="live-logs-terminal">
            {logs.map((log, idx) => (
              <div key={idx} className="log-entry-row">
                <span className="log-time">[{log.time}]</span>
                <span className={`log-${log.type}`}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default PlatformStatusPage;

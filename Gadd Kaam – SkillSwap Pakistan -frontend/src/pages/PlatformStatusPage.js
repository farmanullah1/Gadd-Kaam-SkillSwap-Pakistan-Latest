// src/pages/PlatformStatusPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Shield, Activity, Users, Lock, Server, CheckCircle2, Navigation, Radio, Terminal, Cpu } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function PlatformStatusPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState('all');
  
  // Real-time Latency Jitter State
  const [latencyJitter, setLatencyJitter] = useState(0);

  // Mock Logs List
  const [logs, setLogs] = useState([
    { time: "11:32:04", text: "Secure handshake established with Lahore Node #2", type: "success" },
    { time: "11:34:12", text: "System memory scan completed. Zero leaked nodes found.", type: "info" },
    { time: "11:35:48", text: "Global CDN synchronization completed successfully across all 5 hubs.", type: "info" }
  ]);

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // Province-level Node Database
  const regionNodes = {
    all: { name: "Pakistan (Global Hub)", latency: 15, swappers: "17.1k", load: "31%", status: "Optimal" },
    punjab: { name: "Punjab Node (Lahore)", latency: 18, swappers: "6.2k", load: "42%", status: "Optimal" },
    sindh: { name: "Sindh Node (Karachi)", latency: 12, swappers: "4.8k", load: "34%", status: "Optimal" },
    kpk: { name: "KPK Node (Peshawar)", latency: 24, swappers: "2.1k", load: "18%", status: "Optimal" },
    balochistan: { name: "Balochistan Node (Quetta)", latency: 31, swappers: "950+", load: "12%", status: "Optimal" },
    federal: { name: "Federal Node (Islamabad)", latency: 8, swappers: "3.1k", load: "28%", status: "Optimal" }
  };

  const activeNode = regionNodes[selectedNode];

  // Latency Jitter Loop to simulate live networking pings!
  useEffect(() => {
    const pingLoop = setInterval(() => {
      // Random jitter from -2ms to +2ms
      setLatencyJitter(Math.floor(Math.random() * 5 - 2));
    }, 2000);
    return () => clearInterval(pingLoop);
  }, []);

  // Emulate secure platform logs in realtime
  useEffect(() => {
    const logInterval = setInterval(() => {
      const time = new Date().toTimeString().split(' ')[0];
      const randVal = Math.random();
      let logText = "";
      let logType = "info";

      const swapId = Math.floor(Math.random() * 8000 + 1000);
      if (randVal < 0.35) {
        logText = `Completed secure escrow matching verification for Contract #${swapId}`;
        logType = "success";
      } else if (randVal < 0.7) {
        logText = `Pinged ${regionNodes[Object.keys(regionNodes)[Math.floor(Math.random() * 6)]].name} successfully. Zero pack loss.`;
        logType = "info";
      } else {
        logText = `Double-handshake chat encryption keys rotated for User session #${swapId}`;
        logType = "success";
      }

      setLogs(prev => [
        { time, text: logText, type: logType },
        ...prev.slice(0, 10)
      ]);
    }, 5000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── BACKGROUND GLOW ORBS ── */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-emerald-500/4 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[15%] right-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/4 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12 reveal fade-up">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-500/20 shadow-sm shadow-emerald-500/5 select-none">
            <Radio size={13} className="animate-pulse" /> 
            <span>{t("status_badge") || "NOC Systems Online"}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("status_page_title") || "Futuristic System Status & Nodes Dashboard"}
          </h1>
          <p className="text-sm md:text-base text-slate-505 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("status_page_subtitle") || "Live real-time health indicators of Gadd Kaam cashless transaction channels."}
          </p>
        </div>

        {/* Operational Indicator Banner */}
        <div className="reveal scale-up flex items-center justify-center gap-3 py-4.5 px-6 bg-emerald-500/5 dark:bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl mb-12 max-w-[480px] mx-auto shadow-sm shadow-emerald-500/[0.01]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
            {t("status_banner", { status: t("status_operational") }) || "All Systems Operational"}
          </span>
        </div>

        {/* ── REGIONAL NODE health SELECTOR TABS ── */}
        <div className="reveal fade-up flex flex-wrap justify-center items-center gap-2 mb-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/30 p-4.5 rounded-3xl shadow-xl shadow-black/[0.01] w-full">
          <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-550 tracking-wider mr-2 select-none flex items-center gap-1">
            <Cpu size={12} /> Select Server Hub:
          </span>
          {[
            { id: 'all', name: "Pakistan Hub" },
            { id: 'punjab', name: "Punjab Node" },
            { id: 'sindh', name: "Sindh Node" },
            { id: 'kpk', name: "KPK Node" },
            { id: 'balochistan', name: "Balochistan Node" },
            { id: 'federal', name: "Federal Node" }
          ].map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedNode === node.id
                  ? 'bg-gradient-to-r from-emerald-550 to-teal-500 dark:from-emerald-600 dark:to-teal-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent'
                  : 'bg-slate-100 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {node.name}
            </button>
          ))}
        </div>

        {/* Dashboard Metrics Grid (Custom Node-level variables) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 reveal fade-up">
          
          {/* Card 1: Nodes Active */}
          <div className="group/metric p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-950/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.03] hover:border-emerald-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm mb-4.5 group-hover/metric:scale-110 transition-transform duration-300">
              <Server size={22} />
            </div>
            <div className="text-2xl font-black text-slate-850 dark:text-white tracking-tight leading-none mb-1.5">{activeNode.swappers}</div>
            <div className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 tracking-wider mb-1">{t("status_nodes_active") || "Barter Nodes Active"}</div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("status_sub_across_provinces") || "Across Provinces"}</div>
          </div>

          {/* Card 2: Escrow Shield */}
          <div className="group/metric p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-950/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.03] hover:border-blue-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm mb-4.5 group-hover/metric:scale-110 transition-transform duration-300">
              <Shield size={22} />
            </div>
            <div className="text-2xl font-black text-slate-850 dark:text-white tracking-tight leading-none mb-1.5">100%</div>
            <div className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 tracking-wider mb-1">{t("status_escrow_shield") || "Escrow Safety Factor"}</div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("status_sub_double_confirm") || "Double Handshake protection"}</div>
          </div>

          {/* Card 3: Platform Uptime */}
          <div className="group/metric p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-950/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.03] hover:border-teal-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-550 border border-teal-500/20 shadow-sm mb-4.5 group-hover/metric:scale-110 transition-transform duration-300">
              <Activity size={22} />
            </div>
            <div className="text-2xl font-black text-slate-850 dark:text-white tracking-tight leading-none mb-1.5">{activeNode.latency + latencyJitter}ms</div>
            <div className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 tracking-wider mb-1">{t("status_uptime") || "Ping Response"}</div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{activeNode.name}</div>
          </div>

          {/* Card 4: Encrypted Chat Load */}
          <div className="group/metric p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/50 dark:to-slate-950/50 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.03] hover:border-amber-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm mb-4.5 group-hover/metric:scale-110 transition-transform duration-300">
              <Lock size={22} />
            </div>
            <div className="text-2xl font-black text-slate-850 dark:text-white tracking-tight leading-none mb-1.5">{activeNode.load}</div>
            <div className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 tracking-wider mb-1">{t("status_chat_load") || "Encrypted Chat Load"}</div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("status_sub_encrypted_chat") || "SSO Token Optimal"}</div>
          </div>
        </div>

        {/* Live Transaction Ledger Card */}
        <div className="reveal scale-up bg-slate-950 border border-slate-900/85 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between bg-slate-900/80 px-6 py-4 border-b border-slate-900/70 select-none">
            <h2 className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              <span>{t("status_live_ledger") || "Live Secure Barter Transaction Ledger"}</span>
            </h2>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
          </div>

          {/* Terminal Output */}
          <div className="font-mono text-[11px] p-6 h-[300px] overflow-y-auto leading-relaxed select-all flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-slate-800">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 border-l border-slate-900 pl-3">
                <span className="text-slate-600 font-bold flex-shrink-0">[{log.time}]</span>
                <span className={log.type === 'success' ? 'text-emerald-400' : 'text-cyan-400 font-medium'}>
                  {log.text}
                </span>
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

// src/pages/DisputeResolutionPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { 
  AlertCircle, Scale, ShieldAlert, Sparkles, ChevronRight, 
  CheckCircle2, FileText, ArrowRight, User, Clock, ExternalLink, RefreshCw 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';

function DisputeResolutionPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  
  // Wizard States
  const [isFiling, setIsFiling] = useState(false);
  const [filingStep, setFilingStep] = useState(1);
  const [swapId, setSwapId] = useState('');
  const [disputeType, setDisputeType] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceLink, setEvidenceLink] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  // Live Tickets Mock State (updates dynamically!)
  const [tickets, setTickets] = useState([
    {
      id: "GKD-2026-4819",
      partner: "Sajid Ali",
      swap: "Mathematics Tutoring ↔ Graphics Help",
      type: "Deadline Missed",
      status: "under_review",
      date: "May 28, 2026",
      timeline: ["filed", "review"],
      details: "Arbitrator assigned. Reviewing message history."
    },
    {
      id: "GKD-2026-3841",
      partner: "Kanza Yasmin",
      swap: "Copywriting Exchange ↔ UI/UX Layout",
      type: "Quality Mismatch",
      status: "resolved",
      date: "May 15, 2026",
      timeline: ["filed", "review", "arbitration", "resolved"],
      resolution: "Partner completed requested revisions. Swap marked successful."
    }
  ]);

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const activeSwaps = [
    { id: "swap-101", partner: "Zainab Bibi", title: "Graphic Design ↔ Sindhi Translation" },
    { id: "swap-102", partner: "Muhammad Bilal", title: "AC Technician Support ↔ Web Development" },
    { id: "swap-103", partner: "Maria Khan", title: "English Language Tutoring ↔ SEO Writing" }
  ];

  const handleStartFiling = () => {
    setIsFiling(true);
    setFilingStep(1);
    setSuccessTicket(null);
  };

  const handleNextStep = () => {
    if (filingStep === 1 && !swapId) {
      alert("Please select a swap agreement to proceed.");
      return;
    }
    if (filingStep === 2 && (!disputeType || !description)) {
      alert("Please fill in all reason details to proceed.");
      return;
    }
    setFilingStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setFilingStep((prev) => prev - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = `GKD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedSwap = activeSwaps.find(s => s.id === swapId);
    
    const newTicket = {
      id: newId,
      partner: selectedSwap ? selectedSwap.partner : "Community Member",
      swap: selectedSwap ? selectedSwap.title : "Skill Exchange",
      type: disputeType,
      status: "filed",
      date: "June 1, 2026",
      timeline: ["filed"],
      details: "Dispute submitted. Awaiting arbitrator assignment."
    };

    setTickets([newTicket, ...tickets]);
    setSuccessTicket(newTicket);
    setIsFiling(false);

    // Reset Form Fields
    setSwapId('');
    setDisputeType('');
    setDescription('');
    setEvidenceLink('');
  };

  const steps = [
    { num: "01", title: t("dispute_s1_title") || "Mutual Agreement Review", desc: t("dispute_s1_desc") || "Start by reviewing initial chat terms directly in the message panel to resolve differences amicably.", accent: "#ff6b00" },
    { num: "02", title: t("dispute_s2_title") || "File Formal Mediation", desc: t("dispute_s2_desc") || "If mutual negotiations fail, submit a formal claim with screenshots and reference links.", accent: "#3b82f6" },
    { num: "03", title: t("dispute_s3_title") || "Arbitration & Support", desc: t("dispute_s3_desc") || "Gadd Kaam support reviews the evidence logs and completes fair mediation guidelines:", accent: "#10b981", lists: [t("dispute_s3_l1") || "Review exchange history logs", t("dispute_s3_l2") || "Enforce profile rating penalty to bad actors", t("dispute_s3_l3") || "Re-establish fair balance exchanges"] }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── BACKGROUND ACCENT ORBS ── */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[25%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-orange/4 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Header / Hero Block */}
        <header className="text-center mb-16 reveal fade-up">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-wider mb-4 border border-blue-500/20 shadow-sm shadow-blue-500/5 select-none">
            <Scale size={13} /> 
            <span>{t("dispute_badge") || "Fair Swap Guarantee"}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("dispute_title") || "Dispute Resolution Hub"}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("dispute_subtitle") || "Every talent barter is backed by dedicated arbitrator support. Learn how we guarantee fair trades for everyone."}
          </p>
        </header>

        {/* Dual Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Column: Resolution Protocol & Core Info (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Core Informative Glass Panel */}
            <section className="glass-panel reveal fade-up p-8 bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-850/80 rounded-3xl shadow-xl shadow-black/[0.01]">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-3.5 flex items-center gap-2">
                <Scale className="text-primary-orange" size={20} /> 
                <span>{t("dispute_how_title") || "How We Keep Bartering Safe"}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                {t("dispute_how_desc") || "Gadd Kaam values community trust above all else. If you enter into a talent swap and your partner fails to deliver or breaches exchange terms, our resolution system ensures that they are held accountable and that we assist you in matching with a verified swapper."}
              </p>
            </section>

            {/* Dynamic Step-by-Step Resolution Protocol */}
            <section className="flex flex-col gap-6">
              <h2 className="reveal fade-up text-xl font-extrabold text-slate-800 dark:text-white mb-2">
                {t("dispute_workflow_title") || "Resolution Protocol Steps"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="group/step p-6 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850/85 hover:border-slate-350 dark:hover:border-slate-800 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden" 
                    style={{ 
                      borderTop: `4px solid ${step.accent}`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-black opacity-30 tracking-tight" style={{ color: step.accent }}>
                        {step.num}
                      </span>
                      <Sparkles size={16} className="opacity-0 group-hover/step:opacity-100 transition-opacity duration-300" style={{ color: step.accent }} />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-450 text-[11px] leading-relaxed font-medium mb-3">
                      {step.desc}
                    </p>
                    {step.lists && (
                      <ul className="text-[10px] font-bold text-slate-450 dark:text-slate-500 pl-4 list-disc flex flex-col gap-1.5">
                        {step.lists.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Vetted trust guidelines */}
            <section className="safety-notice-banner reveal fade-up p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 flex items-start gap-4 shadow-sm shadow-red-500/[0.01]">
              <div className="p-3 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 shadow-inner">
                <ShieldAlert size={26} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-extrabold text-xs text-red-500 uppercase tracking-widest">{t("dispute_note_title") || "Safety Warning Note"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                  {t("dispute_note_desc") || "Never offer or accept physical cash exchanges inside the barter. Doing so violates our community charter and invalidates our Fair Swap Guarantee and dispute support protection."}
                </p>
              </div>
            </section>

          </div>

          {/* Right Column: Dispute Filing Wizard & Tracking Dashboard (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            
            {/* Interactive Dispute Filing Wizard */}
            <section className="reveal scale-up p-8 bg-gradient-to-br from-[#0c1223]/90 to-[#060a12]/95 border border-slate-850 dark:border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden group/wizard">
              <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-primary-orange/5 blur-[40px] pointer-events-none" />

              {!isFiling && !successTicket && (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center mb-5 animate-pulse-glow shadow-md">
                    <AlertCircle size={28} />
                  </div>
                  <h2 className="text-lg font-extrabold text-white mb-2 tracking-tight">Need Arbitrator Mediation?</h2>
                  <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed mb-6 font-medium">
                    If you have an active barter swap project where the partner breached trust agreements, you can launch our dispute wizard now.
                  </p>
                  <button 
                    onClick={handleStartFiling}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/35 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                  >
                    <span>File Dispute Ticket</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Wizard Form Step 1: Select swap */}
              {isFiling && filingStep === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Step 1 of 3</span>
                    <span className="text-xs font-bold text-primary-orange">Select Swap Contract</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Choose Swap Agreement</label>
                    <div className="flex flex-col gap-2">
                      {activeSwaps.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSwapId(s.id)}
                          className={`p-3.5 text-left rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-between ${
                            swapId === s.id
                              ? 'bg-primary-orange/10 border-primary-orange text-white'
                              : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-white'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-white text-xs tracking-tight">{s.title}</span>
                            <span className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
                              <User size={10} /> Partner: {s.partner}
                            </span>
                          </div>
                          {swapId === s.id && <span className="w-1.5 h-1.5 bg-primary-orange rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-850">
                    <button 
                      type="button" 
                      onClick={() => setIsFiling(false)}
                      className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-primary-orange hover:bg-primary-orange-hover rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition-all duration-200"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Form Step 2: Reason & Description */}
              {isFiling && filingStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Step 2 of 3</span>
                    <span className="text-xs font-bold text-primary-orange">Define Disagreement</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Reason Type</label>
                    <select
                      value={disputeType}
                      onChange={(e) => setDisputeType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-white outline-none focus:border-primary-orange font-medium"
                    >
                      <option value="">Select reason...</option>
                      <option value="Deadline Missed">Partner missed exchange deadline entirely</option>
                      <option value="Quality Mismatch">Delivered work does not match agreed terms</option>
                      <option value="Communication breakdown">Partner stopped responding / ghosted</option>
                      <option value="Other guidelines breach">Other community guideline violation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Detailed Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details of what went wrong..."
                      className="w-full h-24 bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-white outline-none focus:border-primary-orange resize-none placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-850">
                    <button 
                      type="button" 
                      onClick={handlePrevStep}
                      className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-primary-orange hover:bg-primary-orange-hover rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition-all duration-200"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Form Step 3: Evidences & Submission */}
              {isFiling && filingStep === 3 && (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Step 3 of 3</span>
                    <span className="text-xs font-bold text-primary-orange">Attach Evidence</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Evidence Link (Screenshots / Portfolios)</label>
                    <input
                      type="url"
                      value={evidenceLink}
                      onChange={(e) => setEvidenceLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/... (Optional)"
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-white outline-none focus:border-primary-orange placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-yellow-500 text-[10px] leading-relaxed font-bold">
                    ⚠️ By submitting, you authorize Gadd Kaam support to review the encrypted swap messages and portfolio files linked to this exchange agreement.
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-850">
                    <button 
                      type="button" 
                      onClick={handlePrevStep}
                      className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition-all duration-200 shadow-md shadow-orange-500/10 hover:shadow-orange-500/30"
                    >
                      Submit Claim
                    </button>
                  </div>
                </form>
              )}

              {/* Wizard Filing Success Card */}
              {successTicket && (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-5 animate-pulse-glow shadow-md">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="text-lg font-extrabold text-white mb-1 tracking-tight">Claim Filed Successfully</h2>
                  <span className="text-[10px] font-black text-slate-500 tracking-wide uppercase mb-3">TICKET ID: {successTicket.id}</span>
                  <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed mb-6 font-medium">
                    Your dispute has been received. Our community arbitrator will assign the case within 12 hours. You can track updates in the tracker below.
                  </p>
                  <button 
                    onClick={() => setSuccessTicket(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white rounded-xl cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}

            </section>

            {/* Active Dispute Case Tracker / Dashboard (Live Tickets Updates) */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center select-none">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-450 dark:text-slate-550" />
                  <span>Mediations Case Tracker</span>
                </h3>
                <span className="text-[10px] font-extrabold text-primary-orange flex items-center gap-1">
                  <RefreshCw size={10} className="animate-spin" /> Live Updates
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {tickets.map((t, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 bg-white/70 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900/60 rounded-2xl shadow-md hover:border-slate-300 dark:hover:border-slate-800 transition-colors duration-250 flex flex-col gap-3.5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{t.swap}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550">ID: {t.id} • Partner: {t.partner}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        t.status === 'resolved' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : t.status === 'under_review'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse'
                          : 'bg-orange-500/10 text-primary-orange border border-orange-500/20'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Timeline Tracker Progress Bar */}
                    <div className="flex items-center justify-between w-full pt-1">
                      {['filed', 'review', 'arbitration', 'resolved'].map((step, sIdx) => {
                        const isCompleted = t.timeline.includes(step);
                        const isLastActive = t.timeline[t.timeline.length - 1] === step;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1">
                              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'bg-transparent border-slate-300 dark:border-slate-800'
                              }`}>
                                {isCompleted && <span className="w-1 h-1 bg-white rounded-full" />}
                              </span>
                              <span className={`text-[8px] font-black uppercase tracking-wider ${
                                isLastActive 
                                  ? 'text-primary-orange font-black' 
                                  : isCompleted 
                                  ? 'text-slate-650 dark:text-slate-350 font-bold' 
                                  : 'text-slate-400 dark:text-slate-600'
                              }`}>
                                {step}
                              </span>
                            </div>
                            {sIdx < 3 && (
                              <div className={`flex-1 h-[2px] mb-3 ${
                                t.timeline.includes(['filed', 'review', 'arbitration', 'resolved'][sIdx + 1])
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200 dark:bg-slate-900'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-950/65 rounded-xl border border-slate-200/60 dark:border-slate-900/60 text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 select-none leading-relaxed">
                      <Clock size={12} className="text-slate-400 flex-shrink-0" />
                      <span>{t.status === 'resolved' ? t.resolution : t.details}</span>
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default DisputeResolutionPage;
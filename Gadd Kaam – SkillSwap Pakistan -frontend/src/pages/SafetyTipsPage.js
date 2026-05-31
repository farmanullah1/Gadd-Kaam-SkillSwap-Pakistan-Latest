// src/pages/SafetyTipsPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { 
  ShieldAlert, Users, PhoneCall, AlertOctagon, Sparkles, MapPin, Eye, 
  ShieldCheck, HelpCircle, Trophy, CheckCircle2, XCircle, AlertCircle, ArrowRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';

function SafetyTipsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  
  // Interactive Safety Quiz States
  const [isCertified, setIsCertified] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Check if user is already safety certified
    const certified = localStorage.getItem('safety_certified') === 'true';
    if (certified) setIsCertified(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const tips = [
    {
      title: t("safety_page_tip1_title") || "Cashless Protection Guarantee",
      desc: t("safety_page_tip1_desc") || "Never pay cash or accept money inside the barter swap. All exchanges must be purely skill-for-skill talent barters.",
      icon: <ShieldCheck size={28} />,
      accent: "#ff6b00"
    },
    {
      title: t("safety_page_tip2_title") || "Public Meetups Only",
      desc: t("safety_page_tip2_desc") || "If you need to meet physically to swap skills (like camera repair or language tutoring), choose a busy, public cafe, library, or university campus.",
      icon: <MapPin size={28} />,
      accent: "#3b82f6"
    },
    {
      title: t("safety_page_tip3_title") || "Keep Chats Secure",
      desc: t("safety_page_tip3_desc") || "Keep your communications inside Gadd Kaam messaging channels. Never share personal phone numbers, CNICs, or email addresses.",
      icon: <Eye size={28} />,
      accent: "#ec4899"
    },
    {
      title: t("safety_page_tip4_title") || "Verify Profiles First",
      desc: t("safety_page_tip4_desc") || "Review your partner's profile ratings, positive badges, and swapper feedback comments prior to starting a collaborative barter.",
      icon: <Users size={28} />,
      accent: "#e11d48"
    }
  ];

  // Interactive Quiz Questions
  const quizQuestions = [
    {
      q: "A barter partner offers to pay you some cash outside the platform to complete an extra task. Is this allowed?",
      options: [
        { text: "Yes, as long as both of us agree in chat.", isCorrect: false },
        { text: "No, cash exchanges violate platform policies and void our Fair Swap protections.", isCorrect: true }
      ],
      explanation: "Gadd Kaam is a strictly cashless talent-exchange platform. Cash transactions increase fraud risk and invalidate dispute protections."
    },
    {
      q: "You are planning a physical meetup to swap hands-on skills (e.g. computer repair tutoring). Where should you meet?",
      options: [
        { text: "At the partner's private residence or isolated area.", isCorrect: false },
        { text: "In a busy public place like a university library, cafe, or crowded marketplace.", isCorrect: true }
      ],
      explanation: "Always prioritize physical safety by meeting in public, crowded, well-lit spaces. Never meet in private or secluded locations alone."
    },
    {
      q: "Your swap partner asks for your national CNIC details, account passwords, or personal phone number verification codes. What do you do?",
      options: [
        { text: "Send them immediately to help complete verification.", isCorrect: false },
        { text: "Refuse, end communication immediately, and report the swapper to Gadd Kaam Support.", isCorrect: true }
      ],
      explanation: "Never share sensitive private credentials or verification codes with anyone. Gadd Kaam staff will never ask for account credentials."
    }
  ];

  const handleOptionSelect = (idx) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    
    if (quizQuestions[currentQuestion].options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      if (score + (quizQuestions[currentQuestion].options[selectedOption]?.isCorrect ? 1 : 0) === quizQuestions.length) {
        setIsCertified(true);
        localStorage.setItem('safety_certified', 'true');
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
    setQuizActive(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── BACKGROUND ACCENT MESH GLOWS ── */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-red-500/4 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary-orange/3 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Title Header */}
        <header className="text-center mb-16 reveal fade-up">
          <div className="flex flex-col items-center">
            {isCertified ? (
              <span className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse-glow">
                <ShieldCheck size={14} /> 
                <span>Certified Safe Swapper</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-wider mb-4 border border-red-500/20 shadow-sm shadow-red-500/5 select-none">
                <ShieldAlert size={14} /> 
                <span>{t("safety_page_badge") || "Safety First charter"}</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("safety_page_title") || "Community Safety & Trust Guidelines"}
          </h1>
          <p className="text-sm md:text-base text-slate-550 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("safety_page_subtitle") || "cashless bartering relies on mutual respect and absolute trust. Read our verified guidelines to stay secure."}
          </p>
        </header>

        {/* Dual Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Column: Safety Tips & Warning notice (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Informative Visual Panel */}
            <section className="safety-notice-banner p-6 rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850/80 flex items-start gap-4 shadow-xl shadow-black/[0.01]">
              <div className="p-3.5 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 shadow-inner">
                <AlertOctagon size={28} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-extrabold text-sm text-red-500 uppercase tracking-widest">{t("safety_page_report_title") || "Reporting Suspicious Activity"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                  {t("safety_page_report_desc") || "If a barter partner behaves inappropriately, asks for cash exchanges, or attempts to make a deal outside platform channels, document the conversation and report them immediately using our Dispute resolution portal."}
                </p>
              </div>
            </section>

            {/* Tips Layout Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal fade-up">
              {tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="group/tip p-6 bg-white/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850/85 hover:border-slate-350 dark:hover:border-slate-800 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 left-0 w-1.2 h-full transition-all duration-300" 
                    style={{ background: tip.accent }} 
                  />

                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3.5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover/tip:scale-115 transition-transform duration-300" 
                      style={{ color: tip.accent, background: `${tip.accent}14`, border: `1.5px solid ${tip.accent}20` }}
                    >
                      {tip.icon}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-extrabold text-sm text-slate-805 dark:text-white leading-tight tracking-tight">{tip.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-medium">{tip.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Support helpline cta banner */}
            <section className="p-8 border border-slate-200 dark:border-slate-850/80 rounded-3xl bg-white/40 dark:bg-slate-950/10 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
              <Sparkles size={32} className="text-primary-orange mb-4.5 animate-float" />
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">{t("safety_page_badge_title") || "Vetted Trust Badges"}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-450 max-w-[500px] leading-relaxed mb-6 font-medium">
                {t("safety_page_badge_desc") || "Swappers who prioritize safety and achieve verified badges maintain higher platform reach and are listed first on marketplace search streams."}
              </p>
              <button 
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-colors flex items-center gap-2" 
                onClick={() => setShowHelplinePopup(true)}
              >
                <PhoneCall size={14} /> 
                <span>{t("safety_page_badge_btn") || "Request Trust Verification"}</span>
              </button>
            </section>

          </div>

          {/* Right Column: Gamified Safety Certification Quiz (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Holographic / Glowing Quiz Box Card */}
            <section className="reveal scale-up p-8 bg-gradient-to-br from-[#0c1223]/90 to-[#060a12]/95 border border-slate-850 dark:border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden group/quiz">
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-primary-orange/5 blur-[50px] pointer-events-none" />

              {!quizActive && !quizCompleted && (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-primary-orange border border-orange-500/20 flex items-center justify-center mb-5 animate-pulse-glow shadow-md">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-lg font-extrabold text-white mb-2 tracking-tight">Swapper Safety Certification</h2>
                  <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed mb-6 font-medium">
                    {isCertified 
                      ? "You have already completed your safety charter evaluation! Take the quiz again at any time to refresh your credentials."
                      : "Prove your knowledge of secure trading terms to earn an official Gadd Kaam Safety Certification Badge on your public profile!"
                    }
                  </p>
                  <button 
                    onClick={() => { setQuizActive(true); setQuizCompleted(false); setScore(0); setCurrentQuestion(0); }}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/35 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                  >
                    <span>{isCertified ? "Retake Safety Quiz" : "Launch Safety Quiz"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Active Quiz steps */}
              {quizActive && !quizCompleted && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 select-none">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span className="text-[10px] font-bold bg-orange-500/10 text-primary-orange border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Score: {score}</span>
                  </div>
                  
                  <div className="flex flex-col gap-4.5 mt-2">
                    <div className="flex gap-2 items-start text-sm font-extrabold text-white leading-snug">
                      <HelpCircle size={18} className="text-primary-orange flex-shrink-0 mt-0.5" />
                      <h4>{quizQuestions[currentQuestion].q}</h4>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-2">
                      {quizQuestions[currentQuestion].options.map((opt, oIdx) => {
                        const isSelected = selectedOption === oIdx;
                        let optionStyle = 'bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900/60 hover:text-white';
                        
                        if (showFeedback) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
                          } else if (isSelected) {
                            optionStyle = 'bg-red-500/10 border-red-500 text-red-400';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleOptionSelect(oIdx)}
                            className={`p-4 text-left rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                            disabled={showFeedback}
                          >
                            <span>{opt.text}</span>
                            {showFeedback && opt.isCorrect && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                            {showFeedback && isSelected && !opt.isCorrect && <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {showFeedback && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-850 text-[10px] leading-relaxed text-slate-400 font-semibold flex items-start gap-2.5 animate-alert-pop">
                      <AlertCircle size={14} className="text-primary-orange flex-shrink-0 mt-0.5" />
                      <span>{quizQuestions[currentQuestion].explanation}</span>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-850 justify-end">
                    {showFeedback && (
                      <button 
                        type="button" 
                        onClick={handleNextQuestion}
                        className="py-3 px-6 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                      >
                        <span>{currentQuestion < quizQuestions.length - 1 ? "Next Question" : "View Certified Badge"}</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Completed Results Card */}
              {quizCompleted && (
                <div className="flex flex-col items-center text-center p-4">
                  {score === quizQuestions.length ? (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mb-5 animate-pulse-glow shadow-md">
                        <Trophy size={32} />
                      </div>
                      <h2 className="text-lg font-extrabold text-white mb-1 tracking-tight">Congratulations! 3/3 Score</h2>
                      <span className="text-[10px] font-black text-emerald-400 tracking-wider uppercase mb-4 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Certified safe partner</span>
                      <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed mb-6 font-medium">
                        You scored 100% on the safety evaluation. Your public profile has been updated with the **Safety Certified Partner Badge** to build trust in your swaps!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mb-5 animate-pulse shadow-md">
                        <XCircle size={32} />
                      </div>
                      <h2 className="text-lg font-extrabold text-white mb-1 tracking-tight">Assessment Incomplete: {score}/{quizQuestions.length}</h2>
                      <span className="text-[10px] font-black text-red-400 tracking-wider uppercase mb-4 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">Try Again</span>
                      <p className="text-xs text-slate-400 max-w-[340px] leading-relaxed mb-6 font-medium">
                        You missed a few safety guidelines. To earn your certification badge and list first in swaps, you must answer all safety questions correctly.
                      </p>
                    </>
                  )}
                  
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => setQuizCompleted(false)}
                      className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white rounded-xl cursor-pointer transition-colors"
                    >
                      Close
                    </button>
                    {score < quizQuestions.length && (
                      <button 
                        onClick={handleResetQuiz}
                        className="flex-1 py-3 bg-primary-orange hover:bg-primary-orange-hover text-[10px] font-black uppercase tracking-wider text-white rounded-xl cursor-pointer transition-colors shadow-md shadow-orange-500/10"
                      >
                        Retake Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}

            </section>

          </div>

        </div>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default SafetyTipsPage;

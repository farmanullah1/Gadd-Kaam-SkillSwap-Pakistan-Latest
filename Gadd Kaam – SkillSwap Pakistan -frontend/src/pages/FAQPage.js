// src/pages/FAQPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { ChevronDown, HelpCircle, Search, ShieldAlert, Sparkles, MessageSquare, BookOpen, User, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';

function FAQPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0); // Default open first item
  
  // Search & Category Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Helpfulness Feedbacks State
  const [helpfulVotes, setHelpfulVotes] = useState({});

  useScrollReveal(); // Trigger scroll reveals

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleVote = (idx, voteType) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [idx]: voteType
    }));
  };

  // Comprehensive Categorized FAQ Dataset
  const faqs = [
    { 
      q: t("faq_page_q1") || "How does money-less skill swapping work?", 
      a: t("faq_page_a1") || "Cashless bartering lets you exchange your skills directly with another swapper. For example, you can design a logo in exchange for SEO tutoring. No money is exchanged, creating a pure trade of talent.",
      category: "bartering",
      icon: <BookOpen size={16} />
    },
    { 
      q: t("faq_page_q2") || "Is my personal identity verified?", 
      a: t("faq_page_a2") || "Yes, Gadd Kaam uses a secure CNIC verification framework to verify all swappers. Profile checkmarks are only granted to verified accounts to ensure community trust and safety.",
      category: "account",
      icon: <User size={16} />
    },
    { 
      q: t("faq_page_q3") || "What if the swap partner does not complete their part?", 
      a: t("faq_page_a3") || "Gadd Kaam guarantees safe trading. If a swapper fails to fulfill their exchange terms or behaves dishonestly, you can file a case in the Dispute Resolution Hub. We hold account ratings accountable.",
      category: "disputes",
      icon: <ShieldAlert size={16} />
    },
    { 
      q: t("faq_page_q4") || "Can I barter with swappers from other provinces?", 
      a: t("faq_page_a4") || "Absolutely! Swappers across all regions of Pakistan (Punjab, Sindh, KPK, Balochistan, and Federal) can connect. Swaps can be done remotely online or physically in safe public meetups.",
      category: "bartering",
      icon: <BookOpen size={16} />
    },
    {
      q: "Is there a limit to how many skills I can swap?",
      a: "No! There are no limits to the number of barters you can complete. You can create multiple requests, offer diverse skills, and expand your community connections freely.",
      category: "bartering",
      icon: <BookOpen size={16} />
    },
    {
      q: "How do I protect my physical safety during meetups?",
      a: "Always plan skill exchanges in busy, public areas (like cafes, libraries, or campuses). Never meet in private residences, and review your partner's certified safe swapper badge beforehand.",
      category: "safety",
      icon: <ShieldCheck size={16} />
    },
    {
      q: "Can I delete or modify an active skill request?",
      a: "Yes! You can manage your skill offerings anytime from your My Skills portal. You can edit the description, update photos, or delete active listings as needed.",
      category: "account",
      icon: <User size={16} />
    }
  ];

  // Filtering Logic
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── BACKGROUND GLOW ACCENT ORBS ── */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary-orange/4 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/4 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Title Hero Section */}
        <header className="text-center mb-12 reveal fade-up">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 text-primary-orange text-xs font-black uppercase tracking-wider mb-4 border border-orange-500/20 shadow-sm shadow-orange-500/5 select-none">
            <HelpCircle size={13} /> 
            <span>{t("faq_page_badge") || "Self-Service Center"}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("faq_page_title") || "Frequently Asked Questions"}
          </h1>
          <p className="text-sm md:text-base text-slate-505 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("faq_page_subtitle") || "Answers to the most common questions about money-less bartering in Pakistan."}
          </p>
        </header>

        {/* Dynamic Filters & Capsule Search Hub */}
        <div className="reveal fade-up flex flex-col md:flex-row gap-4 items-center bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/30 p-5 rounded-3xl shadow-xl shadow-black/[0.01] mb-10 w-full">
          {/* Capsule Search Bar */}
          <div className="relative w-full md:flex-1">
            <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-555 pointer-events-none">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 dark:focus:ring-primary-orange/5 text-xs rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium" 
              placeholder="Search help topics or keywords instantly..." 
            />
          </div>

          {/* Categories select tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: 'all', name: "All FAQs" },
              { id: 'bartering', name: "Swapping" },
              { id: 'account', name: "Account" },
              { id: 'safety', name: "Safety" },
              { id: 'disputes', name: "Disputes" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-primary-orange to-orange-500 text-white shadow-lg shadow-orange-500/20 border border-transparent'
                    : 'bg-slate-105 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Accordion List Grid */}
        <div className="faq-accordion-group flex flex-col gap-4 mb-16 reveal fade-up">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div 
                  key={index} 
                  className={`faq-accordion-item rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'bg-white/80 dark:bg-slate-950/50 border-primary-orange/40 shadow-lg shadow-orange-500/[0.01]' 
                      : 'bg-white/40 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-800'
                  }`}
                >
                  <button 
                    className="w-full flex justify-between items-center px-6 py-5 bg-transparent border-none text-left cursor-pointer transition-colors"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-3 font-extrabold text-sm text-slate-800 dark:text-white pr-4">
                      <HelpCircle size={18} className={`flex-shrink-0 transition-colors ${isExpanded ? 'text-primary-orange' : 'text-slate-400 dark:text-slate-500'}`} />
                      {item.q}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary-orange' : ''}`} size={18} />
                  </button>
                  
                  <div 
                    className={`faq-answer-panel transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-[300px] border-t border-slate-200 dark:border-slate-900/60' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 py-5 bg-slate-500/[0.01] dark:bg-slate-950/10">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-1">
                        {item.a}
                      </p>

                      {/* Interactive Helpfulness Feedback Buttons */}
                      {!helpfulVotes[index] ? (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-900/60 select-none">
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Was this helpful?</span>
                          <button 
                            onClick={() => handleVote(index, 'yes')} 
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/10 text-[10px] font-bold text-slate-500 hover:text-emerald-555 border border-slate-200 dark:border-slate-850 cursor-pointer transition-all"
                          >
                            👍 Yes
                          </button>
                          <button 
                            onClick={() => handleVote(index, 'no')} 
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-red-500/10 text-[10px] font-bold text-slate-500 hover:text-red-555 border border-slate-200 dark:border-slate-850 cursor-pointer transition-all"
                          >
                            👎 No
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest mt-4 pt-4 border-t border-slate-100 dark:border-slate-900/60 animate-alert-pop">
                          ✓ Thank you for your feedback!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white/40 dark:bg-slate-950/20 rounded-3xl border border-slate-200 dark:border-slate-900 p-8 shadow-lg">
              <ShieldAlert size={48} className="text-slate-400 dark:text-slate-655 mx-auto mb-4" />
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1">No FAQ Topics Found</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 max-w-[320px] mx-auto leading-relaxed">
                We couldn't find any questions matching your query or selected category filter. Try clearing your search term.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Helpdesk CTA Card */}
        <div className="reveal fade-up p-8 md:p-10 bg-gradient-to-br from-white/80 via-white/90 to-slate-50/95 dark:from-[#0d1323]/90 dark:to-[#060a12]/95 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -left-12 -top-12 w-28 h-28 rounded-full bg-primary-orange/5 blur-[40px] pointer-events-none" />
          <h3 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white mb-2">
            {t("faq_unresolved_title") || "Still Have Questions?"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[600px] mx-auto leading-relaxed mb-6 font-medium">
            {t("faq_unresolved_desc") || "Our support team is available 24/7 to guide you through verification, disputing exchanges, or getting started."}
          </p>
          <button 
            className="px-6 py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-orange-500/30 flex items-center justify-center gap-1.5 mx-auto"
            onClick={() => setShowHelplinePopup(true)}
          >
            <PhoneCall size={14} /> 
            <span>{t("faq_unresolved_btn") || "Contact Support Helpline"}</span>
          </button>
        </div>
        
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default FAQPage;
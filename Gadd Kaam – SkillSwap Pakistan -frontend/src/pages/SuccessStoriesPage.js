// src/pages/SuccessStoriesPage.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { Quote, Sparkles, Star, Award, Navigation, Heart, MapPin, Plus, Share2, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';

function SuccessStoriesPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  
  // Interactive Filter & Story States
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [isSharing, setIsSharing] = useState(false);

  // Form Fields
  const [formNames, setFormNames] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formHours, setFormHours] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Main Stories Interactive Database (state-managed!)
  const [stories, setStories] = useState([
    {
      id: 1,
      names: "Zainab Bibi & Sajid Ali",
      location: "Karachi, Sindh",
      province: "Sindh",
      skills: "Graphic Design ↔ React Web Dev",
      hours: "12 Hours Swapped",
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=ZB",
      quote: "Gadd Kaam helped me exchange my logo design skill for hands-on React training. Zainab was an amazing mentor, and we completed our barter swap in just one week without spending a single rupee!",
      likes: 42,
      hasLiked: false
    },
    {
      id: 2,
      names: "Muhammad Bilal & Tariq Baloch",
      location: "Lahore, Punjab",
      province: "Punjab",
      skills: "Plumbing ↔ English Practice",
      hours: "8 Hours Swapped",
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=MB",
      quote: "Bilal repaired my AC unit and kitchen pipes, and in return, I helped him prepare for his English proficiency examination. It was incredibly satisfying to trade real practical talents directly.",
      likes: 29,
      hasLiked: false
    },
    {
      id: 3,
      names: "Maria Khan & Kanza Yasmin",
      location: "Peshawar, KPK",
      province: "KPK",
      skills: "Python Coding ↔ Urdu Copywriting",
      hours: "18 Hours Swapped",
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=MK",
      quote: "I needed high-quality translation content for my local tourism portal, and Maria wanted to learn coding basics. We bartered over Zoom and achieved both our objectives cashless!",
      likes: 38,
      hasLiked: false
    },
    {
      id: 4,
      names: "Tariq Baloch & Zainab Bibi",
      location: "Quetta, Balochistan",
      province: "Balochistan",
      skills: "Mobile Repair ↔ Math Tutoring",
      hours: "6 Hours Swapped",
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=TB",
      quote: "Bartering my hardware smartphone fixing experience for Zainab's mathematics tutoring sessions was a lifesaver. Absolutely professional and trusted community protection.",
      likes: 18,
      hasLiked: false
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

  const handleLikeStory = (id) => {
    setStories(prev => prev.map(story => {
      if (story.id === id) {
        return {
          ...story,
          likes: story.hasLiked ? story.likes - 1 : story.likes + 1,
          hasLiked: !story.hasLiked
        };
      }
      return story;
    }));
  };

  const handleSubmitStory = (e) => {
    e.preventDefault();
    
    // Auto-detect Province from location text
    let prov = 'Sindh';
    const locLower = formLocation.toLowerCase();
    if (locLower.includes('punjab') || locLower.includes('lahore') || locLower.includes('multan')) prov = 'Punjab';
    else if (locLower.includes('kpk') || locLower.includes('peshawar') || locLower.includes('swat')) prov = 'KPK';
    else if (locLower.includes('balochistan') || locLower.includes('quetta') || locLower.includes('gwadar')) prov = 'Balochistan';

    const newStory = {
      id: Date.now(),
      names: formNames,
      location: formLocation,
      province: prov,
      skills: formSkills,
      hours: formHours,
      avatar: `https://placehold.co/100x100/6366f1/ffffff?text=${encodeURIComponent(formNames.slice(0, 2).toUpperCase())}`,
      quote: formQuote,
      likes: 1,
      hasLiked: true
    };

    setStories([newStory, ...stories]);
    setIsSharing(false);
    setShowSuccessToast(true);

    // Reset Form fields
    setFormNames('');
    setFormLocation('');
    setFormSkills('');
    setFormHours('');
    setFormQuote('');

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Filtering Logic
  const filteredStories = stories.filter(story => {
    return selectedProvince === 'all' || story.province === selectedProvince;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── BACKGROUND ACCENT MESH GLOWS ── */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-emerald-500/4 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary-orange/3 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={handleLogout} user={user} />

      <main className="flex-grow max-w-[1000px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12 reveal fade-up">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-500/20 shadow-sm shadow-emerald-500/5 select-none">
            <Award size={13} /> 
            <span>{t("stories_page_success_badge") || "Vetted Testimonials"}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("stories_page_success_title") || "Community Success Stories"}
          </h1>
          <p className="text-sm md:text-base text-slate-550 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("stories_page_success_subtitle") || "Inspiring real-life cashless barters accomplished across Pakistan."}
          </p>
        </div>

        {/* Dynamic Success Toast Notification */}
        {showSuccessToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400/30 animate-alert-pop">
            <CheckCircle2 size={16} />
            <span>✓ Story Published Successfully! Added to listing.</span>
          </div>
        )}

        {/* Global Stats Highlight Panel */}
        <div className="reveal fade-up p-8 bg-gradient-to-br from-white/70 via-white/80 to-slate-50/90 dark:from-[#0d1323]/50 dark:to-[#060a12]/50 backdrop-blur-xl border border-slate-200/80 dark:border-slate-850/80 rounded-3xl shadow-xl shadow-black/[0.01] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-primary-orange tracking-tight mb-1">45,000+</span>
              <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider leading-relaxed">
                {t("stories_page_success_stat_hours") || "Cashless Hours Swapped"}
              </span>
            </div>
            <div className="hidden md:block w-[1px] h-10 bg-slate-200 dark:bg-slate-800 self-center justify-self-center" />
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-blue-500 tracking-tight mb-1">15,000+</span>
              <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider leading-relaxed">
                {t("stories_page_success_stat_swappers") || "Talent Partners Connected"}
              </span>
            </div>
            <div className="hidden md:block w-[1px] h-10 bg-slate-200 dark:bg-slate-800 self-center justify-self-center" />
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-emerald-500 tracking-tight mb-1">98.6%</span>
              <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider leading-relaxed">
                {t("stories_page_success_stat_rating") || "Positive Swap Satisfaction"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Province Filter Tabs Capsule */}
        <div className="reveal fade-up flex flex-wrap justify-center items-center gap-2 mb-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/30 p-4 rounded-3xl shadow-xl shadow-black/[0.01] w-full">
          <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-550 tracking-wider mr-2 select-none flex items-center gap-1">
            <Navigation size={12} /> Filter Stories:
          </span>
          {[
            { id: 'all', name: "All Pakistan" },
            { id: 'Punjab', name: t("province_punjab") || "Punjab" },
            { id: 'Sindh', name: t("province_sindh") || "Sindh" },
            { id: 'KPK', name: t("province_kpk") || "KPK" },
            { id: 'Balochistan', name: t("province_balochistan") || "Balochistan" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedProvince(cat.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedProvince === cat.id
                  ? 'bg-gradient-to-r from-emerald-550 to-teal-500 dark:from-emerald-600 dark:to-teal-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent'
                  : 'bg-slate-105 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── INTERACTIVE SUCCESS STORY SUBMISSION BOARD ── */}
        {isSharing && (
          <form onSubmit={handleSubmitStory} className="reveal scale-up bg-gradient-to-br from-[#0c1223]/90 to-[#060a12]/95 border border-slate-850 dark:border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-12 animate-alert-pop">
            <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-primary-orange/5 blur-[40px] pointer-events-none" />
            <h3 className="text-base font-extrabold text-white mb-4 tracking-tight border-b border-slate-850 pb-3 uppercase">Share Your Barter Success</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-4.5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Your Names</label>
                <input 
                  type="text" 
                  value={formNames}
                  onChange={(e) => setFormNames(e.target.value)}
                  placeholder="e.g. Zainab Bibi & Sajid Ali" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-primary-orange font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Swap Location (City, Province)</label>
                <input 
                  type="text" 
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Lahore, Punjab" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-primary-orange font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-4.5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Skills Swapped</label>
                <input 
                  type="text" 
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  placeholder="e.g. Python coding ↔ UI Design" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-primary-orange font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Exchange Duration / Hours</label>
                <input 
                  type="text" 
                  value={formHours}
                  onChange={(e) => setFormHours(e.target.value)}
                  placeholder="e.g. 10 Hours Swapped" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-primary-orange font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Your Barter Experience Quote</label>
              <textarea 
                value={formQuote}
                onChange={(e) => setFormQuote(e.target.value)}
                placeholder="Describe how your skill exchange went, what you learned, and how it helped you bartering cashless..." 
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white outline-none focus:border-primary-orange resize-none placeholder:text-slate-650 font-medium"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-850">
              <button 
                type="button" 
                onClick={() => setIsSharing(false)}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="py-3 px-6 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all duration-200 shadow-md shadow-orange-500/10 hover:shadow-orange-500/30"
              >
                Publish Story
              </button>
            </div>
          </form>
        )}

        {/* Stories Listing */}
        <div className="flex flex-col gap-8 mb-16 reveal fade-up">
          {filteredStories.map((story, index) => (
            <div 
              key={index} 
              className="group/story p-8 bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200 dark:border-slate-850 hover:border-primary-orange/20 rounded-3xl shadow-xl shadow-black/[0.01] hover:-translate-y-1.5 transition-all duration-350 relative overflow-hidden"
            >
              {/* Dynamic Location Badge */}
              <div className="absolute top-6 right-6 inline-flex items-center gap-1 bg-orange-500/10 text-primary-orange px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/20 shadow-sm shadow-orange-500/5">
                <MapPin size={10} />
                <span>{story.location}</span>
              </div>

              <div className="flex gap-6 flex-wrap items-center md:items-start pt-2">
                
                {/* Avatar Frame with Verification */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full border-3 border-orange-500/20 dark:border-orange-500/15 p-1 shadow-lg shadow-black/10 bg-white dark:bg-slate-900 group-hover/story:scale-105 transition-transform duration-300">
                    <img src={story.avatar} alt={story.names} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white border-2 border-white dark:border-slate-950 shadow flex items-center justify-center">
                    <Star size={8} fill="currentColor" />
                  </div>
                </div>

                {/* Story Text and Interactive Stats */}
                <div className="flex-1 min-w-[280px] flex flex-col">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 group-hover/story:text-primary-orange transition-colors duration-250">{story.names}</h3>
                  <div className="flex flex-wrap gap-2.5 items-center text-xs font-bold text-slate-500 dark:text-slate-450 mb-4 select-none">
                    <span className="text-primary-orange uppercase text-[10.5px] tracking-wide font-black">{story.skills}</span>
                    <span className="text-slate-350 dark:text-slate-800">•</span>
                    <span className="text-slate-400 uppercase text-[10px] tracking-wide">{story.hours}</span>
                  </div>

                  <div className="relative pt-4 pb-2">
                    <Quote size={28} className="text-primary-orange/5 absolute top-[-5px] left-[-12px] select-none" />
                    <p className="text-slate-500 dark:text-slate-400 text-xs italic leading-relaxed font-medium pl-4 border-l-2 border-primary-orange/20 relative z-10">
                      "{story.quote}"
                    </p>
                  </div>

                  {/* Social Feedback Bar */}
                  <div className="flex gap-4.5 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-900/60 items-center select-none text-[11px] font-black uppercase text-slate-400">
                    <button 
                      onClick={() => handleLikeStory(story.id)}
                      className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        story.hasLiked 
                          ? 'text-red-500' 
                          : 'hover:text-red-500 text-slate-450 dark:text-slate-500'
                      }`}
                    >
                      <Heart size={14} className={story.hasLiked ? 'fill-red-500 stroke-red-500 scale-110' : ''} />
                      <span>{story.likes} Hearts</span>
                    </button>
                    <span className="text-slate-200 dark:text-slate-800 select-none">•</span>
                    <span className="flex items-center gap-1.5 text-slate-450 dark:text-slate-550">
                      <MessageSquare size={13} />
                      <span>Verified Swap</span>
                    </span>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Call to Action Panel */}
        <div className="reveal fade-up p-8 md:p-10 bg-gradient-to-br from-white/80 via-white/90 to-slate-50/95 dark:from-[#0d1323]/95 dark:to-[#060a12]/95 border border-primary-orange/20 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -left-12 -top-12 w-28 h-28 rounded-full bg-primary-orange/5 blur-[40px] pointer-events-none" />
          <Sparkles size={36} className="text-primary-orange mb-4 mx-auto animate-float" />
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white mb-2">
            {t("stories_page_success_write_title") || "Share Your Gadd Kaam Story!"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed mb-6 font-medium">
            {t("stories_page_success_write_desc") || "Have you completed a successful cashless exchange? Inspire others by posting your trade experience."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button 
              className="px-6 py-3.5 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-orange-500/30" 
              onClick={() => setIsSharing(true)}
            >
              Share Your Story
            </button>
            <button 
              className="px-6 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer transition-all duration-300" 
              onClick={() => window.location.href='/marketplace'}
            >
              {t("stories_page_success_btn_browse") || "Browse Active Swappers"}
            </button>
          </div>
        </div>

      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default SuccessStoriesPage;

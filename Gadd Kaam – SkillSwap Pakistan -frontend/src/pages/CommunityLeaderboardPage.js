// src/pages/CommunityLeaderboardPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useTranslation } from 'react-i18next';
import { Star, Search, Trophy, ShieldAlert, Navigation, MapPin, Crown } from 'lucide-react';

import useScrollReveal from '../hooks/useScrollReveal';

function CommunityLeaderboardPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // Mock Leaders Data
  const leaders = [
    {
      name: "Zainab Bibi",
      role: "Professional Graphic Designer",
      province: "Sindh",
      location: "Karachi",
      swaps: 48,
      hours: 96,
      rating: 4.9,
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=ZB",
      badges: ["top_swapper", "verified", "pillar"]
    },
    {
      name: "Muhammad Bilal",
      role: "AC Technician & Plumber",
      province: "Punjab",
      location: "Lahore",
      swaps: 42,
      hours: 84,
      rating: 4.8,
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=MB",
      badges: ["top_swapper", "verified"]
    },
    {
      name: "Maria Khan",
      role: "English Language Tutor",
      province: "KPK",
      location: "Peshawar",
      swaps: 36,
      hours: 72,
      rating: 5.0,
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=MK",
      badges: ["top_swapper", "pillar"]
    },
    {
      name: "Tariq Baloch",
      role: "Smartphone Repair Expert",
      province: "Balochistan",
      location: "Quetta",
      swaps: 28,
      hours: 56,
      rating: 4.7,
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=TB",
      badges: ["first_swap", "verified"]
    },
    {
      name: "Kanza Yasmin",
      role: "SEO Copywriter",
      province: "Sindh",
      location: "Karachi",
      swaps: 24,
      hours: 48,
      rating: 4.9,
      avatar: "https://placehold.co/100x100/a78bfa/ffffff?text=KY",
      badges: ["verified"]
    },
    {
      name: "Sajid Ali",
      role: "Mathematics Tutor",
      province: "Punjab",
      location: "Multan",
      swaps: 18,
      hours: 36,
      rating: 4.6,
      avatar: "https://placehold.co/100x100/64748b/ffffff?text=SA",
      badges: ["first_swap"]
    }
  ];

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          leader.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          leader.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === '' || leader.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  const podiumWinners = filteredLeaders.slice(0, 3);
  const listLeaders = filteredLeaders.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOWS ── */}
      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary-orange/5 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-500/3 blur-[130px] pointer-events-none" aria-hidden="true" />

      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12 reveal fade-up">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 text-primary-orange text-xs font-black uppercase tracking-wider mb-4 border border-orange-500/20 shadow-sm shadow-orange-500/5 select-none">
            <Trophy size={13} /> 
            <span>{t("leaderboard_badge") || "Community Champions"}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {t("leaderboard_page_title") || "Community Talent Leaderboard"}
          </h1>
          <p className="text-sm md:text-base text-slate-505 dark:text-slate-400 max-w-[650px] mx-auto leading-relaxed font-medium">
            {t("leaderboard_page_subtitle") || "Meet Pakistan's top talent barter champions and verified community pillars."}
          </p>
        </div>

        {/* Filters and Search Bar Capsule */}
        <div className="reveal fade-up flex flex-col lg:flex-row gap-4 items-center bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/30 p-5 rounded-3xl shadow-xl shadow-black/[0.01] mb-12 w-full">
          {/* Search input field */}
          <div className="relative w-full lg:flex-1">
            <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              className="w-full bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 dark:focus:ring-primary-orange/5 text-xs rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium" 
              placeholder={t("leaderboard_search_placeholder") || "Search swappers by name, skill, or province..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick province filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: '', name: t("leaderboard_all_provinces") || 'All Pakistan' },
              { id: 'Punjab', name: t("province_punjab") || 'Punjab' },
              { id: 'Sindh', name: t("province_sindh") || 'Sindh' },
              { id: 'KPK', name: t("province_kpk") || 'KPK' },
              { id: 'Balochistan', name: t("province_balochistan") || 'Balochistan' }
            ].map((prov) => (
              <button
                key={prov.id}
                onClick={() => setSelectedProvince(prov.id)}
                className={`px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedProvince === prov.id
                    ? 'bg-gradient-to-r from-primary-orange to-orange-500 text-white shadow-lg shadow-orange-500/20 border border-transparent'
                    : 'bg-slate-100 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {prov.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── CHAMPIONS PODIUM ── */}
        {podiumWinners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-center mb-16 max-w-[900px] mx-auto pt-6 px-4">
            
            {/* Rank 2 (Left) */}
            {podiumWinners[1] && (
              <div className="order-2 md:order-1 group/podium flex flex-col items-center bg-gradient-to-br from-white/85 via-white/95 to-slate-50/95 dark:from-slate-900/40 dark:via-slate-900/50 dark:to-slate-950/60 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl p-6 shadow-xl hover:-translate-y-2 transition-all duration-350 text-center relative overflow-hidden h-[280px] md:h-[260px] justify-end">
                <div className="absolute top-4 left-4 font-black text-slate-400/40 dark:text-slate-500/20 text-3xl select-none">2</div>
                <div className="relative mb-4 flex flex-col items-center">
                  <div className="w-18 h-18 rounded-full border-3 border-slate-300 dark:border-slate-500 p-1 shadow-lg shadow-black/10 bg-white dark:bg-slate-900">
                    <img src={podiumWinners[1].avatar} alt={podiumWinners[1].name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="absolute bottom-[-10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-slate-300/30 dark:border-slate-700">🥈 Rank 2</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight leading-tight mb-1">{podiumWinners[1].name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2 line-clamp-1">{podiumWinners[1].role}</p>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1"><MapPin size={11} /> {podiumWinners[1].location}</span>
                <div className="flex gap-4 text-xs font-black text-slate-700 dark:text-white pt-2.5 border-t border-slate-205 dark:border-slate-800/60 w-full justify-center">
                  <div><span className="text-primary-orange">{podiumWinners[1].swaps}</span> <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Swaps</span></div>
                  <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 self-center" />
                  <div><span className="text-emerald-500">{podiumWinners[1].hours}h</span> <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Time</span></div>
                </div>
              </div>
            )}

            {/* Rank 1 (Middle - Taller, glowing) */}
            {podiumWinners[0] && (
              <div className="order-1 md:order-2 group/podium flex flex-col items-center bg-gradient-to-br from-white via-amber-50/10 to-amber-50/20 dark:from-slate-900/60 dark:via-slate-900/70 dark:to-slate-950/80 border border-amber-400/40 dark:border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl hover:-translate-y-3.5 transition-all duration-350 text-center relative overflow-hidden h-[320px] md:h-[300px] justify-end ring-4 ring-amber-500/5">
                <div className="absolute top-4 right-4 font-black text-amber-500/30 dark:text-amber-500/15 text-4xl select-none">1</div>
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/5 rounded-full blur-[30px] pointer-events-none" />
                
                {/* Crown indicator */}
                <div className="absolute top-6 flex flex-col items-center justify-center animate-float">
                  <Crown size={28} className="text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]" />
                </div>

                <div className="relative mb-4 mt-8 flex flex-col items-center">
                  <div className="w-22 h-22 rounded-full border-3 border-amber-400 p-1 shadow-xl shadow-amber-500/10 bg-amber-400/5 animate-pulse-glow">
                    <img src={podiumWinners[0].avatar} alt={podiumWinners[0].name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="absolute bottom-[-10px] bg-amber-400 dark:bg-amber-500 text-amber-955 dark:text-amber-950 text-[10.5px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/10 border border-amber-400 dark:border-amber-400/35">🏆 Champion</span>
                </div>
                <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight leading-tight mb-1 group-hover/podium:text-amber-500 dark:group-hover/podium:text-amber-455 transition-colors">{podiumWinners[0].name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-350 font-semibold mb-2 line-clamp-1">{podiumWinners[0].role}</p>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1"><MapPin size={11} /> {podiumWinners[0].location}</span>
                <div className="flex gap-4 text-xs font-black text-slate-700 dark:text-white pt-2.5 border-t border-slate-200 dark:border-slate-800/60 w-full justify-center">
                  <div><span className="text-amber-600 dark:text-amber-400">{podiumWinners[0].swaps}</span> <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Swaps</span></div>
                  <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 self-center" />
                  <div><span className="text-emerald-600 dark:text-emerald-400">{podiumWinners[0].hours}h</span> <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Time</span></div>
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {podiumWinners[2] && (
              <div className="order-3 group/podium flex flex-col items-center bg-gradient-to-br from-white/85 via-white/95 to-slate-50/95 dark:from-slate-900/40 dark:via-slate-900/50 dark:to-slate-950/60 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl p-6 shadow-xl hover:-translate-y-2 transition-all duration-350 text-center relative overflow-hidden h-[260px] md:h-[240px] justify-end">
                <div className="absolute top-4 right-4 font-black text-orange-400/40 dark:text-orange-500/20 text-3xl select-none">3</div>
                <div className="relative mb-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-3 border-orange-500/60 dark:border-orange-650/70 p-1 shadow-lg shadow-black/10 bg-white dark:bg-slate-900">
                    <img src={podiumWinners[2].avatar} alt={podiumWinners[2].name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="absolute bottom-[-10px] bg-orange-500/80 dark:bg-orange-600/80 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-orange-500/30 dark:border-orange-500/40">🥉 Rank 3</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight leading-tight mb-1">{podiumWinners[2].name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2 line-clamp-1">{podiumWinners[2].role}</p>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1"><MapPin size={11} /> {podiumWinners[2].location}</span>
                <div className="flex gap-4 text-xs font-black text-slate-700 dark:text-white pt-2.5 border-t border-slate-202 dark:border-slate-800/60 w-full justify-center">
                  <div><span className="text-primary-orange">{podiumWinners[2].swaps}</span> <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Swaps</span></div>
                  <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 self-center" />
                  <div><span className="text-emerald-500">{podiumWinners[2].hours}h</span> <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Time</span></div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── LEADERBOARD TABLE ── */}
        {listLeaders.length > 0 ? (
          <div className="reveal scale-up bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-900/10 rounded-3xl overflow-hidden shadow-2xl mb-16">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-900/80 text-[11px] font-black text-slate-400 dark:text-slate-450 uppercase tracking-widest select-none">
                    <th className="py-5 px-6">{t("leaderboard_rank") || "Rank"}</th>
                    <th className="py-5 px-6">{t("leaderboard_user") || "User"}</th>
                    <th className="py-5 px-6">{t("leaderboard_province") || "Province"}</th>
                    <th className="py-5 px-6 text-center">{t("leaderboard_swaps") || "Successful Swaps"}</th>
                    <th className="py-5 px-6 text-center">{t("leaderboard_hours") || "Hours Swapped"}</th>
                    <th className="py-5 px-6 text-center">{t("leaderboard_rating") || "Rating"}</th>
                    <th className="py-5 px-6">{t("leaderboard_badges") || "Honors & Badges"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-900/60 text-xs">
                  {listLeaders.map((leader, index) => {
                    const rank = index + 4;
                    return (
                      <tr key={index} className="hover:bg-slate-500/[0.02] dark:hover:bg-white/[0.01] transition-all duration-150">
                        <td className="py-5 px-6">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 font-black text-slate-500 dark:text-slate-400">
                            {rank}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3.5">
                            <img src={leader.avatar} alt={leader.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover shadow-inner bg-slate-100 dark:bg-slate-900" />
                            <div>
                              <div className="font-extrabold text-slate-800 dark:text-white text-sm">{leader.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold mt-0.5">{leader.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="inline-flex items-center gap-1.5 text-slate-650 dark:text-slate-350 font-bold">
                            <Navigation size={11} className="text-slate-400 dark:text-slate-550" />
                            <span>{leader.location}, {t(`province_${leader.province.toLowerCase()}`, leader.province)}</span>
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center font-extrabold text-slate-800 dark:text-white text-sm">
                          {t("leaderboard_swaps_unit", { count: leader.swaps })}
                        </td>
                        <td className="py-5 px-6 text-center font-extrabold text-primary-orange text-sm">
                          {t("leaderboard_hours_unit", { count: leader.hours })}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="inline-flex items-center gap-1 font-black text-amber-500">
                            <Star size={12} fill="currentColor" />
                            <span>{leader.rating}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex gap-1.5 flex-wrap">
                            {leader.badges.map((b, bIdx) => {
                              const badgeStyle = b === 'top_swapper' ? 'bg-orange-500/10 text-primary-orange border border-orange-500/20'
                                : b === 'first_swap' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : b === 'pillar' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                              return (
                                <span key={bIdx} className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${badgeStyle}`}>
                                  {t(`leaderboard_badge_${b}`, b.replace('_', ' '))}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          podiumWinners.length === 0 && (
            <div className="text-center py-16 bg-white/40 dark:bg-slate-950/20 rounded-3xl border border-slate-205 dark:border-slate-900 p-8 mb-16 shadow-lg">
              <ShieldAlert size={48} className="text-slate-400 dark:text-slate-650 mx-auto mb-4" />
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1">No Swappers Found</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 max-w-[320px] mx-auto leading-relaxed">
                We couldn't find any barter champions matching your search term or province filter. Try adjusting your settings.
              </p>
            </div>
          )
        )}
      </main>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default CommunityLeaderboardPage;

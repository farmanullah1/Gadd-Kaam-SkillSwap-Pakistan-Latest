// src/components/Footer.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, MessageSquare, Coins, UserCheck,
  ShieldCheck, ArrowUp, Linkedin, Github, Youtube, Users, Repeat2,
  MapPin, Clock, Mail, ChevronRight
} from 'lucide-react';

/* ── Animated counter hook ──────────────────────────────────────────────── */
function useCountUp(target, duration = 1800, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return value;
}

/* ── Main Component ──────────────────────────────────────────────────────── */
function Footer({ user, onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');

  // Typewriter
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [typingClass,  setTypingClass]  = useState('opacity-100');

  // Newsletter
  const [newsletterEmail,  setNewsletterEmail]  = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);

  // Scroll-to-top
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Stats counter visibility
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // ── Animated stat values ─────────────────────────────────────────────────
  const users  = useCountUp(12400, 1800, statsVisible);
  const swaps  = useCountUp(38200, 2000, statsVisible);
  const cities = useCountUp(47,    1400, statsVisible);
  const hours  = useCountUp(92000, 2200, statsVisible);

  const formatNum = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  // ── IntersectionObserver for stats ───────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Typewriter ────────────────────────────────────────────────────────────
  const taglines = [
    t('footer_tagline'),
    t('pillar_barter_desc'),
    t('pillar_safe_desc'),
    t('pillar_growth_desc'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingClass('opacity-0 transition-opacity duration-500');
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
        setTypingClass('opacity-100 transition-opacity duration-500');
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  // ── Language ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handle);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handle);
  }, []);

  // ── Scroll-to-top visibility ──────────────────────────────────────────────
  useEffect(() => {
    const check = () => setShowScrollTop(window.pageYOffset > 400);
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const handleMarketplaceClick = (e) => {
    if (!user) { e.preventDefault(); navigate('/login'); }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterConsent) {
      alert(t('footer_consent_required_alert') || 'Please agree to the privacy policy to subscribe.');
      return;
    }
    if (!newsletterEmail) { setNewsletterStatus('error'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) { setNewsletterStatus('error'); return; }
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setNewsletterConsent(false);
    }, 1200);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sindhiFooterStyle = isSindhiMode ? {
    backgroundImage: `url(/Footer-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  // ── Local fallback translations for newsletter / badges ───────────────────
  const lt = {
    newsletter_title:       t('footer_newsletter_title')       || 'Stay Updated on Skill Swaps',
    newsletter_desc:        t('footer_newsletter_desc')        || 'Get the latest matches and community stories from Pakistan.',
    newsletter_placeholder: t('footer_newsletter_placeholder') || 'Enter your email address...',
    newsletter_btn:         t('footer_newsletter_btn')         || 'Subscribe',
    newsletter_subscribing: t('footer_newsletter_subscribing') || 'Subscribing...',
    newsletter_success:     t('footer_newsletter_success')     || 'Thank you! You\'ve subscribed.',
    newsletter_error:       t('footer_newsletter_error')       || 'Please enter a valid email.',
    badge_zero_cash_title:  t('footer_badge_zero_cash_title')  || 'Zero-Cash Exchange',
    badge_zero_cash_desc:   t('footer_badge_zero_cash_desc')   || 'Swap services without money. Pure talent-based trade.',
    badge_verified_title:   t('footer_badge_verified_title')   || '100% Verified Swappers',
    badge_verified_desc:    t('footer_badge_verified_desc')    || 'Trusted community profiles verified via strict guidelines.',
    badge_security_title:   t('footer_badge_security_title')   || 'Secure Community',
    badge_security_desc:    t('footer_badge_security_desc')    || 'End-to-end safe communication and dedicated dispute support.',
  };

  const defaultSindhiTextShadow = isSindhiMode ? '[text-shadow:1px_1px_2px_black,-1px_-1px_2px_black] !text-white' : '';
  const defaultSindhiIconColor = isSindhiMode ? '[filter:drop-shadow(1px_1px_1px_rgba(0,0,0,0.7))] !stroke-white' : '';

  return (
    <footer className={`bg-gradient-to-b from-[#060a13] via-[#090f1d] to-[#03050a] text-slate-100 relative pt-20 pb-12 overflow-hidden transition-all duration-300 border-t border-slate-900/60 ${isSindhiMode ? 'sindhi-footer-mode' : ''}`} style={sindhiFooterStyle}>

      {/* ── AMBIENT MESH GLOW ORBS ── */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary-orange/5 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[5%] right-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/4 blur-[130px] pointer-events-none" aria-hidden="true" />

      {/* ── TOP NEON GRADIENT SHINE ── */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary-orange/50 to-transparent pointer-events-none animate-pulse-glow" aria-hidden="true" />

      {/* ── SVG WAVE DIVIDER ─────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden leading-[0] absolute top-0 left-0 text-slate-50 dark:text-slate-950 -mt-1 h-6" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">

        {/* ── LIVE STATS COUNTER STRIP ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16" ref={statsRef}>
          {/* Card 1: Users */}
          <div className="group/stat flex items-center gap-4.5 p-5 bg-gradient-to-br from-slate-900/50 to-slate-950/50 dark:from-slate-950/30 dark:to-slate-950/50 backdrop-blur-xl border border-white/[0.04] hover:border-primary-orange/20 rounded-2xl hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(255,107,0,0.05)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 text-primary-orange border border-orange-500/20 group-hover/stat:scale-110 group-hover/stat:bg-orange-500/15 transition-all duration-300">
              <Users size={22} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-black text-white tracking-tight ${defaultSindhiTextShadow}`}>{formatNum(users)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_users') || 'Active Swappers'}</span>
            </div>
          </div>

          {/* Card 2: Swaps */}
          <div className="group/stat flex items-center gap-4.5 p-5 bg-gradient-to-br from-slate-900/50 to-slate-950/50 dark:from-slate-950/30 dark:to-slate-950/50 backdrop-blur-xl border border-white/[0.04] hover:border-emerald-500/20 rounded-2xl hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(16,185,129,0.05)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover/stat:scale-110 group-hover/stat:bg-emerald-500/15 transition-all duration-300">
              <Repeat2 size={22} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-black text-white tracking-tight ${defaultSindhiTextShadow}`}>{formatNum(swaps)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_swaps') || 'Skill Swaps Done'}</span>
            </div>
          </div>

          {/* Card 3: Cities */}
          <div className="group/stat flex items-center gap-4.5 p-5 bg-gradient-to-br from-slate-900/50 to-slate-950/50 dark:from-slate-950/30 dark:to-slate-950/50 backdrop-blur-xl border border-white/[0.04] hover:border-blue-500/20 rounded-2xl hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(59,130,246,0.05)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover/stat:scale-110 group-hover/stat:bg-blue-500/15 transition-all duration-300">
              <MapPin size={22} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-black text-white tracking-tight ${defaultSindhiTextShadow}`}>{cities}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_cities') || 'Cities Active'}</span>
            </div>
          </div>

          {/* Card 4: Hours */}
          <div className="group/stat flex items-center gap-4.5 p-5 bg-gradient-to-br from-slate-900/50 to-slate-950/50 dark:from-slate-950/30 dark:to-slate-950/50 backdrop-blur-xl border border-white/[0.04] hover:border-amber-500/20 rounded-2xl hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(245,158,11,0.05)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover/stat:scale-110 group-hover/stat:bg-amber-500/15 transition-all duration-300">
              <Clock size={22} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-black text-white tracking-tight ${defaultSindhiTextShadow}`}>{formatNum(hours)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_hours') || 'Hours Traded'}</span>
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8 md:p-10 bg-gradient-to-br from-[#0c1323]/80 to-[#060a12]/90 border border-slate-800/80 rounded-3xl mb-16 items-center shadow-2xl relative overflow-hidden group/news">
          <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-primary-orange/5 blur-[50px] group-hover/news:bg-primary-orange/10 transition-all duration-500" />
          <div className="flex flex-col gap-2 relative z-10">
            <h3 className={`text-xl font-extrabold text-white tracking-tight ${defaultSindhiTextShadow}`}>{lt.newsletter_title}</h3>
            <p className={`text-xs text-slate-400 max-w-[450px] leading-relaxed ${defaultSindhiTextShadow}`}>{lt.newsletter_desc}</p>
          </div>
          <form className="flex flex-col gap-3 relative z-10" onSubmit={handleNewsletterSubmit}>
            <div className="relative flex items-center bg-slate-950/65 border border-slate-800/80 rounded-2xl p-1.5 focus-within:border-primary-orange/80 focus-within:ring-4 focus-within:ring-primary-orange/10 transition-all duration-300 w-full overflow-hidden">
              <div className="absolute left-4.5 text-slate-500 pointer-events-none flex items-center">
                <Mail size={16} className="text-slate-500 group-focus-within:text-primary-orange transition-colors" />
              </div>
              <input
                type="email"
                placeholder={lt.newsletter_placeholder}
                value={newsletterEmail}
                onChange={(e) => { setNewsletterEmail(e.target.value); if (newsletterStatus === 'error') setNewsletterStatus(''); }}
                className={`bg-transparent border-none outline-none text-xs text-white pl-12 pr-4 py-3 w-full placeholder:text-slate-500 focus:ring-0 ${newsletterStatus === 'error' ? 'text-red-400' : ''}`}
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-orange-500/30 flex-shrink-0 disabled:opacity-75 disabled:cursor-not-allowed ${newsletterStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
              >
                {newsletterStatus === 'loading' ? lt.newsletter_subscribing
                  : newsletterStatus === 'success' ? '✓'
                  : lt.newsletter_btn}
              </button>
            </div>
            <div className="flex items-start gap-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-primary-orange focus:ring-primary-orange border-slate-800 bg-slate-950"
                  required
                />
                <span className={`text-[10px] text-slate-500 font-medium ${defaultSindhiTextShadow}`}>
                  {t('footer_newsletter_consent') || 'I agree to receive updates and accept the Privacy Policy.'}
                </span>
              </label>
            </div>
            {newsletterStatus === 'error'   && <p className="text-xs text-red-500 font-semibold mt-1 animate-alert-pop">{lt.newsletter_error}</p>}
            {newsletterStatus === 'success' && <p className="text-xs text-emerald-500 font-semibold mt-1 animate-alert-pop">{lt.newsletter_success}</p>}
          </form>
        </div>

        {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Badge 1 */}
          <div className="group/badge flex items-start gap-4 p-6 bg-gradient-to-br from-slate-900/30 to-slate-950/30 dark:from-slate-950/10 dark:to-slate-950/30 border border-slate-850 dark:border-slate-900/30 hover:border-primary-orange/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/[0.02] transition-all duration-300">
            <div className="p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/10 text-primary-orange border border-orange-500/20 shadow-sm group-hover/badge:scale-110 transition-transform duration-300">
              <Coins size={24} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_zero_cash_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_zero_cash_desc}</p>
            </div>
          </div>
          {/* Badge 2 */}
          <div className="group/badge flex items-start gap-4 p-6 bg-gradient-to-br from-slate-900/30 to-slate-950/30 dark:from-slate-950/10 dark:to-slate-950/30 border border-slate-850 dark:border-slate-900/30 hover:border-emerald-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/[0.02] transition-all duration-300">
            <div className="p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm group-hover/badge:scale-110 transition-transform duration-300">
              <UserCheck size={24} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_verified_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_verified_desc}</p>
            </div>
          </div>
          {/* Badge 3 */}
          <div className="group/badge flex items-start gap-4 p-6 bg-gradient-to-br from-slate-900/30 to-slate-950/30 dark:from-slate-950/10 dark:to-slate-950/30 border border-slate-850 dark:border-slate-900/30 hover:border-blue-500/20 rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/[0.02] transition-all duration-300">
            <div className="p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm group-hover/badge:scale-110 transition-transform duration-300">
              <ShieldCheck size={24} className={defaultSindhiIconColor} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_security_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_security_desc}</p>
            </div>
          </div>
        </div>

        {/* ── TOP SECTION: Links Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-16 border-b border-slate-900/80">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3.5 group/brand">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-primary-orange/40 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,107,0,0.15)] transition-all duration-300">
                <img
                  src="/Gadd_Kaam.png"
                  alt={t('navbar_brand_alt')}
                  className="w-9.5 h-9.5 rounded-xl group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40?text=${encodeURIComponent(t('app_initials'))}`; }}
                />
              </div>
              <span className={`text-2xl font-black text-white tracking-tight ${defaultSindhiTextShadow}`}>
                {t('navbar_brand_name').split(' ').map((w, i) => (
                  <span key={i} className={i === 1 ? 'text-primary-orange group-hover/brand:text-orange-400 transition-colors duration-250' : ''}>{w}{' '}</span>
                ))}
              </span>
            </Link>

            {/* Typewriter tagline */}
            <div className="h-12 flex items-center">
              <p className={`text-xs text-slate-400 leading-relaxed italic ${typingClass} ${defaultSindhiTextShadow}`}>
                {taglines[taglineIndex]}
              </p>
            </div>

            {/* Enhanced social icons */}
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-[#1877f2] hover:border-[#1877f2] hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-[#1da1f2] hover:border-[#1da1f2] hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-[#0077b5] hover:border-[#0077b5] hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-[#24292e] hover:border-[#24292e] hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
              </a>
              <a href="https://youtube.com/" className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800/60 hover:border-slate-600 hover:bg-[#ff0000] hover:border-[#ff0000] hover:-translate-y-1 text-slate-400 hover:text-white transition-all duration-300 shadow-md ${defaultSindhiIconColor}`} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[11px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2.5 ${defaultSindhiTextShadow}`}>{t('footer_quick_links')}</h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li>
                <Link to="/marketplace" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`} onClick={handleMarketplaceClick}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_marketplace')}</span>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_how_it_works')}</span>
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_success_stories')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about-us" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_about_us')}</span>
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_leaderboard')}</span>
                </Link>
              </li>
              <li>
                <Link to="/stories" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_barter_stories')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[11px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2.5 ${defaultSindhiTextShadow}`}>{t('footer_support')}</h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li>
                <Link to="/faq-page" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('faq_link')}</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_help_center')}</span>
                </Link>
              </li>
              <li>
                <Link to="/safety-tips" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_safety_tips')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_contact')}</span>
                </Link>
              </li>
              <li>
                <Link to="/status" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer_system_status')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[11px] font-extrabold text-white uppercase tracking-widest border-b border-slate-800/60 pb-2.5 ${defaultSindhiTextShadow}`}>{t('footer_company') || 'Company'}</h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li>
                <Link to="/about" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_about_us')}</span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_careers') || 'Careers'}</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_blog') || 'Blog'}</span>
                </Link>
              </li>
              <li>
                <Link to="/partners" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_partners') || 'Partners'}</span>
                </Link>
              </li>
              <li>
                <Link to="/survey" className={`group/link text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors duration-250 ${defaultSindhiTextShadow}`}>
                  <ChevronRight size={11} className="text-primary-orange opacity-0 group-hover/link:opacity-100 scale-75 group-hover/link:scale-100 transition-all duration-200 flex-shrink-0" />
                  <span>{t('navbar_survey') || 'Survey'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 mt-6 text-xs text-slate-500">
          {/* Left: Status pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 font-bold text-[10px] tracking-wide shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className={`uppercase ${defaultSindhiTextShadow}`}>{t('footer_system_status_operational')}</span>
          </div>

          {/* Center: Copyright */}
          <p className={`text-center text-slate-500 font-semibold ${defaultSindhiTextShadow}`}>
            {t('footer_copyright', { year: new Date().getFullYear() })}
          </p>

          {/* Right: Legal + Back to top */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3.5 text-slate-500">
              <Link to="/privacy-policy" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('footer_privacy_policy')}</Link>
              <span className="text-slate-800">•</span>
              <Link to="/terms-of-service" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('footer_terms_of_service')}</Link>
              <span className="text-slate-800">•</span>
              <Link to="/survey" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('navbar_survey') || 'Survey'}</Link>
            </div>
            <button className={`flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${defaultSindhiTextShadow}`} onClick={scrollToTop} aria-label={t('footer_back_to_top') || 'Back to top'}>
              <ArrowUp size={13} className={defaultSindhiIconColor} />
              {t('footer_back_to_top') || 'Top'}
            </button>
          </div>
        </div>

      </div>

      {/* ── FLOATING CHATBOT ─────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 group" onClick={onChatbotToggle} role="button" aria-label="Open chatbot" tabIndex={0}>
        <span className="absolute inset-0 rounded-2xl bg-primary-orange/40 animate-ping pointer-events-none opacity-75 group-hover:opacity-0 transition-opacity" />
        <div className="w-14 h-14 bg-gradient-to-tr from-primary-orange to-orange-400 dark:from-orange-600 dark:to-orange-400 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 cursor-pointer transition-all relative">
          <MessageSquare size={24} className={`${defaultSindhiIconColor} group-hover:rotate-12 transition-transform duration-300`} />
        </div>
      </div>

      {/* ── FLOATING SCROLL-TO-TOP ───────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 w-12 h-12 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/5 text-slate-400 hover:text-white flex items-center justify-center rounded-2xl shadow-lg hover:shadow-primary-orange/5 hover:-translate-y-1 cursor-pointer transition-all duration-300 ${showScrollTop ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}
        aria-label={t('footer_back_to_top') || 'Back to top'}
      >
        <ArrowUp size={20} className={defaultSindhiIconColor} />
      </button>

    </footer>
  );
}

export default Footer;

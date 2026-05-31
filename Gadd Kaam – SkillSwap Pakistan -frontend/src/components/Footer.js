// src/components/Footer.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, MessageSquare, Coins, UserCheck,
  ShieldCheck, ArrowUp, Linkedin, Github, Youtube, Users, Repeat2,
  MapPin, Clock
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
    <footer className={`bg-slate-900 text-slate-100 relative pt-16 overflow-hidden transition-colors border-t border-slate-800 ${isSindhiMode ? 'sindhi-footer-mode' : ''}`} style={sindhiFooterStyle}>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6 bg-slate-800/50 dark:bg-slate-950/40 rounded-3xl border border-slate-700/50 dark:border-slate-800/30 backdrop-blur-md mb-12 shadow-lg" ref={statsRef}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-500/10 text-primary-orange"><Users size={22} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold text-white ${defaultSindhiTextShadow}`}>{formatNum(users)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_users') || 'Active Swappers'}</span>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-slate-700/50 self-center" />
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500"><Repeat2 size={22} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold text-white ${defaultSindhiTextShadow}`}>{formatNum(swaps)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_swaps') || 'Skill Swaps Done'}</span>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-slate-700/50 self-center" />
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500"><MapPin size={22} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold text-white ${defaultSindhiTextShadow}`}>{cities}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_cities') || 'Cities Active'}</span>
            </div>
          </div>
          <div className="hidden md:block w-[1px] h-10 bg-slate-700/50 self-center" />
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500"><Clock size={22} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold text-white ${defaultSindhiTextShadow}`}>{formatNum(hours)}+</span>
              <span className={`text-[10px] uppercase font-bold text-slate-400 tracking-wider ${defaultSindhiTextShadow}`}>{t('footer_stat_hours') || 'Hours Traded'}</span>
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-6 md:p-8 bg-slate-800/30 dark:bg-slate-950/20 border border-slate-700/50 dark:border-slate-800/10 rounded-3xl mb-12 items-center">
          <div className="flex flex-col gap-1.5">
            <h3 className={`text-lg font-bold text-white ${defaultSindhiTextShadow}`}>{lt.newsletter_title}</h3>
            <p className={`text-xs text-slate-400 max-w-[450px] ${defaultSindhiTextShadow}`}>{lt.newsletter_desc}</p>
          </div>
          <form className="flex flex-col gap-2.5" onSubmit={handleNewsletterSubmit}>
            <div className="flex items-center bg-slate-950/50 border border-slate-700/80 rounded-xl p-1 relative focus-within:border-primary-orange focus-within:ring-2 focus-within:ring-primary-orange/10 transition-all duration-300 w-full">
              <input
                type="email"
                placeholder={lt.newsletter_placeholder}
                value={newsletterEmail}
                onChange={(e) => { setNewsletterEmail(e.target.value); if (newsletterStatus === 'error') setNewsletterStatus(''); }}
                className={`bg-transparent border-none outline-none text-xs text-white px-3 py-2.5 w-full placeholder:text-slate-500 ${newsletterStatus === 'error' ? 'text-red-400' : ''}`}
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                required
              />
              <button
                type="submit"
                className={`px-5 py-2.5 bg-gradient-to-r from-primary-orange to-orange-500 hover:from-primary-orange-hover hover:to-orange-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 flex-shrink-0 disabled:opacity-75 disabled:cursor-not-allowed ${newsletterStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
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
                  className="mt-0.5 w-3.5 h-3.5 rounded text-primary-orange focus:ring-primary-orange border-slate-700 bg-slate-950"
                  required
                />
                <span className={`text-[10px] text-slate-500 ${defaultSindhiTextShadow}`}>
                  {t('footer_newsletter_consent') || 'I agree to receive updates and accept the Privacy Policy.'}
                </span>
              </label>
            </div>
            {newsletterStatus === 'error'   && <p className="text-xs text-red-500 font-semibold mt-1 animate-alert-pop">{lt.newsletter_error}</p>}
            {newsletterStatus === 'success' && <p className="text-xs text-emerald-500 font-semibold mt-1 animate-alert-pop">{lt.newsletter_success}</p>}
          </form>
        </div>

        {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-start gap-4 p-5 bg-slate-800/30 dark:bg-slate-950/20 border border-slate-800/50 dark:border-slate-800/10 rounded-2xl">
            <div className="p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/10 text-primary-orange shadow-sm"><Coins size={26} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col gap-1">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_zero_cash_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_zero_cash_desc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-slate-800/30 dark:bg-slate-950/20 border border-slate-800/50 dark:border-slate-800/10 rounded-2xl">
            <div className="p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-500/10 text-emerald-500 shadow-sm"><UserCheck size={26} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col gap-1">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_verified_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_verified_desc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-slate-800/30 dark:bg-slate-950/20 border border-slate-800/50 dark:border-slate-800/10 rounded-2xl">
            <div className="p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 text-blue-500 shadow-sm"><ShieldCheck size={26} className={defaultSindhiIconColor} /></div>
            <div className="flex flex-col gap-1">
              <h5 className={`font-bold text-xs text-white uppercase tracking-wider ${defaultSindhiTextShadow}`}>{lt.badge_security_title}</h5>
              <p className={`text-xs text-slate-400 leading-relaxed ${defaultSindhiTextShadow}`}>{lt.badge_security_desc}</p>
            </div>
          </div>
        </div>

        {/* ── TOP SECTION: Links Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-slate-800/80">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-850 shadow-sm border border-slate-800/50">
                <img
                  src="/Gadd_Kaam.png"
                  alt={t('navbar_brand_alt')}
                  className="w-9 h-9 rounded-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40?text=${encodeURIComponent(t('app_initials'))}`; }}
                />
              </div>
              <span className={`text-xl font-extrabold text-white tracking-tight ${defaultSindhiTextShadow}`}>
                {t('navbar_brand_name').split(' ').map((w, i) => (
                  <span key={i} className={i === 1 ? 'text-primary-orange' : ''}>{w}{' '}</span>
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
            <div className="flex items-center gap-2.5">
              <a href="https://facebook.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-[#1877f2] hover:border-[#1877f2] hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-[#1da1f2] hover:border-[#1da1f2] hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-[#0077b5] hover:border-[#0077b5] hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-[#24292e] hover:border-[#24292e] hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
              </a>
              <a href="https://youtube.com/" className={`w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700/50 hover:border-slate-500 hover:bg-[#ff0000] hover:border-[#ff0000] hover:-translate-y-0.5 text-slate-400 hover:text-white transition-all duration-300 ${defaultSindhiIconColor}`} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2 ${defaultSindhiTextShadow}`}>{t('footer_quick_links')}</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><Link to="/marketplace" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`} onClick={handleMarketplaceClick}>{t('navbar_marketplace')}</Link></li>
              <li><Link to="/how-it-works" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_how_it_works')}</Link></li>
              <li><Link to="/success-stories" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_success_stories')}</Link></li>
              <li><Link to="/about-us" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_about_us')}</Link></li>
              <li><Link to="/leaderboard" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_leaderboard')}</Link></li>
              <li><Link to="/stories" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_barter_stories')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-xs font-bold text-white uppercase tracking-wider border-b border-slate-855 pb-2 ${defaultSindhiTextShadow}`}>{t('footer_support')}</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><Link to="/faq-page" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('faq_link')}</Link></li>
              <li><Link to="/support" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_help_center')}</Link></li>
              <li><Link to="/safety-tips" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_safety_tips')}</Link></li>
              <li><Link to="/contact-us" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_contact')}</Link></li>
              <li><Link to="/status" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('footer_system_status')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-xs font-bold text-white uppercase tracking-wider border-b border-slate-855 pb-2 ${defaultSindhiTextShadow}`}>{t('footer_company') || 'Company'}</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><Link to="/about" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_about_us')}</Link></li>
              <li><Link to="/careers" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_careers') || 'Careers'}</Link></li>
              <li><Link to="/blog" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_blog')    || 'Blog'}</Link></li>
              <li><Link to="/partners" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_partners') || 'Partners'}</Link></li>
              <li><Link to="/survey" className={`text-slate-450 hover:text-primary-orange hover:translate-x-1 transition-all duration-200 block ${defaultSindhiTextShadow}`}>{t('navbar_survey')  || 'Survey'}</Link></li>
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 text-xs text-slate-500">
          {/* Left: Status pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 font-bold text-[10px] tracking-wide">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className={`uppercase ${defaultSindhiTextShadow}`}>{t('footer_system_status_operational')}</span>
          </div>

          {/* Center: Copyright */}
          <p className={`text-center text-slate-500 font-semibold ${defaultSindhiTextShadow}`}>
            {t('footer_copyright', { year: new Date().getFullYear() })}
          </p>

          {/* Right: Legal + Back to top */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Link to="/privacy-policy" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('footer_privacy_policy')}</Link>
              <span className="text-slate-700">•</span>
              <Link to="/terms-of-service" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('footer_terms_of_service')}</Link>
              <span className="text-slate-700">•</span>
              <Link to="/survey" className={`hover:text-primary-orange transition-colors ${defaultSindhiTextShadow}`}>{t('navbar_survey') || 'Survey'}</Link>
            </div>
            <button className={`flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl cursor-pointer transition-all ${defaultSindhiTextShadow}`} onClick={scrollToTop} aria-label={t('footer_back_to_top') || 'Back to top'}>
              <ArrowUp size={13} className={defaultSindhiIconColor} />
              {t('footer_back_to_top') || 'Top'}
            </button>
          </div>
        </div>

      </div>

      {/* ── FLOATING CHATBOT ─────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-primary-orange to-orange-400 dark:from-orange-600 dark:to-orange-400 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 cursor-pointer transition-all z-50 animate-float" onClick={onChatbotToggle} role="button" aria-label="Open chatbot" tabIndex={0}>
        <MessageSquare size={26} className={defaultSindhiIconColor} />
      </div>

      {/* ── FLOATING SCROLL-TO-TOP ───────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-500 text-slate-400 hover:text-white flex items-center justify-center rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${showScrollTop ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}
        aria-label={t('footer_back_to_top') || 'Back to top'}
      >
        <ArrowUp size={20} className={defaultSindhiIconColor} />
      </button>

    </footer>
  );
}

export default Footer;

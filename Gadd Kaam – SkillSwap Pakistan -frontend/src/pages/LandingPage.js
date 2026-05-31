// src/pages/LandingPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Zap, Shield, Users, ArrowRight, Sparkles, Code, Globe, 
  Award, ChevronLeft, ChevronRight, CheckCircle2, Search,
  HelpCircle, Volume2, ShieldAlert, Cpu, Heart, CheckCircle, Lock, Server, Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';

import useScrollReveal from '../hooks/useScrollReveal';

function LandingPage({ onChatbotToggle }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [tickerHours, setTickerHours] = useState(45182.4);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Parallax / 3D Coordinate States
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [tiltStyle1, setTiltStyle1] = useState({});
  const [tiltStyle2, setTiltStyle2] = useState({});
  const parallaxFrameRef = useRef(null);
  
  // Interactive Calculator State
  const [calcHours, setCalcHours] = useState(4);
  const [calcSkill, setCalcSkill] = useState('webdev');

  // Audio / Sound State Indicator
  const [soundActive, setSoundActive] = useState(false);
  
  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Interactive Map Tooltip State
  const [activeMapPin, setActiveMapPin] = useState(null);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    const hoursInterval = setInterval(() => {
      setTickerHours((prev) => prev + 0.02);
    }, 2000);
    return () => clearInterval(hoursInterval);
  }, []);

  // Track viewport scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.pageYOffset / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (parallaxFrameRef.current) {
        cancelAnimationFrame(parallaxFrameRef.current);
      }
    };
  }, []);

  // Audio Feedbacks
  const triggerAudioFeedback = () => {
    if (!soundActive) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio Context unsupported');
    }
  };

  // Parallax coordinates on mouse move
  const handleHeroMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (parallaxFrameRef.current) return;

    parallaxFrameRef.current = requestAnimationFrame(() => {
      const x = (clientX - window.innerWidth / 2) / 45;
      const y = (clientY - window.innerHeight / 2) / 45;
      setMouseCoords({ x, y });
      parallaxFrameRef.current = null;
    });
  };

  // 3D Card 1 Hover Tilt
  const handleMouseMoveCard1 = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 14;
    const rotateY = (x / (box.width / 2)) * 14;
    setTiltStyle1({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeaveCard1 = () => {
    setTiltStyle1({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };

  // 3D Card 2 Hover Tilt
  const handleMouseMoveCard2 = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 12;
    const rotateY = (x / (box.width / 2)) * 12;
    setTiltStyle2({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeaveCard2 = () => {
    setTiltStyle2({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };

  const testimonials = [
    {
      quote: t("landing_testimonial_1_quote"),
      author: t("landing_testimonial_1_author"),
      role: t("landing_testimonial_1_role"),
      avatar: "https://placehold.co/100x100/ff7e29/ffffff?text=IH"
    },
    {
      quote: t("landing_testimonial_2_quote"),
      author: t("landing_testimonial_2_author"),
      role: t("landing_testimonial_2_role"),
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=SA"
    },
    {
      quote: t("landing_testimonial_3_quote"),
      author: t("landing_testimonial_3_author"),
      role: t("landing_testimonial_3_role"),
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=AS"
    }
  ];

  // Calculator Output values helper
  const getCalculatorOutput = () => {
    const values = {
      webdev: [
        { key: "landing_calc_out_ac_pipes", ratio: 1, icon: <Cpu size={16} /> },
        { key: "landing_calc_out_english_prep", ratio: 1.5, icon: <Globe size={16} /> }
      ],
      ac_repair: [
        { key: "landing_calc_out_python_api", ratio: 0.5, icon: <Code size={16} /> },
        { key: "landing_calc_out_math_tutoring", ratio: 0.75, icon: <Award size={16} /> }
      ],
      english: [
        { key: "landing_calc_out_branding_designs", ratio: 0.75, icon: <Sparkles size={16} /> },
        { key: "landing_calc_out_smartphone_repair", ratio: 1, icon: <Cpu size={16} /> }
      ],
      cooking: [
        { key: "landing_calc_out_sewing_boutique", ratio: 1.25, icon: <Heart size={16} /> },
        { key: "landing_calc_out_social_marketing", ratio: 0.75, icon: <Globe size={16} /> }
      ]
    };
    return values[calcSkill] || [];
  };

  return (
    <div className="landing-page-container" onMouseMove={handleHeroMouseMove}>
      {/* 1. Scroll Progress Bar */}
      <div className="scroll-progress-indicator" style={{ width: `${scrollProgress}%` }}></div>

      {/* 2. Parallax absolute glass-spheres/orbs background layers */}
      <div 
        className="parallax-sphere-1 floating-3d-y" 
        style={{ transform: `translate3d(${mouseCoords.x * 0.4}px, ${mouseCoords.y * 0.4}px, 0)` }}
      ></div>
      <div 
        className="parallax-sphere-2 floating-3d-x" 
        style={{ transform: `translate3d(${mouseCoords.x * -0.3}px, ${mouseCoords.y * -0.3}px, 0)` }}
      ></div>

      {/* 3. Live Marquee Ticker Feed */}
      <div className="live-marquee-ticker">
        <div className="marquee-content">
          <span className="marquee-item">{t("landing_ticker_1")}</span>
          <span className="marquee-item">{t("landing_ticker_2")}</span>
          <span className="marquee-item">{t("landing_ticker_3")}</span>
          <span className="marquee-item">{t("landing_ticker_4")}</span>
        </div>
      </div>

      <Navbar user={user} onLogout={handleLogout} onHelplineClick={() => setShowHelplinePopup(true)} />

      {/* Sound active/mic-click toggle widget */}
      <div className="sound-toggle-indicator-widget">
        <button 
          onClick={() => {
            setSoundActive(prev => !prev);
            triggerAudioFeedback();
          }} 
          className={`sound-btn ${soundActive ? 'active' : ''}`}
          title={t("landing_sound_active")}
        >
          <Volume2 size={16} />
          <span>{soundActive ? t("landing_sound_active") : t("landing_sound_muted")}</span>
        </button>
      </div>

      {/* Main Hero Section */}
      <main className="landing-hero">
        <div className="landing-left reveal fade-right">
          <div className="landing-tagline-wrapper">
            <span className="landing-badge">
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              {t("landing_welcome")}
            </span>
          </div>
          <h1 className="landing-title">
            {t("landing_title_part1")}
            <span className="grad">{t("landing_title_part2")}</span>
          </h1>
          <p className="landing-desc">
            {t("landing_tagline")}
          </p>

          {/* 4. Interactive Hero Search & Suggestion cloud */}
          <div className="hero-search-wrapper">
            <div className="hero-search-bar">
              <Search size={18} style={{ color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder={t("landing_search_placeholder")}
                onClick={triggerAudioFeedback}
              />
            </div>
            <div className="hero-search-tags-cloud">
              <span className="hero-tag" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>{t("tag_web_design")}</span>
              <span className="hero-tag" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>{t("tag_cooking")}</span>
              <span className="hero-tag" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>{t("tag_embroidery")}</span>
              <span className="hero-tag" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>{t("tag_ac_service")}</span>
            </div>
          </div>

          <div className="landing-btn-group">
            <button 
              className="btn-landing-primary animate-glow" 
              onClick={() => { triggerAudioFeedback(); navigate('/home'); }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <span>{t("landing_btn_enter")}</span>
              <ArrowRight size={20} />
            </button>
            <button 
              className="btn-landing-secondary" 
              onClick={() => { triggerAudioFeedback(); navigate('/how-it-works'); }}
            >
              {t("landing_btn_learn")}
            </button>
          </div>
        </div>

        {/* 3D Interactive Card Showcase */}
        <div className="landing-right reveal fade-left">
          <div className="interactive-3d-wrapper">
            {/* Pure CSS floating 3D Cube */}
            <div className="scene-3d-cube" style={{ willChange: 'transform' }}>
              <div className="cube-body">
                <div className="cube-face cube-face-front"><Code size={36} /></div>
                <div className="cube-face cube-face-back"><Sparkles size={36} /></div>
                <div className="cube-face cube-face-right"><Users size={36} /></div>
                <div className="cube-face cube-face-left"><Shield size={36} /></div>
                <div className="cube-face cube-face-top"><Globe size={36} /></div>
                <div className="cube-face cube-face-bottom"><Award size={36} /></div>
              </div>
            </div>

            {/* 3D Card 1: Active Swaps Glass tilt card */}
            <div 
              className="glass-3d-card card-tilt-3d"
              onMouseMove={handleMouseMoveCard1}
              onMouseLeave={handleMouseLeaveCard1}
              style={{ ...tiltStyle1, willChange: 'transform' }}
            >
              <div className="card-header-3d">
                <div className="card-title-3d">
                  <Activity size={18} style={{ color: 'var(--primary-orange)', display: 'inline', marginRight: '6px' }} />
                  {t("landing_welcome")} - {t("navbar_live_swappers")}
                </div>
                <div className="verified-seal-3d-spinning" title="Verified Safe Swapper Pool">
                  <Award size={16} />
                </div>
              </div>

              <div className="card-body-3d">
                <div className="talent-item-3d depth-z-sm">
                  <div className="talent-icon-3d"><Code size={20} /></div>
                  <div className="talent-info-3d">
                    <h4>{t("landing_demo_talent_1")}</h4>
                    <p>{t("landing_demo_user_1")}</p>
                  </div>
                </div>

                <div className="talent-item-3d depth-z-md">
                  <div className="talent-icon-3d"><Sparkles size={20} /></div>
                  <div className="talent-info-3d">
                    <h4>{t("landing_demo_talent_2")}</h4>
                    <p>{t("landing_demo_user_2")}</p>
                  </div>
                </div>

                <div className="talent-item-3d depth-z-lg">
                  <div className="talent-icon-3d"><Users size={20} /></div>
                  <div className="talent-info-3d">
                    <h4>{t("landing_demo_talent_3")}</h4>
                    <p>{t("landing_demo_user_3")}</p>
                  </div>
                </div>
              </div>

              <div className="card-footer-3d">
                <span className="lbl">{t("landing_swapped_hours")}</span>
                <span className="val ticker-font" style={{ color: 'var(--primary-orange)', fontWeight: '900' }}>
                  {tickerHours.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. SECP, CNIC, and Security Trust Badges Grid (4 elements) */}
      <section className="landing-trust-bar reveal scale-up">
        <div className="trust-badge-card">
          <div className="trust-icon"><Award size={20} /></div>
          <div>
            <h4>{t("landing_trust_secp")}</h4>
            <p>{t("landing_trust_secp_sub")}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-icon"><Users size={20} /></div>
          <div>
            <h4>{t("landing_trust_cnic")}</h4>
            <p>{t("landing_trust_cnic_sub")}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-icon"><Lock size={20} /></div>
          <div>
            <h4>{t("landing_trust_chat")}</h4>
            <p>{t("landing_trust_chat_sub")}</p>
          </div>
        </div>
        <div className="trust-badge-card">
          <div className="trust-icon"><Shield size={20} /></div>
          <div>
            <h4>{t("landing_trust_safe")}</h4>
            <p>{t("landing_trust_safe_sub")}</p>
          </div>
        </div>
      </section>

      {/* 6. Zero-Cash Hour Exchange Calculator Widget */}
      <section className="landing-calculator-section reveal fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="landing-badge">{t("landing_zero_money_swap")}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '0.5rem' }}>
            {t("landing_calculator_title")}
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-medium)' }}>
            {t("landing_calculator_subtitle")}
          </p>
        </div>

        <div className="calculator-layout-box">
          {/* Slider input */}
          <div className="calculator-inputs">
            <div className="calculator-form-group">
              <label>{t("landing_calc_input_lbl") || "I will offer (Hours of service):"}</label>
              <div className="slider-display-box">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={calcHours}
                  onChange={(e) => {
                    setCalcHours(Number(e.target.value));
                    triggerAudioFeedback();
                  }}
                  className="calc-range-slider"
                />
                <span className="slider-hours-label">{t("duration_hours", { count: calcHours })}</span>
              </div>
            </div>

            <div className="calculator-form-group" style={{ marginTop: '2rem' }}>
              <label>{t("landing_calc_select_skill")}</label>
              <select 
                value={calcSkill} 
                onChange={(e) => {
                  setCalcSkill(e.target.value);
                  triggerAudioFeedback();
                }}
                className="input-field calc-select"
              >
                <option value="webdev">{t("landing_calc_option_webdev")}</option>
                <option value="ac_repair">{t("landing_calc_option_ac")}</option>
                <option value="english">{t("landing_calc_option_english")}</option>
                <option value="cooking">{t("landing_calc_option_cooking")}</option>
              </select>
            </div>
          </div>

          {/* Calculator Output Displays */}
          <div className="calculator-outputs">
            <h4>{t("landing_calc_output_lbl")}</h4>
            <div className="output-items-list">
              {getCalculatorOutput().map((item, idx) => (
                <div key={idx} className="output-item-row reveal scale-up">
                  <div className="output-icon-box">{item.icon}</div>
                  <div>
                    <span className="output-hours-text">{Math.round(calcHours * item.ratio)} {t(item.key)}</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      {t("landing_calc_strictly_free")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pakistan Interactive Barter Heatmap Card */}
      <section className="landing-heatmap-section reveal fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="landing-badge">{t("landing_explore_talents_tag")}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '0.5rem' }}>
            {t("landing_map_title")}
          </h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-medium)' }}>
            {t("landing_map_subtitle")}
          </p>
        </div>

        <div className="map-showcase-box">
          {/* Glass map representation */}
          <div className="pakistan-map-mockup">
            {/* Heatmap pulsating pins */}
            <div 
              className="map-pin pin-karachi"
              onMouseEnter={() => { triggerAudioFeedback(); setActiveMapPin('karachi'); }}
              onMouseLeave={() => setActiveMapPin(null)}
            ></div>
            <div 
              className="map-pin pin-lahore"
              onMouseEnter={() => { triggerAudioFeedback(); setActiveMapPin('lahore'); }}
              onMouseLeave={() => setActiveMapPin(null)}
            ></div>
            <div 
              className="map-pin pin-peshawar"
              onMouseEnter={() => { triggerAudioFeedback(); setActiveMapPin('peshawar'); }}
              onMouseLeave={() => setActiveMapPin(null)}
            ></div>
            <div 
              className="map-pin pin-quetta"
              onMouseEnter={() => { triggerAudioFeedback(); setActiveMapPin('quetta'); }}
              onMouseLeave={() => setActiveMapPin(null)}
            ></div>
            <div 
              className="map-pin pin-islamabad"
              onMouseEnter={() => { triggerAudioFeedback(); setActiveMapPin('islamabad'); }}
              onMouseLeave={() => setActiveMapPin(null)}
            ></div>

            {/* Glowing Map Grid Lines */}
            <svg className="map-grid-lines" viewBox="0 0 500 400">
              <path d="M 50,300 L 250,250 M 250,250 L 320,180 M 320,180 L 400,220 M 400,220 L 350,90" stroke="rgba(227, 139, 64, 0.15)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            </svg>
          </div>

          {/* Map interactive details card */}
          <div className="map-details-card">
            <h4>{t("landing_map_node_metrics")}</h4>
            <div className="map-tooltip-content">
              {activeMapPin === 'karachi' && <p className="reveal fade-up">{t("landing_map_karachi")}</p>}
              {activeMapPin === 'lahore' && <p className="reveal fade-up">{t("landing_map_lahore")}</p>}
              {activeMapPin === 'peshawar' && <p className="reveal fade-up">{t("landing_map_peshawar")}</p>}
              {activeMapPin === 'quetta' && <p className="reveal fade-up">{t("landing_map_quetta")}</p>}
              {activeMapPin === 'islamabad' && <p className="reveal fade-up">{t("landing_map_islamabad")}</p>}
              {!activeMapPin && <p style={{ color: 'var(--text-light)' }}>{t("landing_map_hover_instructions")}</p>}
            </div>
            
            <div className="heatmap-platform-stats">
              <div className="heatmap-stat-row">
                <span className="stat-label"><Server size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t("landing_map_stats_nodes")}</span>
                <strong style={{ color: 'var(--primary-orange)' }}>{t("landing_map_nodes_active")}</strong>
              </div>
              <div className="heatmap-stat-row">
                <span className="stat-label"><Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t("landing_map_stats_swappers")}</span>
                <strong style={{ color: '#3b82f6' }}>{t("landing_map_profiles")}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 3D Category Showcase Grid (8 elements) */}
      <section style={{ padding: '6rem 8%' }} className="reveal fade-up">
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <span className="landing-badge">{t("landing_explore_talents_tag")}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '0.5rem' }}>{t("landing_explore_talents_title")}</h2>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-medium)' }}>
            {t("landing_explore_talents_desc")}
          </p>
        </div>

        <div className="category-showcase-3d-grid">
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Code size={24} /></div>
            <h4>{t("landing_cat_coding_title")}</h4>
            <p>{t("landing_cat_coding_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Cpu size={24} /></div>
            <h4>{t("landing_cat_ac_title")}</h4>
            <p>{t("landing_cat_ac_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Globe size={24} /></div>
            <h4>{t("landing_cat_languages_title")}</h4>
            <p>{t("landing_cat_languages_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Heart size={24} /></div>
            <h4>{t("landing_cat_culinary_title")}</h4>
            <p>{t("landing_cat_culinary_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Sparkles size={24} /></div>
            <h4>{t("landing_cat_sewing_title")}</h4>
            <p>{t("landing_cat_sewing_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Award size={24} /></div>
            <h4>{t("landing_cat_math_title")}</h4>
            <p>{t("landing_cat_math_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Users size={24} /></div>
            <h4>{t("landing_cat_graphic_title")}</h4>
            <p>{t("landing_cat_graphic_desc")}</p>
          </div>
          <div className="cat-card-3d depth-z-sm" onClick={() => { triggerAudioFeedback(); navigate('/home'); }}>
            <div className="cat-icon-3d"><Shield size={24} /></div>
            <h4>{t("landing_cat_gardening_title")}</h4>
            <p>{t("landing_cat_gardening_desc")}</p>
          </div>
        </div>
      </section>

      {/* 9. Women-Only Zone & Escrow Double-Confirmation Promo Card */}
      <section style={{ padding: '4rem 8%' }} className="reveal fade-up">
        <div className="promo-layout-box">
          {/* Women Only zone */}
          <div className="promo-card women-promo reveal scale-up">
            <span className="badge-pink">{t("landing_promo_exclusively_private")}</span>
            <h3 style={{ fontSize: '1.8rem', color: '#db2777', fontWeight: 800, margin: '1rem 0' }}>
              {t("landing_women_zone")}
            </h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {t("landing_women_desc")}
            </p>
            <button 
              className="btn btn-primary-pink" 
              onClick={() => { triggerAudioFeedback(); navigate('/women-zone'); }}
            >
              {t("landing_promo_women_btn")}
            </button>
          </div>

          {/* Secure escrow */}
          <div className="promo-card escrow-promo reveal scale-up">
            <span className="badge-blue" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.8rem' }}>{t("landing_promo_escrow_badge")}</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--info-color)', fontWeight: 800, margin: '1rem 0' }}>
              {t("landing_promo_escrow_title")}
            </h3>
            <p style={{ color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '2rem' }}>
              {t("landing_promo_escrow_desc")}
            </p>
            <button 
              className="btn btn-login" 
              style={{ background: 'var(--button-secondary-bg)', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}
              onClick={() => { triggerAudioFeedback(); navigate('/how-it-works'); }}
            >
              {t("landing_promo_escrow_btn")}
            </button>
          </div>
        </div>
      </section>

      {/* 10. Platform-wide Numbers counter (Uptime, Rating) */}
      <section className="landing-pillars reveal fade-up">
        <div className="pillar-card-3d">
          <div className="pillar-icon-wrapper"><Zap size={28} /></div>
          <h3 className="pillar-title">{t("landing_zero_money_swap")}</h3>
          <p className="pillar-desc">{t("landing_zero_money_desc")}</p>
        </div>
        <div className="pillar-card-3d">
          <div className="pillar-icon-wrapper" style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}><Shield size={28} /></div>
          <h3 className="pillar-title">{t("landing_secured_network")}</h3>
          <p className="pillar-desc">{t("landing_secured_desc")}</p>
        </div>
        <div className="pillar-card-3d">
          <div className="pillar-icon-wrapper" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}><Users size={28} /></div>
          <h3 className="pillar-title">{t("landing_women_zone")}</h3>
          <p className="pillar-desc">{t("landing_women_desc")}</p>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section style={{ padding: '4rem 8% 6rem', background: 'rgba(0,0,0,0.05)' }} className="reveal fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="landing-badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.2)' }}>{t("landing_testimonial_love")}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '0.5rem' }}>{t("landing_testimonial_title")}</h2>
        </div>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <div 
            className="card-panel" 
            style={{ 
              padding: '3rem 2.5rem', 
              background: 'var(--glass-bg)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              textAlign: 'center',
              boxShadow: 'var(--glass-shadow)',
              transition: 'all 0.5s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img 
                src={testimonials[activeTestimonial].avatar} 
                alt={testimonials[activeTestimonial].author}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary-orange)' }}
              />
            </div>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              "{testimonials[activeTestimonial].quote}"
            </p>
            <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-orange)', margin: 0 }}>{testimonials[activeTestimonial].author}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', margin: '4px 0 0 0' }}>{testimonials[activeTestimonial].role}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
              <button 
                onClick={() => {
                  triggerAudioFeedback();
                  setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
                }}
                style={{ background: 'var(--button-secondary-bg)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => {
                  triggerAudioFeedback();
                  setActiveTestimonial(prev => (prev + 1) % testimonials.length);
                }}
                style={{ background: 'var(--button-secondary-bg)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion widgets */}
      <section style={{ padding: '6rem 8%' }} className="reveal fade-up">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="landing-badge"><HelpCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {t("faq_title")}</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '0.5rem' }}>{t("landing_faq_title")}</h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="faq-card" onClick={() => { triggerAudioFeedback(); setActiveFaq(activeFaq === 0 ? null : 0); }}>
            <div className="faq-question">
              <h4>{t("landing_faq_q1")}</h4>
              <span className={`faq-arrow ${activeFaq === 0 ? 'active' : ''}`}>▼</span>
            </div>
            {activeFaq === 0 && (
              <div className="faq-answer reveal fade-up">
                <p>{t("landing_faq_a1")}</p>
              </div>
            )}
          </div>

          <div className="faq-card" onClick={() => { triggerAudioFeedback(); setActiveFaq(activeFaq === 1 ? null : 1); }}>
            <div className="faq-question">
              <h4>{t("landing_faq_q2")}</h4>
              <span className={`faq-arrow ${activeFaq === 1 ? 'active' : ''}`}>▼</span>
            </div>
            {activeFaq === 1 && (
              <div className="faq-answer reveal fade-up">
                <p>{t("landing_faq_a2")}</p>
              </div>
            )}
          </div>

          <div className="faq-card" onClick={() => { triggerAudioFeedback(); setActiveFaq(activeFaq === 2 ? null : 2); }}>
            <div className="faq-question">
              <h4>{t("landing_faq_q3")}</h4>
              <span className={`faq-arrow ${activeFaq === 2 ? 'active' : ''}`}>▼</span>
            </div>
            {activeFaq === 2 && (
              <div className="faq-answer reveal fade-up">
                <p>{t("landing_faq_a3")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 12. Newsletter signup glassmorphic widget */}
      <section style={{ padding: '6rem 8%' }} className="reveal fade-up">
        <div className="newsletter-box-3d reveal scale-up">
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-dark)', marginBottom: '0.8rem' }}>
            {t("landing_newsletter_title")}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto', color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            {t("landing_newsletter_sub")}
          </p>
          <div className="newsletter-form-row">
            <input 
              type="email" 
              placeholder={t("landing_newsletter_placeholder")} 
              className="input-field"
              onClick={triggerAudioFeedback}
            />
            <button 
              className="btn btn-primary-orange animate-glow"
              onClick={() => { triggerAudioFeedback(); alert(t('landing_subscribe_success')); }}
            >
              {t("landing_newsletter_btn")}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ NEW 3D ELEMENTS ═══════════════ */}

      {/* 13. 3D ANIMATED COUNTER SECTION */}
      <section className="landing-counter-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_counter_title')}</h2>
        <div className="counter-grid-3d">
          {[
            { end: 12500, label: t('landing_stat_users'), icon: <Users size={28} /> },
            { end: 8900, label: t('landing_stat_swaps'), icon: <Zap size={28} /> },
            { end: 42, label: t('landing_stat_cities'), icon: <Globe size={28} /> },
            { end: Math.floor(tickerHours), label: t('landing_stat_hours'), icon: <Activity size={28} /> },
          ].map((stat, i) => (
            <div key={i} className="counter-card-3d reveal fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="counter-icon-ring">{stat.icon}</div>
              <span className="counter-number">{stat.end.toLocaleString()}+</span>
              <span className="counter-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 14. 3D COMPARISON GRID – Why Gadd Kaam? */}
      <section className="landing-comparison-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_comparison_title')}</h2>
        <div className="comparison-panels-3d">
          <div className="comparison-panel old reveal fade-left">
            <h3>{t('landing_comparison_traditional')}</h3>
            <ul>
              <li>{t('landing_comparison_old_1')}</li>
              <li>{t('landing_comparison_old_2')}</li>
              <li>{t('landing_comparison_old_3')}</li>
              <li>{t('landing_comparison_old_4')}</li>
            </ul>
          </div>
          <div className="comparison-vs-badge">VS</div>
          <div className="comparison-panel new reveal fade-right">
            <h3>{t('landing_comparison_gaddkaam')}</h3>
            <ul>
              <li>{t('landing_comparison_new_1')}</li>
              <li>{t('landing_comparison_new_2')}</li>
              <li>{t('landing_comparison_new_3')}</li>
              <li>{t('landing_comparison_new_4')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 15. 3D TRUST & SECURITY BADGES */}
      <section className="landing-trust-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_trust_title')}</h2>
        <p className="landing-section-subheading">{t('landing_trust_subtitle')}</p>
        <div className="trust-badges-row">
          {[
            { icon: <Shield size={32} />, label: t('landing_trust_verified') },
            { icon: <Lock size={32} />, label: t('landing_trust_encrypted') },
            { icon: <Users size={32} />, label: t('landing_trust_moderated') },
            { icon: <Server size={32} />, label: t('landing_trust_support') },
          ].map((badge, i) => (
            <div key={i} className="trust-badge-card reveal scale-up" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="trust-badge-icon">{badge.icon}</div>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 16. 3D ANIMATED TIMELINE — Your Journey */}
      <section className="landing-timeline-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_timeline_title')}</h2>
        <p className="landing-section-subheading">{t('landing_timeline_subtitle')}</p>
        <div className="timeline-3d">
          {[
            { step: '01', title: t('landing_how_step1_title'), desc: t('landing_how_step1_desc'), icon: <Users size={24} /> },
            { step: '02', title: t('landing_how_step2_title'), desc: t('landing_how_step2_desc'), icon: <Search size={24} /> },
            { step: '03', title: t('landing_how_step3_title'), desc: t('landing_how_step3_desc'), icon: <CheckCircle size={24} /> },
            { step: '04', title: t('landing_timeline_step4_title'), desc: t('landing_timeline_step4_desc'), icon: <Award size={24} /> },
          ].map((item, i) => (
            <div key={i} className="timeline-node-3d reveal fade-up" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="timeline-step-badge">{item.step}</div>
              <div className="timeline-node-content">
                <div className="timeline-node-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 17. 3D LIVE ACTIVITY FEED */}
      <section className="landing-live-feed-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_social_proof_title')}</h2>
        <div className="live-feed-ticker">
          <div className="live-dot-pulse"></div>
          <div className="live-feed-scroll">
            {[
              { user: t('live_feed_user_ali'), action: t('live_feed_action_swapped'), skill: t('live_feed_skill_react'), city: t('city_lahore'), time: t('time_ago_minutes', { count: 2 }) },
              { user: t('live_feed_user_fatima'), action: t('live_feed_action_swapped'), skill: t('live_feed_skill_graphic'), city: t('city_karachi'), time: t('time_ago_minutes', { count: 5 }) },
              { user: t('live_feed_user_hamza'), action: t('live_feed_action_posted'), skill: t('live_feed_skill_python'), city: t('city_islamabad'), time: t('time_ago_minutes', { count: 8 }) },
              { user: t('live_feed_user_sara'), action: t('live_feed_action_joined'), skill: '', city: t('city_peshawar'), time: t('time_ago_minutes', { count: 12 }) },
              { user: t('live_feed_user_usman'), action: t('live_feed_action_swapped'), skill: t('live_feed_skill_video'), city: t('city_faisalabad'), time: t('time_ago_minutes', { count: 15 }) },
            ].map((item, i) => (
              <div key={i} className="live-feed-item">
                <span className="feed-user">{item.user}</span>
                <span className="feed-action">{item.action}</span>
                {item.skill && <span className="feed-skill">{item.skill}</span>}
                <span className="feed-city">📍 {item.city}</span>
                <span className="feed-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. 3D PAKISTAN MAP SECTION */}
      <section className="landing-map-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_map_title')}</h2>
        <p className="landing-section-subheading">{t('landing_map_subtitle')}</p>
        <div className="pakistan-map-3d">
          {[
            { name: 'Karachi', x: 35, y: 72, count: 3420 },
            { name: 'Lahore', x: 52, y: 32, count: 2810 },
            { name: 'Islamabad', x: 55, y: 22, count: 1950 },
            { name: 'Peshawar', x: 48, y: 15, count: 890 },
            { name: 'Quetta', x: 25, y: 48, count: 520 },
            { name: 'Faisalabad', x: 55, y: 40, count: 1340 },
            { name: 'Multan', x: 48, y: 50, count: 780 },
            { name: 'Hyderabad', x: 38, y: 65, count: 640 },
          ].map((city, i) => (
            <div 
              key={i} 
              className={`map-pin-3d ${activeMapPin === i ? 'active' : ''}`}
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
              onMouseEnter={() => setActiveMapPin(i)}
              onMouseLeave={() => setActiveMapPin(null)}
            >
              <div className="map-pin-dot"></div>
              <div className="map-pin-ripple"></div>
              {activeMapPin === i && (
                <div className="map-pin-tooltip">
                  <strong>{city.name}</strong>
                  <span>{t('map_active_users', { count: city.count.toLocaleString() })}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 19. 3D GRADIENT WAVE DIVIDER */}
      <div className="wave-divider-3d">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,85 1380,30 1440,50 L1440,120 L0,120 Z" fill="hsl(26 84% 57% / 0.08)" />
          <path d="M0,60 C360,20 720,100 1080,40 C1260,20 1380,70 1440,40 L1440,120 L0,120 Z" fill="hsl(26 84% 57% / 0.04)" />
        </svg>
      </div>

      {/* 20. 3D PARTNER LOGOS CAROUSEL */}
      <section className="landing-partners-section reveal fade-up">
        <h2 className="landing-section-heading">{t('landing_partners_title')}</h2>
        <p className="landing-section-subheading">{t('landing_partners_subtitle')}</p>
        <div className="partners-logo-row-3d">
          {['🏛️', '🎓', '💼', '🌐', '📱', '🏗️', '📚', '🚀'].map((emoji, i) => (
            <div key={i} className="partner-logo-3d" style={{ animationDelay: `${i * 0.3}s` }}>
              <span>{emoji}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 21. 3D FLOATING SKILL BADGES ORBIT */}
      <section className="landing-orbit-section reveal fade-up">
        <div className="skill-orbit-container">
          <div className="orbit-center">
            <Sparkles size={36} />
            <span>{t("app_initials")}</span>
          </div>
          {['⚛️', '🎨', '📐', '🔧', '📸', '✍️', '🎵', '🧮'].map((emoji, i) => (
            <div key={i} className={`orbit-badge orbit-badge-${i + 1}`}>
              <span>{emoji}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 22. 3D NEON GLOW FINAL CTA */}
      <section className="landing-final-cta-section reveal fade-up">
        <div className="final-cta-glass-3d">
          <Sparkles size={40} style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }} />
          <h2>{t('landing_cta_final_title')}</h2>
          <p>{t('landing_cta_final_subtitle')}</p>
          <button 
            className="btn-landing-primary animate-glow final-cta-btn" 
            onClick={() => { triggerAudioFeedback(); navigate('/signup'); }}
          >
            {t('landing_cta_final_btn')}
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* 23. 3D GRADIENT BACKGROUND BLOBS */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}

export default LandingPage;

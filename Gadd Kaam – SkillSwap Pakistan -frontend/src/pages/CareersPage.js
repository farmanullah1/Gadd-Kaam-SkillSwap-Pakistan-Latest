// src/pages/CareersPage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Heart, Globe, Zap, Users, Rocket,
  MapPin, Clock, ExternalLink, ChevronRight, Star, Shield
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';


function CareersPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [activeCategory, setActiveCategory] = useState('all');
  useScrollReveal();

  const values = [
    { icon: <Heart size={26} />, title: t('careers_value_impact'), desc: t('careers_value_impact_desc') },
    { icon: <Globe size={26} />, title: t('careers_value_remote'), desc: t('careers_value_remote_desc') },
    { icon: <Users size={26} />, title: t('careers_value_community'), desc: t('careers_value_community_desc') },
    { icon: <Zap size={26} />, title: t('careers_value_innovation'), desc: t('careers_value_innovation_desc') },
    { icon: <Rocket size={26} />, title: t('careers_value_growth'), desc: t('careers_value_growth_desc') },
    { icon: <Shield size={26} />, title: t('careers_value_ownership'), desc: t('careers_value_ownership_desc') },
  ];

  const perks = [
    { emoji: '🏡', label: t('careers_perk_remote') || 'Remote-First' },
    { emoji: '📈', label: t('careers_perk_equity') || 'Equity Options' },
    { emoji: '🎓', label: t('careers_perk_learning') || 'Learning Budget' },
    { emoji: '🏥', label: t('careers_perk_health') || 'Health Coverage' },
    { emoji: '🕐', label: t('careers_perk_flex') || 'Flexible Hours' },
    { emoji: '✈️', label: t('careers_perk_retreat') || 'Annual Retreat' },
  ];

  const openings = [
    {
      title: t('careers_job_frontend') || 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      category: 'engineering',
      badge: 'hot',
    },
    {
      title: t('careers_job_backend') || 'Node.js Backend Developer',
      department: 'Engineering',
      location: 'Karachi / Remote',
      type: 'Full-time',
      category: 'engineering',
    },
    {
      title: t('careers_job_designer') || 'Product Designer (UI/UX)',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      category: 'design',
      badge: 'new',
    },
    {
      title: t('careers_job_marketing') || 'Community Growth Manager',
      department: 'Marketing',
      location: 'Lahore / Remote',
      type: 'Part-time',
      category: 'marketing',
    },
    {
      title: t('careers_job_support') || 'Customer Support Specialist',
      department: 'Support',
      location: 'Remote (Pakistan)',
      type: 'Full-time',
      category: 'support',
    },
  ];

  const categories = [
    { key: 'all', label: t('careers_cat_all') || 'All Roles' },
    { key: 'engineering', label: t('careers_cat_eng') || 'Engineering' },
    { key: 'design', label: t('careers_cat_design') || 'Design' },
    { key: 'marketing', label: t('careers_cat_marketing') || 'Marketing' },
    { key: 'support', label: t('careers_cat_support') || 'Support' },
  ];

  const filtered = openings.filter(j => activeCategory === 'all' || j.category === activeCategory);

  return (
    <div className="careers-page-container">
      <Navbar user={user} onHelplineClick={() => {}} onChatbotToggle={onChatbotToggle} />

      {/* ─── HERO ─── */}
      <section className="careers-hero">
        <div className="careers-hero-badge reveal fade-up">
          <Briefcase size={14} />
          {t('careers_badge') || 'Join the Team'}
        </div>
        <h1 className="reveal fade-up">{t('careers_page_title')}</h1>
        <p className="reveal fade-up">{t('careers_page_subtitle')}</p>

        {/* Stat Pills */}
        <div className="careers-hero-stats reveal fade-up">
          <div className="careers-stat-pill">
            <span>🌍</span>
            <strong>12+</strong>
            <span>{t('careers_stat_cities') || 'Cities'}</span>
          </div>
          <div className="careers-stat-pill">
            <span>👥</span>
            <strong>45+</strong>
            <span>{t('careers_stat_team') || 'Team Members'}</span>
          </div>
          <div className="careers-stat-pill">
            <span>⭐</span>
            <strong>4.9</strong>
            <span>{t('careers_stat_glassdoor') || 'Glassdoor Rating'}</span>
          </div>
        </div>
      </section>

      <div className="careers-content">

        {/* ─── PERKS BAR ─── */}
        <div className="careers-perks-strip reveal fade-up">
          {perks.map((perk, i) => (
            <div className="careers-perk-item" key={i}>
              <span className="careers-perk-emoji">{perk.emoji}</span>
              <span>{perk.label}</span>
            </div>
          ))}
        </div>

        {/* ─── VALUES ─── */}
        <h2 className="careers-section-title reveal fade-up">{t('careers_our_values') || 'Our Values'}</h2>
        <div className="careers-values-grid">
          {values.map((v, i) => (
            <div key={i} className="careers-value-card reveal fade-up" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="careers-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* ─── OPEN POSITIONS ─── */}
        <div className="careers-openings-section">
          <h2 className="careers-section-title reveal fade-up">{t('careers_open_positions') || 'Open Positions'}</h2>

          {/* Category Filters */}
          <div className="careers-category-filter reveal fade-up">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`careers-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="careers-jobs-list reveal fade-up">
            {filtered.length === 0 ? (
              <div className="careers-openings">
                <Star size={36} style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }} />
                <p>{t('careers_no_openings')}</p>
                <a href="mailto:careers@gaddkaam.pk" className="careers-cta-btn">
                  <Briefcase size={18} />
                  {t('careers_send_resume') || 'Send Your Resume'}
                </a>
              </div>
            ) : (
              <>
                {filtered.map((job, i) => (
                  <div key={i} className="careers-job-card reveal fade-up" style={{ transitionDelay: `${i * 0.07}s` }}>
                    <div className="careers-job-left">
                      <div className="careers-job-icon">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="careers-job-header">
                          <h3 className="careers-job-title">{job.title}</h3>
                          {job.badge === 'hot' && (
                            <span className="careers-job-badge hot">🔥 Hot</span>
                          )}
                          {job.badge === 'new' && (
                            <span className="careers-job-badge new">✨ New</span>
                          )}
                        </div>
                        <div className="careers-job-meta">
                          <span><Users size={13} /> {job.department}</span>
                          <span><MapPin size={13} /> {job.location}</span>
                          <span><Clock size={13} /> {job.type}</span>
                        </div>
                      </div>
                    </div>
                    <a href="mailto:careers@gaddkaam.pk" className="careers-apply-btn">
                      {t('careers_apply_now') || 'Apply Now'} <ChevronRight size={16} />
                    </a>
                  </div>
                ))}

                <div className="careers-openings" style={{ marginTop: '2rem' }}>
                  <p>{t('careers_no_openings')}</p>
                  <a href="mailto:careers@gaddkaam.pk" className="careers-cta-btn">
                    <ExternalLink size={16} />
                    {t('careers_send_resume') || 'Send Your Resume'}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
    </div>
  );
}

export default CareersPage;

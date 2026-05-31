// src/pages/BlogPage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, User, ArrowRight, BookOpen, TrendingUp, Shield, Users, Star, Lightbulb, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';


const TAG_COLORS = {
  'Guide':     { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
  'Safety':    { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
  'Community': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  'Success':   { bg: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04', border: 'rgba(234, 179, 8, 0.2)' },
  'Tips':      { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.2)' },
  'Feature':   { bg: 'rgba(227, 139, 64, 0.1)', color: 'var(--primary-orange)', border: 'rgba(227, 139, 64, 0.2)' },
};

const TAG_ICONS = {
  'Guide':     <BookOpen size={12} />,
  'Safety':    <Shield size={12} />,
  'Community': <Users size={12} />,
  'Success':   <Star size={12} />,
  'Tips':      <Lightbulb size={12} />,
  'Feature':   <Globe size={12} />,
};

function BlogPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [activeTag, setActiveTag] = useState('All');
  useScrollReveal();

  const posts = [
    {
      emoji: '🔄', tag: 'Guide',
      title: t('blog_post1_title') || 'How to Make Your First Skill Swap',
      desc: t('blog_post1_desc') || 'A step-by-step guide to creating your profile, finding matches, and completing your first trade.',
      author: t('blog_author_team') || 'Gadd Kaam Team',
      date: 'May 20, 2026',
      readTime: '5 min read',
      featured: true,
    },
    {
      emoji: '🛡️', tag: 'Safety',
      title: t('blog_post2_title') || 'Staying Safe While Swapping Skills',
      desc: t('blog_post2_desc') || 'Best practices for meeting swap partners, protecting your personal information, and using our trust system.',
      author: t('blog_author_safety') || 'Safety Team',
      date: 'May 18, 2026',
      readTime: '4 min read',
    },
    {
      emoji: '🌟', tag: 'Community',
      title: t('blog_post3_title') || 'Top 10 Most Swapped Skills This Month',
      desc: t('blog_post3_desc') || 'Web development, graphic design, and English tutoring lead the charts in Pakistan this month.',
      author: t('blog_author_analytics') || 'Analytics Team',
      date: 'May 15, 2026',
      readTime: '3 min read',
    },
    {
      emoji: '🏆', tag: 'Success',
      title: t('blog_post4_title') || 'From Zero to Hero: A Swap Story',
      desc: t('blog_post4_desc') || 'How Fatima from Karachi swapped her cooking skills for web development lessons.',
      author: t('blog_author_community') || 'Community Team',
      date: 'May 12, 2026',
      readTime: '6 min read',
    },
    {
      emoji: '💡', tag: 'Tips',
      title: t('blog_post5_title') || '5 Ways to Improve Your Swap Profile',
      desc: t('blog_post5_desc') || 'Boost your visibility and attract more swap partners with these simple profile optimization tips.',
      author: t('blog_author_team') || 'Gadd Kaam Team',
      date: 'May 10, 2026',
      readTime: '4 min read',
    },
    {
      emoji: '🌍', tag: 'Feature',
      title: t('blog_post6_title') || 'Remote Swaps: Breaking Location Barriers',
      desc: t('blog_post6_desc') || 'How our remote swap feature is connecting skill traders across all provinces of Pakistan.',
      author: t('blog_author_product') || 'Product Team',
      date: 'May 8, 2026',
      readTime: '5 min read',
    },
    {
      emoji: '📊', tag: 'Community',
      title: t('blog_post7_title') || 'Pakistan Skill Economy: 2026 Report',
      desc: t('blog_post7_desc') || 'Our annual analysis of skill exchange trends, growth patterns, and economic impact across Pakistan.',
      author: t('blog_author_analytics') || 'Analytics Team',
      date: 'May 5, 2026',
      readTime: '8 min read',
    },
    {
      emoji: '🤝', tag: 'Feature',
      title: t('blog_post8_title') || 'Introducing Women-Only Zone: A Safe Space',
      desc: t('blog_post8_desc') || 'Learn about our dedicated zone for female users and how it creates a safe, verified swap environment.',
      author: t('blog_author_team') || 'Gadd Kaam Team',
      date: 'May 2, 2026',
      readTime: '3 min read',
    },
    {
      emoji: '📱', tag: 'Guide',
      title: t('blog_post9_title') || 'Getting the Most Out of the Marketplace',
      desc: t('blog_post9_desc') || 'Advanced search, filtering, and matching techniques to find your perfect skill swap partner faster.',
      author: t('blog_author_product') || 'Product Team',
      date: 'Apr 28, 2026',
      readTime: '5 min read',
    },
  ];

  const allTags = ['All', ...new Set(posts.map(p => p.tag))];
  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tag === activeTag);
  const featured = posts.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="blog-page-container">
      <Navbar user={user} onHelplineClick={() => {}} onChatbotToggle={onChatbotToggle} />

      {/* ─── HERO ─── */}
      <section className="blog-hero">
        <div className="blog-hero-badge reveal fade-up">
          <BookOpen size={14} />
          {t('blog_badge') || 'Community Blog'}
        </div>
        <h1 className="reveal fade-up">
          {t('blog_page_title').split('&')[0]}
          {t('blog_page_title').includes('&') && <span>&amp; {t('blog_page_title').split('&')[1]}</span>}
        </h1>
        <p className="reveal fade-up">{t('blog_page_subtitle')}</p>

        {/* Reading stats strip */}
        <div className="blog-hero-stats reveal fade-up">
          <span>✍️ <strong>{posts.length}+</strong> {t('blog_stat_articles') || 'Articles'}</span>
          <span>|</span>
          <span>👥 <strong>2.4k+</strong> {t('blog_stat_readers') || 'Monthly Readers'}</span>
          <span>|</span>
          <span>🔖 <strong>6</strong> {t('blog_stat_categories') || 'Categories'}</span>
        </div>
      </section>

      <div className="blog-content">

        {/* ─── TAG FILTERS ─── */}
        <div className="blog-tag-filters reveal fade-up">
          {allTags.map(tag => {
            const style = tag !== 'All' ? TAG_COLORS[tag] : {};
            return (
              <button
                key={tag}
                className={`blog-tag-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
                style={activeTag === tag && tag !== 'All' ? {
                  background: style.bg,
                  color: style.color,
                  borderColor: style.border,
                } : {}}
              >
                {tag !== 'All' && TAG_ICONS[tag]}
                {tag}
              </button>
            );
          })}
        </div>

        {/* ─── FEATURED POST (only shown when "All" is active) ─── */}
        {activeTag === 'All' && featured && (
          <div className="blog-featured-card reveal fade-up">
            <div className="blog-featured-image">
              {featured.emoji}
              <div className="blog-featured-image-overlay" />
            </div>
            <div className="blog-featured-body">
              <span className="blog-featured-label">{t('blog_featured_label') || '⭐ Featured Article'}</span>
              <div className="blog-tag" style={TAG_COLORS[featured.tag]}>
                {TAG_ICONS[featured.tag]} {featured.tag}
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.desc}</p>
              <div className="blog-featured-meta">
                <div className="blog-meta-item"><User size={14} /> {featured.author}</div>
                <div className="blog-meta-item"><Clock size={14} /> {featured.readTime}</div>
                <div className="blog-meta-item">{featured.date}</div>
              </div>
              <button className="blog-read-btn">
                {t('blog_read_more') || 'Read Article'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── TRENDING BAR ─── */}
        {activeTag === 'All' && (
          <div className="blog-trending-bar reveal fade-up">
            <span className="blog-trending-label"><TrendingUp size={14} /> {t('blog_trending') || 'Trending:'}</span>
            {posts.slice(0, 3).map((p, i) => (
              <span key={i} className="blog-trending-item">{p.title.slice(0, 35)}…</span>
            ))}
          </div>
        )}

        {/* ─── BLOG GRID ─── */}
        <div className={`blog-grid ${activeTag === 'All' ? 'has-featured' : ''}`}>
          {rest.map((post, i) => {
            const tagStyle = TAG_COLORS[post.tag] || {};
            return (
              <div key={i} className="blog-card reveal fade-up" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="blog-card-image">
                  {post.emoji}
                  <div className="blog-card-hover-overlay">
                    <button className="blog-card-read-btn">{t('blog_read_more') || 'Read More'} →</button>
                  </div>
                </div>
                <div className="blog-card-body">
                  <span className="blog-tag" style={tagStyle}>
                    {TAG_ICONS[post.tag]} {post.tag}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <div className="blog-card-footer">
                    <div className="blog-card-meta">
                      <User size={12} /> {post.author}
                      <span className="blog-meta-dot">·</span>
                      <Clock size={12} /> {post.readTime}
                    </div>
                    <span className="blog-card-date">{post.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="blog-newsletter reveal fade-up">
          <div className="blog-newsletter-content">
            <h3>{t('blog_newsletter_title') || '📬 Never Miss a Story'}</h3>
            <p>{t('blog_newsletter_desc') || 'Get weekly insights on skill swaps, community highlights, and platform updates delivered to your inbox.'}</p>
          </div>
          <div className="blog-newsletter-form">
            <input
              type="email"
              className="blog-newsletter-input"
              placeholder={t('blog_newsletter_placeholder') || 'Enter your email...'}
            />
            <button className="blog-newsletter-btn">
              {t('blog_newsletter_btn') || 'Subscribe'} <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
    </div>
  );
}

export default BlogPage;

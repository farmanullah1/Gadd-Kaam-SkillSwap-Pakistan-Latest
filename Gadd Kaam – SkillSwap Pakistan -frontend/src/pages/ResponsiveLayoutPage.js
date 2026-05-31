// src/pages/ResponsiveLayoutPage.js
import React, { useState, useEffect } from 'react';
import { Menu, X, Smartphone, Monitor, ShieldAlert, Sparkles, LogOut, Sun, Moon } from 'lucide-react';
import styles from '../styles/ResponsiveLayout.module.css';

function ResponsiveLayoutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localTheme, setLocalTheme] = useState('light');

  // Sync theme with body class for testing
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (bodyClass.contains('dark-mode')) {
      setLocalTheme('dark');
    } else {
      setLocalTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
      window.dispatchEvent(new CustomEvent('theme_changed', { detail: 'dark' }));
    } else {
      document.body.classList.remove('dark-mode');
      window.dispatchEvent(new CustomEvent('theme_changed', { detail: 'light' }));
    }
  };

  return (
    <div className={styles.responsiveLayoutContainer}>
      
      {/* 1. Header with mobile navigation menu */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <a href="/home" className={styles.logo}>
            <Sparkles size={24} />
            <span>Gadd Kaam Spec</span>
          </a>

          {/* Nav List for large viewports / Controlled active overlay on mobile */}
          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navActive : ''}`}>
            <ul className={styles.navList}>
              <li>
                <a href="/home" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </a>
              </li>
              <li>
                <a href="/marketplace" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/dashboard" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </a>
              </li>
              <li>
                <button 
                  onClick={toggleTheme} 
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.5rem' }}
                  aria-label="Toggle Theme"
                >
                  {localTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </li>
            </ul>
          </nav>

          {/* Hamburger Menu Toggle (Touch Target minimum is 44x44px) */}
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* 2. Main Page Grid Section */}
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Main Content Area */}
          <div className={styles.contentArea}>
            
            {/* Introduction Card with clamp values details */}
            <section className={styles.introSection}>
              <h1>Responsive Spec Page</h1>
              <p>
                This responsive showcase page exhibits exact CSS typography standards, spacing rules, and touch-target sizes required for state-of-the-art mobile layouts. It relies on <strong>CSS Modules</strong> to isolate all responsive styling rules perfectly.
              </p>
              <button className={styles.ctaBtn}>
                Explore Skill Marketplace
              </button>
            </section>

            {/* Typography & Spacing Grid */}
            <section className={styles.grid}>
              <div className={styles.card}>
                <Monitor size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.8rem' }} />
                <h2>Fluid Typography</h2>
                <p>
                  Calculates scale dynamically using <code>clamp()</code> syntax. It enforces a strict 14px minimum boundary to guarantee high legibility on any mobile viewport.
                </p>
              </div>

              <div className={styles.card}>
                <Smartphone size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.8rem' }} />
                <h2>Touch Targets</h2>
                <p>
                  Interactive toggles, buttons, links, and forms maintain a strict tap target minimum of <strong>44×44px</strong> on mobile viewports for precise click triggers.
                </p>
              </div>

              <div className={styles.card}>
                <ShieldAlert size={32} style={{ color: 'var(--color-primary)', marginBottom: '0.8rem' }} />
                <h2>Modular Spacing</h2>
                <p>
                  Utilizes responsive spacing units that automatically contract by exactly 25% on mobile viewports, maximizing real estate for small devices.
                </p>
              </div>
            </section>

            {/* Dummy Long Content block demonstrating Typography line heights */}
            <section className={styles.card}>
              <h2>Responsive Text Scaling & Line Height</h2>
              <p>
                Line-height metrics for all body nodes are locked to exactly <code>1.5</code>, preventing overlapping sentences when reading long-form articles. Headings use <code>1.2</code> to keep grouped title words tightly structured across mobile wrapper columns.
              </p>
              <p>
                On screens smaller than 768px, the base root HTML font scale drops from 16px to 15px (93.75%). Fluid clamp typography dynamically handles intermediate sizes to yield a smooth visual experience during desktop resizes.
              </p>
            </section>

          </div>

          {/* Sidebar Area */}
          <aside className={styles.sidebar}>
            
            {/* Widget 1: Lazy-loaded Responsive Image Placeholder */}
            <div className={styles.widget}>
              <h2>Responsive Media</h2>
              <div className={styles.imageWrapper}>
                <img 
                  src="/responsive_placeholder.png" 
                  alt="Sleek 3D device mockup illustration of a premium responsive design" 
                  className={styles.image}
                  loading="lazy"
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'gray', marginTop: '0.8rem', marginBottom: 0 }}>
                Mockup is loaded via <code>loading="lazy"</code> to optimize rendering bandwidth below the fold.
              </p>
            </div>

            {/* Widget 2: Spec Summary Panel */}
            <div className={styles.widget}>
              <h2>Layout Summary</h2>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', lineHeight: '1.7' }}>
                <li>Desktop Container: 1200px max</li>
                <li>Desktop padding: 2rem</li>
                <li>Mobile padding: 1rem (-50%)</li>
                <li>Tap-target size: min 44px</li>
              </ul>
            </div>

          </aside>

        </div>
      </main>

      {/* 3. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3>About Gadd Kaam</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Pakistan's premier moneyless skill sharing ecosystem built on safety, trust, and shared values.
            </p>
          </div>
          <div className={styles.footerColumn}>
            <h3>Community Links</h3>
            <ul>
              <li><a href="/faq-page" className={styles.footerLink}>FAQ Help Desk</a></li>
              <li><a href="/safety-tips" className={styles.footerLink}>Safety Guide</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>Theme & Styling</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Supports light and dark mode automatically. Click toggle in the navbar to preview theme shifts.
            </p>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© 2026 Gadd Kaam - Technical Layout Standards Showcase</p>
        </div>
      </footer>

    </div>
  );
}

export default ResponsiveLayoutPage;

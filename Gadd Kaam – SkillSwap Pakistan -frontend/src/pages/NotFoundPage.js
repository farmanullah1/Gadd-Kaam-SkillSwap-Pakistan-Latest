// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

function NotFoundPage({ onChatbotToggle }) {
  return (
    <div className="not-found-page-wrapper">
      <Navbar onChatbotToggle={onChatbotToggle} />
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: '800', color: 'var(--color-primary-orange, #ff6b00)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-slate-dark, #1e293b)' }}>Page Not Found</h2>
        <p style={{ maxWidth: '480px', color: 'var(--color-slate-medium, #64748b)', marginBottom: '2rem', lineHeight: '1.6' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-orange, #ff6b00)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            <Home size={18} /> Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #cbd5e1',
              color: 'var(--color-slate-dark, #334155)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;

// src/pages/PartnersPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';


function PartnersPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  useScrollReveal();

  const partners = [
    { emoji: '🏛️', name: 'Ministry of IT', desc: 'Government of Pakistan' },
    { emoji: '🎓', name: 'NUST', desc: 'National University' },
    { emoji: '💼', name: 'PITB', desc: 'Punjab IT Board' },
    { emoji: '🌐', name: 'Ignite', desc: 'National Tech Fund' },
    { emoji: '📱', name: 'Jazz', desc: 'Telecom Partner' },
    { emoji: '🏗️', name: 'NIC Karachi', desc: 'Incubation Center' },
    { emoji: '📚', name: 'IBA Sukkur', desc: 'Academic Partner' },
    { emoji: '🚀', name: 'Daftarkhwan', desc: 'Co-working Partner' },
  ];

  const benefits = [
    'Access to Pakistan\'s largest skill exchange community',
    'Co-branded marketing and visibility',
    'Joint skill development programs',
    'Community engagement and CSR opportunities',
    'Data insights on skill demand and supply',
    'Priority support and dedicated account management',
  ];

  return (
    <div className="partners-page-container">
      <Navbar user={user} onHelplineClick={() => {}} onChatbotToggle={onChatbotToggle} />

      <section className="partners-hero">
        <h1 className="reveal fade-up">{t('partners_page_title').split(' ').map((w, i) => i === 1 ? <span key={i}> {w}</span> : (i > 0 ? ' ' + w : w))}</h1>
        <p className="reveal fade-up">{t('partners_page_subtitle')}</p>
      </section>

      <div className="partners-content">
        <div className="partners-logo-grid">
          {partners.map((p, i) => (
            <div key={i} className="partner-logo-card reveal fade-up" style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="partner-logo-emoji">{p.emoji}</span>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="partners-benefits reveal fade-up">
          <h2>{t('partners_page_title') === 'Our Partners' ? 'Why Partner With Us?' : t('partners_page_title') === 'ہمارے شراکت دار' ? 'ہمارے ساتھ شراکت کیوں؟' : 'اسان سان شراڪت ڇو؟'}</h2>
          <div className="partners-benefits-list">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-item">
                <CheckCircle2 size={18} />
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer user={user} onChatbotToggle={onChatbotToggle} />
    </div>
  );
}

export default PartnersPage;

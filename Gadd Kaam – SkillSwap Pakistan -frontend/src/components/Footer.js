// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MessageSquare, Heart } from 'lucide-react'; 
import '../styles/footer.css';

function Footer({ user, onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');

  // --- Typewriter State ---
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [typingClass, setTypingClass] = useState('typing');

  // The rotating taglines
 const taglines = [
  // Original English
  "Empowering communities by connecting skills, cash-free.",
  "Trade your talents, save money, and grow together.",
  "Building trust and connections through skill sharing.",
  "Your #1 platform for secure, moneyless exchanges.",

  // More English taglines (positive, community-focused)
  "Skills for skills – no cash needed, just community.",
  "Unlock potential through barter and brotherhood.",
  "Share what you know, gain what you need.",
  "Cash-free skills exchange: stronger together.",
  "From one hand to another – skills that matter.",
  "Connect, share, thrive – without money in between.",
  "Empower each other with talent, not transactions.",
  "Barter your way to a better tomorrow.",
  "Community-powered growth, zero cost.",
  "Exchange expertise, build lasting bonds.",
  "No money, no problem – just pure skill sharing.",
  "Rise together through mutual help and trust.",
  "Your skills, my skills, our community wins.",
  "Moneyless magic: skills that unite us.",
  "Trade time and talent for real change.",
  "Stronger neighborhoods, skill by skill.",
  "Help today, grow forever – cash-free.",
  "Where skills meet hearts, not wallets.",
  "Barter brilliance, build belonging.",

  // Urdu taglines (script)
  "ہنر کا تبادلہ، بغیر پیسے کے کمیونٹی مضبوط کریں۔",
  "اپنے ہنر بیچیں، پیسے بچائیں، ساتھ بڑھیں۔",
  "اعتماد اور رابطوں کی تعمیر ہنر شیئرنگ سے۔",
  "محفوظ، بغیر رقم کے تبادلے کا نمبر 1 پلیٹ فارم۔",
  "ہنر سے ہنر – کوئی نقد نہیں، صرف کمیونٹی۔",
  "صلاحیتوں کا سودا، پیسوں کے بغیر ترقی۔",
  "جو جانتے ہو شیئر کرو، جو چاہیے حاصل کرو۔",
  "بغیر نقد کے ہنر کا تبادلہ: ساتھ مضبوط بنیں۔",
  "ایک ہاتھ سے دوسرے تک – ہنر جو اہم ہیں۔",
  "رابطہ کرو، شیئر کرو، ترقی کرو – بغیر پیسے۔",
  "ایک دوسرے کو بااختیار بنائیں ہنر سے، نہ لین دین سے۔",
  "بارٹر سے بہتر کل بنائیں۔",
  "کمیونٹی کی طاقت، زیرو لاگت۔",
  "ماہریت کا تبادلہ، دیرپا رشتے بنائیں۔",
  "پیسہ نہیں، مسئلہ نہیں – خالص ہنر شیئرنگ۔",
  "ساتھ مل کر اٹھیں، باہمی مدد سے۔",
  "آپ کا ہنر، میرا ہنر، ہماری کمیونٹی جیتے۔",
  "بغیر پیسے کے جادو: ہنر جو ہمیں جوڑتے ہیں۔",
  "وقت اور ہنر کا تبادلہ، حقیقی تبدیلی کے لیے۔",
  "مضبوط محلے، ہنر بہ ہنر۔",

  // Roman Urdu (for code/UI/search)
  "Hunr ka tabadla, baghair paise ke community mazboot karen.",
  "Apne hunr bechein, paise bachayein, saath barhein.",
  "Aitmaad aur rabton ki tameer hunr sharing se.",
  "Mehfooz, baghair raqam ke tabadlay ka number 1 platform.",
  "Hunr se hunr – koi naqd nahi, sirf community.",
  "Salahiyaton ka sauda, paison ke baghair taraqqi.",
  "Jo jante ho share karo, jo chahiye haasil karo.",
  "Baghair naqd ke hunr ka tabadla: saath mazboot banein.",
  "Ek haath se doosre tak – hunr jo ahem hain.",
  "Rabita karo, share karo, taraqqi karo – baghair paise.",
  "Ek doosre ko ba-ikhtiyar banayein hunr se, na len den se.",
  "Barter se behtar kal banayein.",
  "Community ki taqat, zero cost.",
  "Maharat ka tabadla, derpa rishte banayein.",
  "Paisa nahi, masla nahi – khalis hunr sharing.",
  "Saath mil kar uthein, baahmi madad se.",
  "Aap ka hunr, mera hunr, hamari community jeete.",
  "Baghair paise ke jadu: hunr jo humein jorte hain.",

  // Sindhi taglines (script + Roman transliteration in comment)
  "هنر جو بدلاء، بغير پئسن جي ڪميونٽي مضبوط ڪريو۔",          // Hunr jo badlao, baghair paisan ji community mazboot kariyo.
  "پنهنجو هنـر وڪڻو، پئسا بچايو، گڏجي وڌو۔",                    // Panhanjo hunr vikyo, paisa bachayo, gadji vadho.
  "ڀرواسو ۽ رابطن جي تعمير هنـر شيئرنگ سان۔",                 // Bharoso ain rabtan ji tameer hunr sharing saan.
  "محفوظ، بغير رقم جي بدلن جو نمبر 1 پليٽ فارم۔",              // Mehfooz, baghair raqam ji badlan jo number 1 platform.
  "هنـر کان هنـر – ڪوبه نقد نه، رڳو ڪميونٽي۔",                  // Hunr kan hunr – koi naqd na, ragho community.
  "صلاحيتن جو سودو، پئسن کان سواءِ ترقي۔",                     // Salahiyatan jo saudo, paisan kan sawa taraqqi.
  "جيڪي ڄاڻو شيئر ڪريو، جيڪي گهرجي حاصل ڪريو۔",               // Je ki jaano share kariyo, je ki gharji hasil kariyo.
  "بغير نقد جي هنـر جو بدلاءُ: گڏجي مضبوط ٿيو۔",                // Baghair naqd ji hunr jo badlao: gadji mazboot thiyo.
  "هڪ هٿ کان ٻئي تائين – هنـر جيڪي اهم آهن۔",                   // Hik hath kan biyan tain – hunr je ahem aahin.
  "رابطو ڪريو، شيئر ڪريو، ترقي ڪريو – بغير پئسن۔",             // Rabto kariyo, share kariyo, taraqqi kariyo – baghair paisan.
  "هڪ ٻئي کي بااختيار بڻايو هنـر سان، نه لين ڏين سان۔",         // Hik biyi khe ba-ikhtiyar banayo hunr saan, na len den saan.
  "بارٽر سان بهتر ڪل بڻايو۔",                                   // Barter saan behtar kal banayo.
  "ڪميونٽي جي طاقت، زيرو خرچ۔",                                 // Community ji taqat, zero kharch.
  "ماهريت جو بدلاءُ، ديرپا رشتا بڻايو۔",                        // Maharat jo badlao, derpa rishta banayo.
  "پئسو نه، مسئلو نه – خالص هنـر شيئرنگ۔",                      // Paiso na, maslo na – khalis hunr sharing.
  "گڏجي اٿو، باہمي مدد سان۔",                                   // Gadji utho, baahmi madad saan.
  "توهان جو هنـر، منهنجو هنـر، اسان جي ڪميونٽي کٽي۔",            // Tawhan jo hunr, munhijo hunr, asaan ji community khati.
  "بغير پئسن جي جادو: هنـر جيڪي اسان کي جوڙين ٿا۔"               // Baghair paisan ji jadu: hunr je asaan khe jorain tha.
];


  // --- Typewriter Effect Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingClass('removing'); 
      
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length); 
        setTypingClass('typing'); 
      }, 1000); 
      
    }, 6000); 

    return () => clearInterval(interval);
  }, [taglines.length]);

  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  const handleMarketplaceClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const sindhiFooterStyle = isSindhiMode ? {
    backgroundImage: `url(/Footer-sindhi.png)`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <footer className={`footer ${isSindhiMode ? 'sindhi-footer-mode' : ''}`} style={sindhiFooterStyle}>
      <div className="footer-container">
        
        {/* Top Section: Grid Layout */}
        <div className="footer-top-section">
          
          {/* Column 1: Brand & Typewriter */}
          <div className="footer-brand-column">
            
            {/* ✅ UPDATED LOGO TO MATCH NAVBAR STYLE */}
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo-wrapper">
                <img 
                  src="/Gadd_Kaam.png" 
                  alt="Gadd Kaam Logo" 
                  className="footer-brand-img"
                  onError={(e)=>{e.target.onerror=null; e.target.src="https://placehold.co/40x40?text=GK"}}
                />
              </div>
              <span className="footer-brand-text">Gadd <span className="footer-highlight-text">Kaam</span></span>
            </Link>
            
            {/* Dynamic Typewriter Tagline */}
            <div className="footer-tagline-wrapper">
              <p className={`footer-dynamic-typewriter ${typingClass}`}>
                {taglines[taglineIndex]}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_quick_links")}</h4>
            <ul className="footer-list">
              <li><Link to="/marketplace" className="footer-link" onClick={handleMarketplaceClick}>{t("navbar_marketplace")}</Link></li>
              <li><Link to="/about-us" className="footer-link">{t("navbar_about_us")}</Link></li>
              <li><Link to="/offer-skill" className="footer-link">{t("post_a_skill")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_support")}</h4>
            <ul className="footer-list">
              <li><Link to="/faq-page" className="footer-link">{t("faq_link")}</Link></li>
              <li><Link to="/contact-us" className="footer-link">{t("navbar_contact")}</Link></li>
              <li><Link to="/dispute-resolution-page" className="footer-link">{t("dispute_resolution_link")}</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_follow_us")}</h4>
            <div className="social-icons">
              <a href="https://facebook.com/" className="social-icon-link fb" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/" className="social-icon-link tw" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/" className="social-icon-link ig" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom-section">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Gadd Kaam. Made with <Heart size={14} fill="red" color="red" style={{margin:'0 2px', display:'inline'}}/> in Pakistan.
          </p>
          <div className="footer-legal-links">
             <Link to="/privacy-policy" className="legal-link">{t("footer_privacy_policy")}</Link> 
             <span className="separator">•</span>
             <Link to="/terms-of-service" className="legal-link">{t("footer_terms_of_service")}</Link>
          </div>
        </div>

        {/* Chatbot Toggle (Floating) */}
        <div className="chatbot-icon-container float-anim" onClick={onChatbotToggle}>
          <MessageSquare size={28} />
        </div>

      </div>
    </footer>
  );
}

export default Footer;
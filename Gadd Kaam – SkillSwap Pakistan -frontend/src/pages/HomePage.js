import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import { useNavigate } from 'react-router-dom';

import useScrollReveal from '../hooks/useScrollReveal';

import { 
  Star, Shield, ArrowRight, User, CheckCircle, Search, Zap, Sparkles,
  Users, Clock, ThumbsUp, Code, BookOpen, Brush, MessageSquare, Briefcase, HeartHandshake,
  Trophy, Award, ChevronDown
} from 'lucide-react';

const localHomeTranslations = {
  en: {
    active_swappers: "Active Swappers",
    hours_saved: "Hours Saved",
    unique_skills: "Unique Skills",
    match_rating: "Match Rating",
    impact_title: "Impact in Numbers",
    impact_subtitle: "Real connections, tangible growth, zero cost. Here's our community's footprint.",
    
    leaderboard_title: "Top Swappers of the Month",
    leaderboard_subtitle: "Recognizing our community leaders who shared the most value and built trust this month.",
    leaderboard_rank: "Rank",
    leaderboard_swaps: "Swaps Completed",
    leaderboard_verified: "Verified Profile",
    leaderboard_top_skills: "Primary Skills",
    leaderboard_hours_shared: "Hours Shared",
    tariq_name: "Tariq Ali",
    tariq_location: "Lahore",
    tariq_skills: "Python Programming, WordPress",
    kanza_name: "Kanza Farooq",
    kanza_location: "Karachi",
    kanza_skills: "UI/UX Design, Figma",
    shakir_name: "Shakir Khan",
    shakir_location: "Islamabad",
    shakir_skills: "SEO, Content Writing",
    
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Got questions? We've got answers to help you start swapping skills confidently.",
    faq_q1: "How does Gadd Kaam work without money?",
    faq_a1: "Gadd Kaam is a pure barter platform. You offer a skill you have (like tutoring or graphic design) and in return, you receive a skill you need from someone else. No money is exchanged, only time and expertise.",
    faq_q2: "Is it safe to swap skills with strangers?",
    faq_a2: "Yes, safety is our top priority. We verify profiles, offer user reviews, and have a dedicated Dispute Resolution team. We also have a secure, vetted Women-Only Zone for absolute comfort and privacy.",
    faq_q3: "What happens if a swap is not completed properly?",
    faq_a3: "If a swap partner does not fulfill their commitment, you can open a dispute. Our Dispute Resolution team will investigate and take necessary actions, including profile suspension, to keep the platform trusted.",
    faq_q4: "Can I swap multiple skills at once?",
    faq_a4: "Absolutely! You can list as many skills as you want on your profile. You can swap python programming for cooking with one person, and UI/UX design for SEO with another.",
    
    hero_words: ["Futures", "Community", "Trust", "Careers", "Dreams", "Connections", "Opportunities", "Friendships", "Confidence", "Networks", "Success", "Pathways", "Independence", "Experience", "Hope", "Stability", "Expertise", "Reputation", "Livelihoods", "Unity", "Growth", "Progress", "Skills", "Empowerment", "Journey"],
    women_words: ["Women", "Sisters", "Growth", "Empowerment", "Safety", "Strength", "Progress", "Equality", "Confidence", "Independence", "Leadership", "Dignity", "Freedom", "Success"],
    explore_categories_title: "Explore Popular Categories",
    explore_categories_subtitle: "Find high-demand skills in Pakistan's fast-growing talent exchange network.",
    cat_tech_title: "Tech & Programming",
    cat_tech_desc: "Web development, mobile apps, database management, and scripting.",
    cat_lang_title: "Languages & Academics",
    cat_lang_desc: "English speaking, Urdu writing, Sindhi tutoring, school math & science.",
    cat_design_title: "Design & Creative Media",
    cat_design_desc: "Logo branding, Photoshop editing, Figma prototyping, and video curation.",
    cat_marketing_title: "Marketing & Business",
    cat_marketing_desc: "Social media handling, SEO ranking, content marketing, and business planning.",
    cat_trade_title: "Professional Trades",
    cat_trade_desc: "Electrician services, plumbing, tailoring, AC repair, and culinary arts.",
    cat_lifestyle_title: "Lifestyle & Personal Growth",
    cat_lifestyle_desc: "Fitness training, makeup tutorials, yoga sessions, and career counseling.",
    discover_popular_subtitle: "Discover what's popular in your area.",
    why_choose_title: "Why Choose Gadd Kaam?",
    why_choose_subtitle: "Pakistan's premier moneyless skill sharing ecosystem built on safety, trust, and shared values.",
    pillar_barter_title: "Zero Cash Barter",
    pillar_barter_desc: "Exchange talents directly. No wallet needed, no hidden fees. Save your cash for other daily expenses while getting expert help from Pakistani creators.",
    pillar_safe_title: "100% Safe & Secure",
    pillar_safe_desc: "Swap with confidence. We offer dedicated dispute resolution, a strict profile verification protocol, and local Pakistani community guidelines.",
    pillar_growth_title: "Mutual Growth",
    pillar_growth_desc: "Build lasting relationships in your city. Boost your portfolio, gather trust badges, and learn from professionals while teaching what you love.",
    women_zone_safe_space_for: "A Safe Space for ",
  },
  ur: {
    active_swappers: "سرگرم سوائپرز",
    hours_saved: "بچائے گئے گھنٹے",
    unique_skills: "منفرد مہارتیں",
    match_rating: "میچ ریٹنگ",
    impact_title: "نمبرز میں ہمارا اثر",
    impact_subtitle: "حقیقی روابط، ٹھوس ترقی، صفر لاگت۔ یہ ہے ہماری کمیونٹی کا خاکہ۔",
    
    leaderboard_title: "مہینے کے بہترین سوائپرز",
    leaderboard_subtitle: "اس مہینے سب سے زیادہ ہنر بانٹنے اور اعتماد بڑھانے والے ہمارے کمیونٹی ہیروز۔",
    leaderboard_rank: "درجہ",
    leaderboard_swaps: "کامیاب تبادلے",
    leaderboard_verified: "تصدیق شدہ پروفائل",
    leaderboard_top_skills: "بنیادی مہارتیں",
    leaderboard_hours_shared: "گھنٹے بانٹے گئے",
    tariq_name: "طارق علی",
    tariq_location: "لاہور",
    tariq_skills: "پائتھون پروگرامنگ، ورڈپریس",
    kanza_name: "کنزہ فاروق",
    kanza_location: "کراچی",
    kanza_skills: "یو آئی/یو ایکس ڈیزائن، فگما",
    shakir_name: "شاکر خان",
    shakir_location: "اسلام آباد",
    shakir_skills: "ایس ای او، مواد نویسی",
    
    faq_title: "اکثر پوچھے گئے سوالات",
    faq_subtitle: "کوئی سوال ہے؟ اعتماد کے ساتھ ہنر کا تبادلہ شروع کرنے کے لیے ہمارے جوابات دیکھیں۔",
    faq_q1: "قد کام بغیر پیسوں کے کیسے کام کرتا ہے؟",
    faq_a1: "قد کام خالص بارٹر (مبادلہ) پلیٹ فارم ہے۔ آپ اپنی مہارت (جیسے پڑھانا یا گرافک ڈیزائن) پیش کرتے ہیں اور بدلے میں کسی دوسرے سے اپنی ضرورت کا ہنر حاصل کرتے ہیں۔ کوئی پیسہ شامل نہیں ہوتا، صرف وقت اور مہارت۔",
    faq_q2: "کیا اجنبیوں کے ساتھ ہنر کا تبادلہ کرنا محفوظ ہے؟",
    faq_a2: "جی ہاں، سیکیورٹی ہماری اولین ترجیح ہے۔ ہم پروفائلز کی تصدیق کرتے ہیں، ریٹنگز اور ریویو فراہم کرتے ہیں، اور تنازعات کے حل کی ٹیم موجود ہے۔ اس کے علاوہ، خواتین کے لیے مکمل طور پر محفوظ 'ویمن اونلی زون' بھی ہے۔",
    faq_q3: "اگر کوئی تبادلہ صحیح طریقے سے مکمل نہ ہو تو کیا ہوگا؟",
    faq_a3: "اگر کوئی پارٹنر اپنا وعدہ پورا نہیں کرتا، تو آپ تنازعہ درج کر سکتے ہیں۔ ہماری سپورٹ ٹیم اس کی تحقیقات کرے گی اور پلیٹ فارم کو قابل اعتماد رکھنے کے لیے ضروری اقدامات (جیسے پروفائل معطل کرنا) کرے گی۔",
    faq_q4: "کیا میں ایک ساتھ کئی مہارتوں کا تبادلہ کر سکتا ہوں؟",
    faq_a4: "بالکل! آپ اپنے پروفائل پر جتنی چاہیں مہارتیں شامل کر سکتے ہیں۔ آپ ایک شخص کے ساتھ پائتھون کے بدلے کوکنگ اور دوسرے کے ساتھ ڈیزائننگ کے بدلے ایس ای او کا تبادلہ کر سکتے ہیں۔",
    
    hero_words: ["مستقبل", "برادری", "بھروسہ", "روزگار", "خواب", "رابطے", "مواقع", "دوستی", "اعتماد", "نیٹ ورک", "کامیابی", "راستے", "آزادی", "تجربہ", "امید", "استحکام", "ماہریت", "ساکھ", "اتحاد", "ترقی"],
    women_words: ["خواتین", "بہنیں", "ترقی", "بااختیار بنانا", "حفاظت", "طاقت", "برابری", "حقوق", "آزادی", "اعتماد", "قیادت", "عزت نفس", "تعلیم", "ہمت", "اتحاد", "کامیابی"],
    explore_categories_title: "مقبول زمرہ جات دریافت کریں",
    explore_categories_subtitle: "پاکستان کے تیزی سے بڑھتے ہوئے ہنر کے تبادلے کے نیٹ ورک میں اعلیٰ مانگ کی مہارتیں تلاش کریں۔",
    cat_tech_title: "ٹیکنالوجی اور پروگرامنگ",
    cat_tech_desc: "ویب ڈویلپمنٹ، موبائل ایپس، ڈیٹا بیس مینجمنٹ، اور اسکرپٹنگ۔",
    cat_lang_title: "زبانیں اور تعلیم",
    cat_lang_desc: "انگریزی بولنا، اردو لکھنا، سندھی پڑھانا، اسکول کی ریاضی اور سائنس۔",
    cat_design_title: "ڈیزائن اور تخلیقی میڈیا",
    cat_design_desc: "لوگو برانڈنگ، فوٹوشاپ ایڈیٹنگ، فگما پروٹو ٹائپنگ، اور ویڈیو ایڈیٹنگ۔",
    cat_marketing_title: "مارکیٹنگ اور کاروبار",
    cat_marketing_desc: "سوشل میڈیا ہینڈلنگ، ایس ای او درجہ بندی، مواد کی مارکیٹنگ، اور کاروباری منصوبہ بندی۔",
    cat_trade_title: "پیشہ ورانہ تجارت",
    cat_trade_desc: "الیکٹریشن کی خدمات، پلمبنگ، سلائی کڑھائی، اے سی کی مرمت، اور کھانا پکانا۔",
    cat_lifestyle_title: "طرز زندگی اور ذاتی ترقی",
    cat_lifestyle_desc: "فٹنس ٹریننگ، میک اپ ٹیوٹوریلز، یوگا سیشنز، اور کیریئر کونسلنگ۔",
    discover_popular_subtitle: "دریافت کریں کہ آپ کے علاقے میں کیا مقبول ہے۔",
    why_choose_title: "قد کام کا انتخاب کیوں کریں؟",
    why_choose_subtitle: "پاکستان کا پہلا اور سب سے بڑا کیش لیس ہنر تبادلہ پلیٹ فارم جو سیکیورٹی، اعتماد اور باہمی تعاون پر مبنی ہے۔",
    pillar_barter_title: "بغیر پیسے کا تبادلہ",
    pillar_barter_desc: "براہ راست ہنر کا تبادلہ کریں۔ کسی بٹوے کی ضرورت نہیں، کوئی خفیہ چارجز نہیں ہیں۔ پاکستانی تخلیق کاروں سے ماہرانہ مدد حاصل کرتے ہوئے اپنے نقد پیسے بچائیں۔",
    pillar_safe_title: "100٪ محفوظ اور مامون",
    pillar_safe_desc: "اعتماد کے ساتھ تبادلہ کریں۔ ہم تنازعات کے حل کے لیے خصوصی ٹیم، سخت پروفائل تصدیق اور مقامی پاکستانی کمیونٹی گائیڈ لائنز فراہم کرتے ہیں۔",
    pillar_growth_title: "باہمی ترقی",
    pillar_growth_desc: "اپنے شہر میں پائیدار تعلقات بنائیں۔ اپنا پورٹ فولیو بہتر کریں، تعریفی بیجز حاصل کریں اور ہنر سکھاتے ہوئے پیشہ ور افراد سے سیکھیں۔",
    women_zone_safe_space_for: "ایک محفوظ جگہ برائے ",
  },
  sd: {
    active_swappers: "سرگرم سوائپرز",
    hours_saved: "بچايل ڪلاڪ",
    unique_skills: "منفرد مهارتون",
    match_rating: "ميچ ريٽنگ",
    impact_title: "نمبرن ۾ اسان جو اثر",
    impact_subtitle: "حقيقي رابطا، مضبوط ترقي، ٻڙي قيمت۔ هي آهي اسان جي ڪميونٽي جو نقشو۔",
    
    leaderboard_title: "مهيني جا بهترين سوائپرز",
    leaderboard_subtitle: "هن مهيني سڀ کان وڌيڪ هنر ونڊيندڙ ۽ اعتماد وڌائيندڙ اسان جا ڪميونٽي هيرو۔",
    leaderboard_rank: "درجو",
    leaderboard_swaps: "ڪامياب تبادلا",
    leaderboard_verified: "تصديق ٿيل پروفائل",
    leaderboard_top_skills: "بنيادي مهارتون",
    leaderboard_hours_shared: "ڪلاڪ ونڊيا ويا",
    tariq_name: "طارق علي",
    tariq_location: "لاهور",
    tariq_skills: "پائٿون پروگرامنگ، ورڊپريس",
    kanza_name: "ڪنزہ فاروق",
    kanza_location: "ڪراچي",
    kanza_skills: "يو آءِ/يو ايڪس ڊيزائن، فگما",
    shakir_name: "شاڪر خان",
    shakir_location: "اسلام آباد",
    shakir_skills: "ايس اي او، مواد نويسي",
    
    faq_title: "اڪثر پڇيا ويندڙ سوال",
    faq_subtitle: "ڪو سوال اٿو؟ اعتماد سان هنر جو تبادلو شروع ڪرڻ لاءِ اسان جا جواب ڏسو۔",
    faq_q1: "گڏ ڪم پئسن کان سواءِ ڪيئن ڪم ڪندو آهي؟",
    faq_a1: "گڏ ڪم هڪ خالص بارٽر (بدلاءُ) پليٽ فارم آهي۔ توهان پنهنجي مهارت (جيئن پڙهائڻ يا گرافڪ ڊيزائن) پيش ڪريو ٿا ۽ بدلي ۾ ڪنهن ٻئي کان پنهنجي ضرورت جو هنر حاصل ڪريو ٿا، جنهن ۾ ڪو به پئسو شامل ناهي۔",
    faq_q2: "ڇا اڻڄاتل ماڻهن سان هنر جو تبادلو ڪرڻ محفوظ آهي؟",
    faq_a2: "جي ها، سيڪيورٽي اسان جي پهرين ترجيح آهي۔ اسان پروفائلز جي تصديق ڪريون ٿا، ريٽنگون ۽ ريويو ڏيون ٿا، ۽ تڪرارن جي حل لاءِ خاص ٽيم آهي۔ گڏوگڏ، عورتن لاءِ هڪ محفوظ 'وومين اوني زون' پڻ آهي۔",
    faq_q3: "جيڪڏهن ڪو بدلاءُ صحيح طريقي سان پورو نه ٿئي ته ڇا ٿيندو؟",
    faq_a3: "جيڪڏهن ڪو پارٽنر پنهنجو واعدو پورو نٿو ڪري، ته توهان تڪرار داخل ڪري سگهو ٿا. اسان جي ٽيم تحقيق ڪندي ۽ پليٽ فارم کي قابل اعتماد رکڻ لاءِ ضروري قدم (جيئن پروفائل بلاڪ ڪرڻ) کڻندي.",
    faq_q4: "ڇا مان هڪ ئي وقت ڪيتريون ئي مهارتون تبديل ڪري سگهان ٿو؟",
    faq_a4: "بلڪل! توهان پنهنجي پروفائل تي جيتريون چاهيو مهارتون شامل ڪري سگهو ٿا. توهان هڪ ماڻهو سان پائٿون جي بدلي ڪوڪنگ ۽ ٻئي سان ڊيزائننگ جي بدلي ايس اي او جو تبادلو ڪري سگهو ٿا.",
    hero_words: ["مستقبل", "برادري", "ڀرواسو", "روزگار", "خواب", "رابطا", "موقعا", "دوستي", "اعتماد", "نيٽ ورڪ", "ڪاميابي", "رستا", "آزادي", "تجربو", "اميد", "استحڪام", "ماهريت", "ساک", "اتحاد", "ترقي"],
    women_words: ["عورتون", "ڀينر", "ترقي", "بااختيار بڻائڻ", "حفاظت", "طاقت", "برابري", "حقوق", "آزادي", "اعتماد", "رهنمائي", "عزت", "تعليم", "همت", "اتحاد", "ڪاميابي"],
    explore_categories_title: "مقبول درجا دريافت ڪريو",
    explore_categories_subtitle: "پاڪستان جي تيزيءَ سان وڌندڙ هنر جي مٽاسٽا نيٽ ورڪ ۾ اعليٰ گهرج واريون مهارتون ڳوليو.",
    cat_tech_title: "ٽيڪنالاجي ۽ پروگرامنگ",
    cat_tech_desc: "ويب ڊولپمينٽ، موبائل ايپس، ڊيٽابيس مئنيجمينٽ، ۽ اسڪرپٽنگ.",
    cat_lang_title: "زبانون ۽ تعليم",
    cat_lang_desc: "انگريزي ڳالهائڻ، اردو لکڻ، سنڌي پڙهائڻ، اسڪول جي رياضي ۽ سائنس.",
    cat_design_title: "ڊيزائن ۽ تخليقي ميڊيا",
    cat_design_desc: "لوگو برانڊنگ، فوٽوشاپ ايڊيٽنگ، فگما پروٽوٽائپنگ، ۽ ويڊيو ايڊيٽنگ.",
    cat_marketing_title: "مارڪيٽنگ ۽ ڪاروبار",
    cat_marketing_desc: "سوشل ميڊيا هينڊلنگ، ايس اي او رينڪنگ، مواد جي مارڪيٽنگ، ۽ ڪاروباري منصوبابندي.",
    cat_trade_title: "پيشي ورانه هنر",
    cat_trade_desc: "اليڪٽريشن خدمتون، پلمبنگ، درزي ڪم، اي سي مرمت، ۽ رڌ پچاءُ.",
    cat_lifestyle_title: "طرز زندگي ۽ ذاتي ترقي",
    cat_lifestyle_desc: "فٽنيس ٽريننگ، ميڪ اپ ٽيوٽوريل، يوگا سيشن، ۽ ڪيريئر ڪائونسلنگ.",
    discover_popular_subtitle: "دريافت ڪريو ته توهان جي علائقي ۾ ڪهڙيون مهارتون مقبول آهن.",
    why_choose_title: "گڏ ڪم جو چونڊ ڇو ڪجي؟",
    why_choose_subtitle: "پاڪستان جو پهريون ۽ سڀ کان وڏو ڪيش ليس هنر مٽاسٽا پليٽ فارم جيڪو سيڪيورٽي، ڀروسي ۽ باهمي تعاون تي ٻڌل آهي.",
    pillar_barter_title: "ٻڙي پئسو واپار",
    pillar_barter_desc: "سڌو سنئون مهارتن جو تبادلو ڪريو. نه ڪنهن والٽ جي ضرورت، نه لڪيل چارجز. پاڪستاني هنر مندن کان مدد وٺڻ سان گڏ پنهنجا پئسا بچايو.",
    pillar_safe_title: "100٪ محفوظ ۽ سلامت",
    pillar_safe_desc: "اعتماد سان مٽاسٽا ڪريو. اسان تڪرارن جي حل لاءِ خاص ٽيم، سخت پروفائل تصديق ۽ مقامي پاڪستاني ڪميونٽي اصول مهيا ڪيون ٿا.",
    pillar_growth_title: "باهمي ترقي",
    pillar_growth_desc: "پنهنجي شهر ۾ مضبوط تعلقات قائم ڪريو. پنهنجو پورٽ فوليو بهتر ڪريو، تعريفي بيجز حاصل ڪريو ۽ ٻين کي سيکارڻ دوران پاڻ سڪو.",
    women_zone_safe_space_for: "هڪ محفوظ جاءِ برائي ",
  }
};

function HomePage({ onChatbotToggle }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  useScrollReveal();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [user, setUser] = useState(null);

  // --- Dynamic hours saved ticker ---
  const [hoursSaved, setHoursSaved] = useState(45182.4);

  // --- FAQ Accordion State ---
  const [activeFaqId, setActiveFaqId] = useState(null);

  useEffect(() => {
    const hoursInterval = setInterval(() => {
      setHoursSaved((prev) => prev + 0.02);
    }, 2000);
    return () => clearInterval(hoursInterval);
  }, []);

  const activeLang = i18n?.language || 'en';
  const lh = localHomeTranslations[activeLang] || localHomeTranslations['en'];

  // --- Live Swap Stream Ticker State ---
  const [activeSwapIndex, setActiveSwapIndex] = useState(0);
  const [swapFade, setSwapFade] = useState(true);

  const simulatedSwaps = [
    { from: "Ahmad from Lahore", gave: "Python Scripting", to: "Zainab", received: "UI/UX Design", time: "2 mins ago" },
    { from: "Sana from Karachi", gave: "English Speaking", to: "Ali", received: "Excel Automation", time: "5 mins ago" },
    { from: "Bilal from Islamabad", gave: "Graphic Design", to: "Hamza", received: "Video Editing", time: "12 mins ago" },
    { from: "Ayesha from Peshawar", gave: "Social Media Marketing", to: "Mariam", received: "Urdu Content Writing", time: "18 mins ago" },
    { from: "Raza from Quetta", gave: "Web Development", to: "Fahad", received: "SEO Auditing", time: "25 mins ago" }
  ];

  useEffect(() => {
    const swapInterval = setInterval(() => {
      setSwapFade(false);
      setTimeout(() => {
        setActiveSwapIndex((prev) => (prev + 1) % simulatedSwaps.length);
        setSwapFade(true);
      }, 400); 
    }, 4500);
    return () => clearInterval(swapInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 1. Hero Dynamic Text State (Fade Up/Down Effect) ---
  const heroWords = lh.hero_words || ["Futures", "Community", "Trust", "Careers"];
  const womenWords = lh.women_words || ["Women", "Sisters", "Growth", "Empowerment"];

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFadeClass, setHeroFadeClass] = useState('hero-fade-in');

  useEffect(() => {
    setHeroIndex(0);
    setWomenIndex(0);
  }, [activeLang]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Trigger Fade Out (Move Up and vanish)
      setHeroFadeClass('hero-fade-out'); 
      
      setTimeout(() => {
        // 2. Change the word
        setHeroIndex((prev) => (prev + 1) % heroWords.length);
        // 3. Trigger Fade In (Move from bottom to center)
        setHeroFadeClass('hero-fade-in');
      }, 500); // Wait 0.5s for the fade out to finish
      
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [heroWords.length]);

  // --- 2. Women's Zone Dynamic Text State (Fade Effect) ---
  const [womenIndex, setWomenIndex] = useState(0);
  const [womenFade, setWomenFade] = useState('fade-in');

  useEffect(() => {
    const timeout = setTimeout(() => {
        const interval = setInterval(() => {
            setWomenFade('fade-out');
            setTimeout(() => {
                setWomenIndex((prev) => (prev + 1) % womenWords.length);
                setWomenFade('fade-in');
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 3. Testimonials Carousel State (3 at a time) ---
  const [testimonialStartIndex, setTestimonialStartIndex] = useState(0);
  const testimonials = [
    { id: 1, quote: "Gadd Kaam changed my life. I learned to code by teaching English!", name: "Ali Khan", details: "Web Developer • Karachi", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, quote: "The Women's Zone is a blessing. I feel so safe trading cooking skills.", name: "Fatima Bibi", details: "Home Chef • Lahore", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, quote: "I found a plumber within minutes who needed help with his CV.", name: "Hamza Raza", details: "Teacher • Islamabad", img: "https://randomuser.me/api/portraits/men/86.jpg" },
    { id: 4, quote: "Finally, a platform that values skills over money. Highly recommended!", name: "Sara Ahmed", details: "Graphic Designer • Multan", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: 5, quote: "I swapped my gardening skills for guitar lessons. Amazing experience!", name: "Bilal Sheikh", details: "Musician • Peshawar", img: "https://randomuser.me/api/portraits/men/41.jpg" },
    { id: 6, quote: "Great initiative for students to learn new skills without cost.", name: "Zainab Ali", details: "Student • Quetta", img: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 7, quote: "Repaired my AC in exchange for social media management. Win-win!", name: "Usman Ghani", details: "Digital Marketer • Faisalabad", img: "https://randomuser.me/api/portraits/men/11.jpg" },
    { id: 8, quote: "I taught basic accounting and got my wedding dress stitched perfectly.", name: "Hina Altaf", details: "Accountant • Sialkot", img: "https://randomuser.me/api/portraits/women/12.jpg" },
    { id: 9, quote: "Found a great mentor for Python programming here.", name: "Zain Malik", details: "Student • Hyderabad", img: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 10, quote: "Swapped homemade biryani for math tutoring for my son.", name: "Nida Yasir", details: "Housewife • Gujranwala", img: "https://randomuser.me/api/portraits/women/25.jpg" },
    { id: 11, quote: "Helped a neighbor move house, and he fixed my laptop. Simple and effective.", name: "Fahad Mustafa", details: "IT Support • Karachi", img: "https://randomuser.me/api/portraits/men/36.jpg" },
    { id: 12, quote: "Learned calligraphy in exchange for teaching yoga.", name: "Mahira Khan", details: "Yoga Instructor • Lahore", img: "https://randomuser.me/api/portraits/women/55.jpg" },
    { id: 13, quote: "Got my car tuned up by offering legal advice on a contract.", name: "Barrister Aamir", details: "Lawyer • Islamabad", img: "https://randomuser.me/api/portraits/men/58.jpg" },
    { id: 14, quote: "Fantastic community! I traded photography for SEO services.", name: "Saba Qamar", details: "Photographer • Rawalpindi", img: "https://randomuser.me/api/portraits/women/60.jpg" },
    { id: 15, quote: "Best way to save money while getting professional services.", name: "Irfan Pathan", details: "Shopkeeper • Sargodha", img: "https://randomuser.me/api/portraits/men/61.jpg" },
    { id: 16, quote: "I offered content writing and got a logo designed for my startup.", name: "Sana Javed", details: "Entrepreneur • Bahawalpur", img: "https://randomuser.me/api/portraits/women/62.jpg" },
    { id: 17, quote: "Fixed a washing machine and got free haircuts for a month!", name: "Nasir Hussain", details: "Technician • Sukkur", img: "https://randomuser.me/api/portraits/men/73.jpg" },
    { id: 18, quote: "Trading skills builds such a strong sense of community.", name: "Maria B", details: "Fashion Designer • Lahore", img: "https://randomuser.me/api/portraits/women/75.jpg" },
    { id: 19, quote: "Learned how to bake cakes by teaching Quran recitation.", name: "Hafiz Abdullah", details: "Tutor • Multan", img: "https://randomuser.me/api/portraits/men/78.jpg" },
    { id: 20, quote: "Safe, secure, and very easy to use. Love the women-only zone.", name: "Ayesha Omar", details: "Artist • Karachi", img: "https://randomuser.me/api/portraits/women/79.jpg" },
    { id: 21, quote: "I got my resume revamped in exchange for fitness training sessions.", name: "Shoaib Akhtar", details: "Gym Trainer • Islamabad", img: "https://randomuser.me/api/portraits/men/82.jpg" },
    { id: 22, quote: "Swapped my painting skills for driving lessons. Highly recommend!", name: "Hania Aamir", details: "Student • Peshawar", img: "https://randomuser.me/api/portraits/women/83.jpg" },
    { id: 23, quote: "A lifesaver for freelancers looking to network and trade.", name: "Basit Ali", details: "Freelancer • Quetta", img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 24, quote: "Got my thesis proofread in exchange for homemade pickles.", name: "Parveen Shakir", details: "Researcher • Jamshoro", img: "https://randomuser.me/api/portraits/women/88.jpg" },
    { id: 25, quote: "Taught video editing and learned how to play the flute.", name: "Danish Taimoor", details: "Video Editor • Lahore", img: "https://randomuser.me/api/portraits/men/90.jpg" },
    { id: 26, quote: "The verification process gives me peace of mind.", name: "Kubra Khan", details: "Architect • Karachi", img: "https://randomuser.me/api/portraits/women/91.jpg" },
    { id: 27, quote: "Helped with interior design and got my taxes filed.", name: "Imran Abbas", details: "Interior Designer • Islamabad", img: "https://randomuser.me/api/portraits/men/92.jpg" },
    { id: 28, quote: "Great platform for finding local help without spending cash.", name: "Yumna Zaidi", details: "Teacher • Faisalabad", img: "https://randomuser.me/api/portraits/women/93.jpg" },
    { id: 29, quote: "I traded electrician work for a professional portrait shoot.", name: "Asif Raza", details: "Electrician • Sialkot", img: "https://randomuser.me/api/portraits/men/94.jpg" },
    { id: 30, quote: "Learned MS Excel by offering conversational Urdu practice.", name: "Maya Ali", details: "Admin Assistant • Gujrat", img: "https://randomuser.me/api/portraits/women/95.jpg" },
    { id: 31, quote: "Swapped carpentry work for a customized diet plan.", name: "Junaid Khan", details: "Carpenter • Mardan", img: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 32, quote: "Got my bike fixed in exchange for biology tutoring.", name: "Kinza Hashmi", details: "Student • Larkana", img: "https://randomuser.me/api/portraits/women/6.jpg" },
    { id: 33, quote: "This app is revolutionary for the Pakistani gig economy.", name: "Feroze Khan", details: "Blogger • Karachi", img: "https://randomuser.me/api/portraits/men/7.jpg" },
    { id: 34, quote: "I learned pottery while teaching someone how to use Photoshop.", name: "Sajal Aly", details: "Graphic Designer • Lahore", img: "https://randomuser.me/api/portraits/women/8.jpg" },
    { id: 35, quote: "Traded plumbing services for a website for my small business.", name: "Rashid Minhas", details: "Plumber • Rawalpindi", img: "https://randomuser.me/api/portraits/men/9.jpg" },
    { id: 36, quote: "Got urgent medical advice in exchange for car detailing.", name: "Dr. Shaista", details: "General Physician • Multan", img: "https://randomuser.me/api/portraits/women/10.jpg" },
    { id: 37, quote: "Helped a student with physics and got my garden landscaped.", name: "Sir Javed", details: "Professor • Abbottabad", img: "https://randomuser.me/api/portraits/men/13.jpg" },
    { id: 38, quote: "Swapped embroidery for mobile app development lessons.", name: "Urwa Hocane", details: "Artist • Karachi", img: "https://randomuser.me/api/portraits/women/14.jpg" },
    { id: 39, quote: "I love the community spirit here. Everyone is so helpful.", name: "Ahsan Khan", details: "Social Worker • Peshawar", img: "https://randomuser.me/api/portraits/men/15.jpg" },
    { id: 40, quote: "Got my generator fixed in exchange for resume writing.", name: "Mehwish Hayat", details: "HR Manager • Islamabad", img: "https://randomuser.me/api/portraits/women/16.jpg" },
    { id: 41, quote: "Taught guitar and learned how to ride a bike.", name: "Sheheryar Munawar", details: "Musician • Lahore", img: "https://randomuser.me/api/portraits/men/17.jpg" },
    { id: 42, quote: "A wonderful way to utilize my free time productively.", name: "Ramsha Khan", details: "Student • Hyderabad", img: "https://randomuser.me/api/portraits/women/18.jpg" },
    { id: 43, quote: "Swapped data entry work for a month of lunch deliveries.", name: "Muneeb Butt", details: "Clerk • Karachi", img: "https://randomuser.me/api/portraits/men/19.jpg" },
    { id: 44, quote: "Learned embroidery and taught basic computer skills.", name: "Iqra Aziz", details: "Teacher • Faisalabad", img: "https://randomuser.me/api/portraits/women/20.jpg" },
    { id: 45, quote: "Fixed a leaking roof in exchange for wedding photography.", name: "Yasir Hussain", details: "Contractor • Lahore", img: "https://randomuser.me/api/portraits/men/21.jpg" },
    { id: 46, quote: "Got my thesis bound and printed in exchange for coding help.", name: "Sarah Khan", details: "Student • Islamabad", img: "https://randomuser.me/api/portraits/women/23.jpg" },
    { id: 47, quote: "Traded legal drafting for a customized wooden table.", name: "Nauman Ijaz", details: "Lawyer • Sialkot", img: "https://randomuser.me/api/portraits/men/24.jpg" },
    { id: 48, quote: "Swapped makeup services for a professional headshot.", name: "Ayeza Khan", details: "Beautician • Karachi", img: "https://randomuser.me/api/portraits/women/26.jpg" },
    { id: 49, quote: "Taught cricket skills and got help with my biology assignment.", name: "Babar Azam", details: "Cricketer • Lahore", img: "https://randomuser.me/api/portraits/men/27.jpg" },
    { id: 50, quote: "Amazing platform! Swapped baking for henna application.", name: "Mawra Hocane", details: "Baker • Rawalpindi", img: "https://randomuser.me/api/portraits/women/28.jpg" },
    // --- SINDHI REVIEWS (51-100) - Humorous & Cultural ---
    { id: 51, quote: "سائين، مون هن کي انگريزي سيکاري، هن مون کي مڇي ڦرائي کارائي. هاڻي انگريزي ته اچي وئي پر مڇيءَ جو ڪنڊو نڙيءَ ۾ اٽڪي پيو آهي!", name: "Sain Bux", details: "Fisherman • Thatta", img: "https://randomuser.me/api/portraits/men/51.jpg" },
    { id: 52, quote: "يار! ڇا ته ڊيل هئي! مون هن جي مينهن ڌوئي، هن منهنجي موٽرسائيڪل ڌوئي. هاڻي مينهن چمڪي پئي ۽ موٽرسائيڪل تي مٽي آهي.", name: "Qurban Ali", details: "Farmer • Larkana", img: "https://randomuser.me/api/portraits/men/52.jpg" },
    { id: 53, quote: "مون هن کي رلهي سبڻ سيکاريو، هن مون کي ٽڪ ٽاڪ تي وائرل ڪيو. هاڻي سڄو ڳوٺ مون کي 'رلهي اسٽار' سڏي ٿو!", name: "Mai Janki", details: "Artisan • Tharparkar", img: "https://randomuser.me/api/portraits/women/53.jpg" },
    { id: 54, quote: "سائين ڇا ٻڌايان! مون هن جي ٽريڪٽر جو ٽائر مٽايو، هن مون کي هڪ ديڳ برياني ڏني. ٽائر ته هليو پر بريانيءَ مان ڦوٽو نڪتو.", name: "Darya Khan", details: "Mechanic • Dadu", img: "https://randomuser.me/api/portraits/men/54.jpg" },
    { id: 55, quote: "هن منهنجي شاديءَ جي ويڊيو ٺاهي، مون هن کي ٻڪري ڏني. هاڻي ٻڪري ويڊيو ۾ به اچي وئي آهي، اسٽار بڻجي وئي آهي.", name: "Punhal", details: "Videographer • Sukkur", img: "https://randomuser.me/api/portraits/men/55.jpg" },
    { id: 56, quote: "مون هن کي سنڌي ٽوپي ٺاهي ڏني، هن منهنجي موبائل ۾ پب جي (PUBG) انسٽال ڪئي. هاڻي ڪم گهٽ ۽ راند گهڻي پيو ڪريان.", name: "Shaman Ali", details: "Tailor • Hala", img: "https://randomuser.me/api/portraits/men/56.jpg" },
    { id: 57, quote: "ادي! مون هن جي گهر جي صفائي ڪئي، هن مون کي بيوٽي پارلر جو ڪورس ڪرايو. هاڻي آئون ٻهارو ڏيندي به ميڪ اپ ۾ هوندي آهيان.", name: "Mai Bakhtawar", details: "Cleaner • Nawabshah", img: "https://randomuser.me/api/portraits/women/57.jpg" },
    { id: 58, quote: "مون هن جي گڏهه گاڏي ٺيڪ ڪئي، هن مون کي مفت ۾ شهر جو چڪر لڳرايو. مزو اچي ويو، پر گڏهه ٿڪجي پيو.", name: "Mitho", details: "Carpenter • Shikarpur", img: "https://randomuser.me/api/portraits/men/58.jpg" },
    { id: 59, quote: "سائين، مون هن کي سنڌي سيکاري، هن مون کي پيزا کارايو. هاڻي هو 'سائين' ته چوي ٿو پر پيزا ۾ مرچ گهڻا هئا.", name: "Ustād Roshan", details: "Teacher • Hyderabad", img: "https://randomuser.me/api/portraits/men/59.jpg" },
    { id: 60, quote: "مون هن جو جنريٽر هلايو، هن منهنجي يوٽيوب چينل کي سبسڪرائيب ڪيو. بجلي ته وئي پر سبسڪرائبر وڌي ويا!", name: "Jamal", details: "Electrician • Jacobabad", img: "https://randomuser.me/api/portraits/men/60.jpg" },
    { id: 61, quote: "ادي! هن منهنجا ڪپڙا سبيا، مون هن کي رڌڻي ۾ چانهه ٺاهڻ سيکاريو. هاڻي هوءَ سڄو ڏينهن چانهه پيئي ٿي ۽ ڪپڙا سڀاڻي سبندي.", name: "Zuhra", details: "Housewife • Sanghar", img: "https://randomuser.me/api/portraits/women/61.jpg" },
    { id: 62, quote: "مون هن کي ڪمپيوٽر هلائڻ سيکاريو، هن مون کي مينهن جو کير ڏنو. هاڻي منهنجو ڪمپيوٽر فاسٽ آهي ۽ مان ٿلهو ٿي ويو آهيان.", name: "Saeed", details: "IT Student • Jamshoro", img: "https://randomuser.me/api/portraits/men/62.jpg" },
    { id: 63, quote: "سائين، ڇا ڳالهه ڪجي! مون هن جي زمين کي پاڻي ڏنو، هن منهنجي شاديءَ جو ڪارڊ مفت ۾ ڇپايو. هاڻي رڳو گهوٽ جي کوٽ آهي.", name: "Waderô Khamiso", details: "Landlord • Ghotki", img: "https://randomuser.me/api/portraits/men/63.jpg" },
    { id: 64, quote: "مون هن جي ڪار ڌوئي، هن مون کي برگر کارايو. ڪار وري ميرا ٿي وئي پر برگر جو سواد اڃا ياد آهي.", name: "Chotu", details: "Helper • Karachi", img: "https://randomuser.me/api/portraits/men/64.jpg" },
    { id: 65, quote: "ادي! مون هن کي مهندي لڳائي، هن منهنجي انسٽاگرام تي فوٽو رکي. هاڻي سڄي دنيا منهنجي ڊيزائن ڏسي رهي آهي.", name: "Sassi", details: "Artist • Malir", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 66, quote: "مون هن جي دڪان جو حساب ڪيو، هن مون کي نيون چپل ڏنيون. هاڻي حساب پورو آهي ۽ پير آرام ۾ آهن.", name: "Munshi Ghafoor", details: "Accountant • Kashmore", img: "https://randomuser.me/api/portraits/men/66.jpg" },
    { id: 67, quote: "سائين، مون هن کي شاعري ٻڌائي، هن منهنجي ڏندن جو علاج ڪيو. هاڻي مان کلندي به شعر چوندو آهيان.", name: "Shahid Faqeer", details: "Poet • Bhit Shah", img: "https://randomuser.me/api/portraits/men/67.jpg" },
    { id: 68, quote: "مون هن جي ٻارن کي رياضي پڙهائي، هن مون کي ڳوٺ جي خالص گيهه جو دٻو ڏنو. هاڻي دماغ ۽ جسم ٻئي مضبوط آهن.", name: "Master Dino", details: "Tutor • Badin", img: "https://randomuser.me/api/portraits/men/68.jpg" },
    { id: 69, quote: "ادي! مون هن کي ڪڪڙ جو ٻچو ڏنو، هن منهنجي موبائل جو لاڪ کوليو. هاڻي ڪڪڙ وڏي ٿي وئي آهي ۽ موبائل وري لاڪ ٿي ويو آهي.", name: "Nooran", details: "Villager • Thul", img: "https://randomuser.me/api/portraits/women/69.jpg" },
    { id: 70, quote: "مون هن جي سولر پليٽ صاف ڪئي، هن مون کي ٿڌو پاڻي پياريو. سج ڏاڍو هو، پر پاڻي امرت لڳو.", name: "Jameel", details: "Worker • Umerkot", img: "https://randomuser.me/api/portraits/men/70.jpg" },
    { id: 71, quote: "سائين، مون هن جي ڀت ٺاهي، هن مون کي پراڻو ريڊيو ڏنو. هاڻي مان ڪم ڪندي گانا ٻڌندو آهيان، پر رڳو خبرون هلنديون آهن.", name: "Mistri Soomar", details: "Mason • Tando Adam", img: "https://randomuser.me/api/portraits/men/71.jpg" },
    { id: 72, quote: "مون هن کي سنڌي اجرڪ ڏني، هن مون کي فوٽوشاپ سيکاريو. هاڻي مان پنهنجي تصوير ۾ به اجرڪ پائي وهندو آهيان.", name: "Ali Gul", details: "Designer • Moro", img: "https://randomuser.me/api/portraits/men/72.jpg" },
    { id: 73, quote: "ادي! مون هن جي وارن ۾ تيل لڳايو، هن منهنجي فيس بڪ آئي ڊي ٺاهي. هاڻي تيل گهٽ ۽ لائڪس وڌيڪ آهن.", name: "Mai Hawa", details: "Hairdresser • Kotri", img: "https://randomuser.me/api/portraits/women/73.jpg" },
    { id: 74, quote: "مون هن جي موٽر سائيڪل جي پنچر ٺاهي، هن مون کي چانهه جو ڪوپ پياريو. پنچر وري ٿي پيو پر چانهه زبردست هئي.", name: "Pahore", details: "Mechanic • Ranipur", img: "https://randomuser.me/api/portraits/men/74.jpg" },
    { id: 75, quote: "سائين، مون هن کي قرآن پڙهايو، هن منهنجي لاءِ دعا ڪئي. دعا قبول ٿي وئي، هاڻي مان به پرديس وڃي رهيو آهيان.", name: "Hafiz Kareem", details: "Cleric • Sehwan", img: "https://randomuser.me/api/portraits/men/75.jpg" },
    { id: 76, quote: "مون هن جي گهر جي رنگ روغن ڪئي، هن مون کي پراڻو ليپ ٽاپ ڏنو. رنگ ته لهي ويو پر ليپ ٽاپ اڃا هلي پيو.", name: "Rangrezo", details: "Painter • Mirpurkhas", img: "https://randomuser.me/api/portraits/men/76.jpg" },
    { id: 77, quote: "ادي! مون هن کي آچار ٺاهڻ سيکاريو، هن مون کي ڊرائيونگ سيکاري. هاڻي مان گاڏي هلائيندي آچار کائيندي آهيان.", name: "Zainab", details: "Driver • Khairpur", img: "https://randomuser.me/api/portraits/women/77.jpg" },
    { id: 78, quote: "مون هن جي ٻڪري ڳولي ڏني، هن مون کي 5 ڪلو انب ڏنا. ٻڪري وري گم ٿي وئي پر انب کٽي ويا.", name: "Gulsher", details: "Tracker • Naushahro Feroze", img: "https://randomuser.me/api/portraits/men/78.jpg" },
    { id: 79, quote: "سائين، مون هن کي مڇي ڦرائڻ سيکاري، هن مون کي يوٽيوب تي چينل ٺاهي ڏنو. هاڻي مان 'مڇي ماسٽر' آهيان.", name: "Darya Khan Jr.", details: "Vlogger • Sukkur", img: "https://randomuser.me/api/portraits/men/79.jpg" },
    { id: 80, quote: "مون هن جي شاديءَ تي ڊانس ڪئي، هن مون کي نوان ڪپڙا ڏنا. ڪپڙا ڦاٽي ويا پر ڊانس اڃا وائرل آهي.", name: "Shoki", details: "Dancer • Lyari", img: "https://randomuser.me/api/portraits/men/80.jpg" },
    { id: 81, quote: "ادي! مون هن جي ڌيءَ کي مينڊي لڳائي، هن مون کي پارلر جو سامان ڏنو. هاڻي آئون گهر ۾ پارلر هلائيندي آهيان.", name: "Kainat", details: "Beautician • Ratodero", img: "https://randomuser.me/api/portraits/women/81.jpg" },
    { id: 82, quote: "مون هن جي گهر جو تالو ٽوڙيو (چاٻي گم هئي)، هن مون کي چاٻين جو ڇلو ڏنو. عجيب ماڻهو آهي سائين.", name: "Javed Locksmith", details: "Worker • Jacobabad", img: "https://randomuser.me/api/portraits/men/82.jpg" },
    { id: 83, quote: "سائين، مون هن کي سنڌي رلهي ڏني، هن مون کي انگريزي اخبار ڏني. رلهي گرم آهي، اخبار ۾ صرف تصويرون ڏسندو آهيان.", name: "Bora", details: "Vendor • Shahdadkot", img: "https://randomuser.me/api/portraits/men/83.jpg" },
    { id: 84, quote: "مون هن جي مينهن جو کير ڪڍيو، هن مون کي لسي پياري. کير هن جو، لسي منهنجي، انصاف آهي سائين.", name: "Raheem", details: "Milkman • Tando Allahyar", img: "https://randomuser.me/api/portraits/men/84.jpg" },
    { id: 85, quote: "ادي! مون هن جي گهر جي ڊيڪوريشن ڪئي، هن منهنجي لاءِ برياني ٺاهي. بريانيءَ ۾ ٻوٽيون گهٽ هيون پر ڪم هلي ويو.", name: "Sanam", details: "Decorator • Karachi", img: "https://randomuser.me/api/portraits/women/85.jpg" },
    { id: 86, quote: "مون هن جي ٽريڪٽر جو ٽائر پنچر لڳايو، هن مون کي گانن جي ڪيسٽ ڏني. ٽيپ رڪارڊر ناهي پر ڪيسٽ سنڀالي رکي آهي.", name: "Gada Hussain", details: "Mechanic • Mithi", img: "https://randomuser.me/api/portraits/men/86.jpg" },
    { id: 87, quote: "سائين، مون هن کي سنڌي ٽوپي پارائي، هن مون کي سيلفي اسٽڪ ڏني. هاڻي هر ڪو ٽوپي پائي سيلفي ڪڍي ٿو.", name: "Nawaz", details: "Shopkeeper • Hyderabad", img: "https://randomuser.me/api/portraits/men/87.jpg" },
    { id: 88, quote: "مون هن جي گهر جو نل ٺيڪ ڪيو، هن مون کي شربت پياريو. نل وري ٽپڪي پيو پر شربت ٿڌو هو.", name: "Plumber Pyaro", details: "Plumber • Sanghar", img: "https://randomuser.me/api/portraits/men/88.jpg" },
    { id: 89, quote: "ادي! مون هن کي سبي ۾ ڪپڙا سبيا، هن مون کي پراڻي سلائي مشين ڏني. هاڻي مشين خراب آهي پر ڪپڙا سٺا سبيا هئا.", name: "Hameeda", details: "Seamstress • Khairpur", img: "https://randomuser.me/api/portraits/women/89.jpg" },
    { id: 90, quote: "مون هن جي گڏهه کي گاهه وڌو، هن مون کي موٽرسائيڪل تي لفٽ ڏني. گڏهه خوش، مان خوش، موٽرسائيڪل روئيندي رهي.", name: "Sultan", details: "Laborer • Ghotki", img: "https://randomuser.me/api/portraits/men/90.jpg" },
    { id: 91, quote: "سائين، مون هن کي سنڌي اخبار پڙهڻ سيکاري، هن مون کي عينڪ ڏني. هاڻي مان به اخبار پڙهي سگهان ٿو.", name: "Chacha Feemo", details: "Elder • Thatta", img: "https://randomuser.me/api/portraits/men/91.jpg" },
    { id: 92, quote: "مون هن جي گهر جي بجلي ٺيڪ ڪئي، هن مون کي پراڻو پکو ڏنو. پکو هلي ٿو پر هوا گهٽ ڏئي ٿو.", name: "Electrician Eido", details: "Electrician • Badin", img: "https://randomuser.me/api/portraits/men/92.jpg" },
    { id: 93, quote: "ادي! مون هن جي ٻارن کي سنڀاليو، هن مون کي ڊرامي جي قسط ڏيکاري. ٻار روئيندا رهيا، پر ڊرامو سٺو هو.", name: "Mai Sabhai", details: "Babysitter • Larkana", img: "https://randomuser.me/api/portraits/women/93.jpg" },
    { id: 94, quote: "مون هن جي ڪمپيوٽر ۾ ونڊوز ڪئي، هن مون کي ٿڌي بوتل پياري. ونڊوز ڪرپٽ ٿي وئي پر بوتل ٿڌي هئي.", name: "Computer Wala", details: "Tech • Sukkur", img: "https://randomuser.me/api/portraits/men/94.jpg" },
    { id: 95, quote: "سائين، مون هن کي مڇي مارڻ سيکاريو، هن مون کي ڄار ڏنو. هاڻي هو مڇي ماري ٿو ۽ مان ڄار ٺيڪ ڪريان ٿو.", name: "Mallah", details: "Fisherman • Manchar Lake", img: "https://randomuser.me/api/portraits/men/95.jpg" },
    { id: 96, quote: "مون هن جي گهر رنگ ڪيو، هن مون کي پراڻي قميص ڏني. رنگ قميص تي لڳي ويو، هاڻي اها ڊيزائنر شرٽ آهي.", name: "Rangoo", details: "Painter • Dadu", img: "https://randomuser.me/api/portraits/men/96.jpg" },
    { id: 97, quote: "ادي! مون هن کي ماني پچائڻ سيکاريو، هن مون کي ميڪ اپ کٽ ڏني. ماني سڙي وئي پر مان خوبصورت لڳان پئي.", name: "Reshma", details: "Cook • Hyderabad", img: "https://randomuser.me/api/portraits/women/97.jpg" },
    { id: 98, quote: "مون هن جي ٽريڪٽر هلائي، هن مون کي ڊيزل ڏنو. ٽريڪٽر هليو نه، پر ڊيزل منهنجي جنريٽر ۾ ڪم آيو.", name: "Driver Dildar", details: "Driver • Nawabshah", img: "https://randomuser.me/api/portraits/men/98.jpg" },
    { id: 99, quote: "سائين، مون هن کي شاعري ٻڌائي، هن مون کي واهه واهه ڪيو. واهه واهه سان پيٽ نه ڀرجندو آهي سائين!", name: "Bhagye", details: "Poet • Sanghar", img: "https://randomuser.me/api/portraits/men/99.jpg" },
    { id: 100, quote: "مون هن جي دڪان جي صفائي ڪئي، هن مون کي بسڪيٽ ڏنو. بسڪيٽ ٽٽل هو پر مزيدار هو.", name: "Safaai Wala", details: "Sweeper • Karachi", img: "https://randomuser.me/api/portraits/men/100.jpg" },

    // --- URDU REVIEWS (101-150) - Humorous & Desi ---
    { id: 101, quote: "میں نے ان کا پنکھا ٹھیک کیا، بدلے میں انہوں نے مجھے بریانی کھلائی۔ الو کے بغیر تھی، دل ٹوٹ گیا لیکن پیٹ بھر گیا۔", name: "Raju Mistri", details: "Electrician • Lahore", img: "https://randomuser.me/api/portraits/men/10.jpg" },
    { id: 102, quote: "ان کو میتھ (Math) پڑھایا، بدلے میں ان کی امی نے رشتے کی بات چلا دی۔ بھائی مجھے فیس چاہیے تھی، شادی نہیں کرنی!", name: "Professor Junaid", details: "Tutor • Karachi", img: "https://randomuser.me/api/portraits/men/12.jpg" },
    { id: 103, quote: "میں نے ان کی گاڑی دھکا لگا کر اسٹارٹ کی، انہوں نے مجھے پانی کی بوتل دی۔ گاڑی پھر بند ہو گئی، لیکن پانی ٹھنڈا تھا۔", name: "Chacha Bashir", details: "Helper • Rawalpindi", img: "https://randomuser.me/api/portraits/men/14.jpg" },
    { id: 104, quote: "ویب سائٹ بنا کر دی، بدلے میں انہوں نے مجھے 5 کلو آم بھیجے۔ اب میں کوڈنگ چھوڑ کر آم کا ٹھیلا لگانے کا سوچ رہا ہوں۔", name: "Saad Techie", details: "Developer • Multan", img: "https://randomuser.me/api/portraits/men/16.jpg" },
    { id: 105, quote: "ان کے لیے لوگو ڈیزائن کیا، انہوں نے مجھے مفت ہیئر کٹ دیا۔ اب میں ہیرو لگ رہا ہوں اور وہ فوٹوشاپ سیکھ رہے ہیں۔", name: "Stylish Sameer", details: "Designer • Faisalabad", img: "https://randomuser.me/api/portraits/men/18.jpg" },
    { id: 106, quote: "باجی کو ڈرائیونگ سکھائی، بدلے میں انہوں نے میری امی کو سوٹ گفٹ کیا۔ اب امی خوش ہیں، میں پیدل ہوں۔", name: "Driver Aslam", details: "Driver • Islamabad", img: "https://randomuser.me/api/portraits/men/20.jpg" },
    { id: 107, quote: "ان کا لیپ ٹاپ ٹھیک کیا، انہوں نے مجھے پرانی کتابیں دیں۔ اب میں لیپ ٹاپ تو نہیں چلا سکتا، لیکن شاعر ضرور بن گیا ہوں۔", name: "Poet Kashif", details: "IT Guy • Quetta", img: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 108, quote: "میں نے ان کے گھر کی پلمبنگ کی، انہوں نے مجھے چائے پلائی۔ چائے میں چینی کم تھی، لیکج پھر شروع ہو گئی۔", name: "Plumber Pappu", details: "Plumber • Gujranwala", img: "https://randomuser.me/api/portraits/men/24.jpg" },
    { id: 109, quote: "ان کی بلی ڈھونڈ کر دی، انہوں نے مجھے شکریہ کا کارڈ دیا۔ شکریہ سے پیٹ نہیں بھرتا باجی!", name: "Detective Daniyal", details: "Freelancer • Peshawar", img: "https://randomuser.me/api/portraits/men/26.jpg" },
    { id: 110, quote: "ان کو جم ٹریننگ دی، انہوں نے مجھے پیزا کھلایا۔ ساری محنت ضائع ہو گئی!", name: "Gym Rat Ali", details: "Trainer • Sialkot", img: "https://randomuser.me/api/portraits/men/28.jpg" },
    { id: 111, quote: "ان کے گارڈن کی صفائی کی، انہوں نے مجھے ایلوویرا کا پودا دیا۔ اب میں گنجا ہو رہا ہوں لیکن پودا ہرا بھرا ہے۔", name: "Mali Baba", details: "Gardener • Bahawalpur", img: "https://randomuser.me/api/portraits/men/30.jpg" },
    { id: 112, quote: "میں نے ان کو انگریزی سکھائی، انہوں نے مجھے پنجابی گالیاں سکھا دیں۔ کلچر کا تبادلہ ہو گیا۔", name: "Sir Michael", details: "Teacher • Murree", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 113, quote: "ان کا اے سی صاف کیا، انہوں نے مجھے پرانا اخبار دیا۔ اب میں گرمی میں خبریں پڑھتا ہوں۔", name: "Cooling Master", details: "Technician • Sukkur", img: "https://randomuser.me/api/portraits/men/34.jpg" },
    { id: 114, quote: "ان کی اسائنمنٹ لکھی، انہوں نے مجھے سموسے کھلائے۔ سموسے ٹھنڈے تھے، اسائنمنٹ میں فیل ہو گئے۔", name: "Student Zaid", details: "Student • Jamshoro", img: "https://randomuser.me/api/portraits/men/36.jpg" },
    { id: 115, quote: "میں نے ان کا وائی فائی ٹھیک کیا، انہوں نے مجھے نیٹ فلکس کا پاس ورڈ دیا۔ پاس ورڈ غلط تھا!", name: "Hacker Harry", details: "IT Support • Karachi", img: "https://randomuser.me/api/portraits/men/38.jpg" },
    { id: 116, quote: "ان کے گھر کی دیوار پینٹ کی، انہوں نے مجھے پرانی قمیض دی۔ اب میں پینٹ والی قمیض پہن کر گھومتا ہوں۔", name: "Painter Pyaara", details: "Painter • Lahore", img: "https://randomuser.me/api/portraits/men/40.jpg" },
    { id: 117, quote: "ان کو یوگا سکھایا، انہوں نے مجھے نہاری کھلائی۔ اب یوگا نہیں ہوتا، صرف نیند آتی ہے۔", name: "Yoga Yogi", details: "Instructor • Islamabad", img: "https://randomuser.me/api/portraits/men/42.jpg" },
    { id: 118, quote: "ان کی کار دھوئی، انہوں نے مجھے لفٹ دی۔ لفٹ آدھے راستے تک تھی، باقی پیدل آیا۔", name: "Chota Don", details: "Washer • Rawalpindi", img: "https://randomuser.me/api/portraits/men/44.jpg" },
    { id: 119, quote: "میں نے ان کو گٹار بجانا سکھایا، انہوں نے مجھے بانسری دی۔ اب محلے والے مجھے بھگاتے ہیں۔", name: "Musician Moiz", details: "Artist • Hyderabad", img: "https://randomuser.me/api/portraits/men/46.jpg" },
    { id: 120, quote: "ان کے لیے بلاگ لکھا، انہوں نے مجھے 'لائیک' دیا۔ لائیک سے گھر نہیں چلتا بھائی!", name: "Writer Wahid", details: "Content Creator • Multan", img: "https://randomuser.me/api/portraits/men/48.jpg" },
    { id: 121, quote: "ان کا جنریٹر ٹھیک کیا، انہوں نے مجھے موم بتی دی۔ لوڈ شیڈنگ کا بہترین حل!", name: "Electrician Ejaz", details: "Technician • Peshawar", img: "https://randomuser.me/api/portraits/men/50.jpg" },
    { id: 122, quote: "ان کو فوٹوگرافی سکھائی، انہوں نے میری اتنی بری تصویر لی کہ میں نے کیمرہ بیچ دیا۔", name: "Lens Lover", details: "Photographer • Quetta", img: "https://randomuser.me/api/portraits/men/52.jpg" },
    { id: 123, quote: "ان کا فرنیچر شفٹ کرایا، انہوں نے مجھے کرسی دی۔ کرسی کی ٹانگ ٹوٹی ہوئی تھی۔", name: "Mazzoo Bhai", details: "Mover • Karachi", img: "https://randomuser.me/api/portraits/men/54.jpg" },
    { id: 124, quote: "ان کے لیے ایپ بنائی، انہوں نے مجھے دعائیں دیں۔ دعاؤں سے سرور (Server) کا بل نہیں بھرتا۔", name: "App Wala", details: "Developer • Lahore", img: "https://randomuser.me/api/portraits/men/56.jpg" },
    { id: 125, quote: "ان کو کھانا بنانا سکھایا، انہوں نے مجھے جلی ہوئی روٹی کھلائی۔ شاگرد استاد سے آگے نکل گیا۔", name: "Chef Chintu", details: "Cook • Faisalabad", img: "https://randomuser.me/api/portraits/men/58.jpg" },
    { id: 126, quote: "ان کا موبائل ٹھیک کیا، انہوں نے مجھے مس کال دی۔ بیلنس بچانے کا ننجا ٹیکنیک!", name: "Mobile Master", details: "Repairman • Sialkot", img: "https://randomuser.me/api/portraits/men/60.jpg" },
    { id: 127, quote: "ان کے کتے کو ٹریننگ دی، اب کتا صرف مجھے کاٹتا ہے۔", name: "Dog Trainer", details: "Trainer • Islamabad", img: "https://randomuser.me/api/portraits/men/62.jpg" },
    { id: 128, quote: "میں نے ان کو میک اپ کرنا سکھایا، اب وہ مجھے نہیں پہچانتیں۔", name: "Beauty Queen", details: "Beautician • Karachi", img: "https://randomuser.me/api/portraits/women/64.jpg" },
    { id: 129, quote: "ان کے لیے ویڈیو ایڈٹ کی، انہوں نے مجھے پرانا وی سی آر دیا۔ اب کیسٹ کہاں سے لاؤں؟", name: "Editor Ehsan", details: "Video Editor • Lahore", img: "https://randomuser.me/api/portraits/men/66.jpg" },
    { id: 130, quote: "ان کا باغ ٹھیک کیا، انہوں نے مجھے سوکھے پھول دیے۔ محبت کی نشانی یا کچرا؟", name: "Flower Boy", details: "Gardener • Abbottabad", img: "https://randomuser.me/api/portraits/men/68.jpg" },
    { id: 131, quote: "میں نے ان کو کرکٹ سکھائی، پہلی ہی گیند پر انہوں نے میرا شیشہ توڑ دیا۔", name: "Cricketer Kamran", details: "Coach • Karachi", img: "https://randomuser.me/api/portraits/men/70.jpg" },
    { id: 132, quote: "ان کا پانی کا ٹینک صاف کیا، انہوں نے مجھے شربت پلایا۔ شربت اسی ٹینک کے پانی کا تھا۔", name: "Tank Cleaner", details: "Worker • Hyderabad", img: "https://randomuser.me/api/portraits/men/72.jpg" },
    { id: 133, quote: "ان کے بچوں کو پڑھایا، بچوں نے مجھے کارٹون کے نام یاد کرا دیے۔", name: "Tutor Tariq", details: "Teacher • Gujrat", img: "https://randomuser.me/api/portraits/men/74.jpg" },
    { id: 134, quote: "ان کا دروازہ ٹھیک کیا، اب وہ دروازہ میرے لیے نہیں کھولتے۔", name: "Carpenter Qasim", details: "Carpenter • Sargodha", img: "https://randomuser.me/api/portraits/men/76.jpg" },
    { id: 135, quote: "میں نے ان کو سلائی سکھائی، انہوں نے میرا کرتا چھوٹا کر دیا۔", name: "Tailor Tanveer", details: "Tailor • Multan", img: "https://randomuser.me/api/portraits/men/78.jpg" },
    { id: 136, quote: "ان کا کمپیوٹر وائرس نکالا، انہوں نے مجھے زکام لگا دیا۔", name: "Antivirus Ali", details: "IT • Rawalpindi", img: "https://randomuser.me/api/portraits/men/80.jpg" },
    { id: 137, quote: "ان کے لیے کیک بنایا، انہوں نے مجھے خالی پلیٹ واپس کی۔", name: "Baker Bilal", details: "Baker • Lahore", img: "https://randomuser.me/api/portraits/men/82.jpg" },
    { id: 138, quote: "میں نے ان کی شادی کی تصاویر بنائیں، اب وہ طلاق کی تصاویر مانگ رہے ہیں۔", name: "Wedding Photog", details: "Photographer • Karachi", img: "https://randomuser.me/api/portraits/men/84.jpg" },
    { id: 139, quote: "ان کا صوفہ صاف کیا، مجھے اس میں سے 10 روپے ملے۔ ٹپ سمجھ کر رکھ لیے۔", name: "Cleaner Chishti", details: "Cleaner • Peshawar", img: "https://randomuser.me/api/portraits/men/86.jpg" },
    { id: 140, quote: "ان کو تیرنا سکھایا، اب وہ مجھے ڈبونے کی کوشش کر رہے ہیں۔", name: "Swimmer Salman", details: "Instructor • Gwadar", img: "https://randomuser.me/api/portraits/men/88.jpg" },
    { id: 141, quote: "ان کا ٹی وی ٹھیک کیا، اب وہ سارا دن ڈرامے دیکھتے ہیں۔", name: "TV Wala", details: "Repairman • Quetta", img: "https://randomuser.me/api/portraits/men/90.jpg" },
    { id: 142, quote: "ان کے لیے گانا گایا، انہوں نے مجھے چپ رہنے کے پیسے دیے۔", name: "Singer Sohail", details: "Artist • Gilgit", img: "https://randomuser.me/api/portraits/men/92.jpg" },
    { id: 143, quote: "میں نے ان کا ہوم ورک کیا، ٹیچر نے مجھے فیل کر دیا۔", name: "Student Shani", details: "Student • Kashmir", img: "https://randomuser.me/api/portraits/men/94.jpg" },
    { id: 144, quote: "ان کی گھڑی ٹھیک کی، اب وہ ہر وقت ٹائم پوچھتے ہیں۔", name: "Watchman", details: "Repairman • Chitral", img: "https://randomuser.me/api/portraits/men/96.jpg" },
    { id: 145, quote: "ان کے لیے بریانی بنائی، انہوں نے پوچھا 'آلو کہاں ہے؟'۔", name: "Chef Cook", details: "Chef • Karachi", img: "https://randomuser.me/api/portraits/men/98.jpg" },
    { id: 146, quote: "میں نے ان کو پینٹنگ سکھائی، انہوں نے میری دیوار خراب کر دی۔", name: "Artist Ahmed", details: "Painter • Lahore", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 147, quote: "ان کا انٹرنیٹ ٹھیک کیا، اب وہ میرے میسج کا جواب نہیں دیتے۔", name: "Net Boy", details: "IT • Islamabad", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 148, quote: "ان کے جوتے پالش کیے، بارش ہو گئی۔ قسمت ہی خراب ہے۔", name: "Cobbler Kamal", details: "Worker • Peshawar", img: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 149, quote: "ان کو سائیکل چلانا سکھایا، وہ میری سائیکل لے کر بھاگ گئے۔", name: "Cyclist C", details: "Trainer • Multan", img: "https://randomuser.me/api/portraits/men/7.jpg" },
    { id: 150, quote: "میں نے ان کی مدد کی، انہوں نے کہا 'جیتے رہو'۔ دعا سے پیٹ نہیں بھرتا!", name: "Helper Hamza", details: "Volunteer • Sukkur", img: "https://randomuser.me/api/portraits/men/9.jpg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setTestimonialStartIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const visibleTestimonials = [
    testimonials[testimonialStartIndex],
    testimonials[(testimonialStartIndex + 1) % testimonials.length],
    testimonials[(testimonialStartIndex + 2) % testimonials.length],
  ];

  // --- 4. Featured Skills Carousel (4 at a time, rotate every 10s) ---
  const [skillStartIndex, setSkillStartIndex] = useState(0);
  const allSkills = [
    { id: 1, title: "Tractor Repair", user: "Ahmed Khan", rating: 4.8, reviews: 23, imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=1000" },
    { id: 2, title: "Tailoring & Dress Making", user: "Fatima Bibi", rating: 4.9, reviews: 41, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000" },
    { id: 3, title: "Basic Computer Skills", user: "Ali Raza", rating: 4.7, reviews: 15, imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000" },
    { id: 4, title: "Home Cooking Lessons", user: "Ayesha Malik", rating: 5.0, reviews: 30, imageUrl: "https://plus.unsplash.com/premium_photo-1763576573316-77cf1671abcf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 5, title: "Graphic Design", user: "Bilal Ahmed", rating: 4.6, reviews: 12, imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 6, title: "English Tutoring", user: "Sana Mir", rating: 4.9, reviews: 50, imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000" },
    { id: 7, title: "Plumbing Services", user: "Rashid Ali", rating: 4.5, reviews: 8, imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1000" },
    { id: 8, title: "Mobile Repair", user: "Kamran Khan", rating: 4.7, reviews: 19, imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000" },
    { id: 9, title: "Electrician Services", user: "Usman Ghani", rating: 4.8, reviews: 27, imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000" },
    { id: 10, title: "Henna Art (Mehndi)", user: "Hina Altaf", rating: 5.0, reviews: 45, imageUrl: "https://plus.unsplash.com/premium_photo-1661862397518-8e50332b6e97?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 11, title: "Web Development", user: "Zainab Malik", rating: 4.9, reviews: 33, imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" },
    { id: 12, title: "AC Maintenance", user: "Fahad Mustafa", rating: 4.6, reviews: 14, imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000" },
    { id: 13, title: "Event Photography", user: "Hamza Ali", rating: 4.8, reviews: 21, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000" },
    { id: 14, title: "Quran Recitation Tutor", user: "Hafiz Abdullah", rating: 5.0, reviews: 60, imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1000" },
    { id: 15, title: "Hand Embroidery", user: "Parveen Shakir", rating: 4.9, reviews: 38, imageUrl: "https://images.unsplash.com/photo-1568288796918-03e7d93306bd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 16, title: "Mathematics Tutoring", user: "Sir Junaid", rating: 4.7, reviews: 29, imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000" },
    { id: 17, title: "Woodworking & Carpentry", user: "Nasir Hussain", rating: 4.6, reviews: 11, imageUrl: "https://images.unsplash.com/photo-1547609434-b732edfee020?q=80&w=1144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 18, title: "Home Baking", user: "Saba Qamar", rating: 5.0, reviews: 52, imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000" },
    { id: 19, title: "SEO Optimization", user: "Basit Ali", rating: 4.5, reviews: 9, imageUrl: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=1000" },
    { id: 20, title: "Bridal Makeup", user: "Mahira Khan", rating: 4.9, reviews: 40, imageUrl: "https://plus.unsplash.com/premium_photo-1724762178439-1f93ad3f3cb6?q=80&w=1104&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 21, title: "Car Repair & Tuning", user: "Irfan Pathan", rating: 4.7, reviews: 18, imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000" },
    { id: 22, title: "Urdu Calligraphy", user: "Amjad Islam", rating: 4.8, reviews: 16, imageUrl: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=1000" },
    { id: 23, title: "Kitchen Gardening", user: "Nida Yasir", rating: 4.6, reviews: 25, imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1000" },
    { id: 24, title: "Video Editing", user: "Danish Taimoor", rating: 4.7, reviews: 20, imageUrl: "https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 25, title: "Data Entry & Typing", user: "Sana Javed", rating: 4.5, reviews: 13, imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&q=80&w=1000" },
    { id: 26, title: "Personal Fitness Training", user: "Shoaib Akhtar", rating: 4.9, reviews: 35, imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000" },
    { id: 27, title: "Interior Decorating", user: "Maria B", rating: 4.8, reviews: 22, imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" },
    { id: 28, title: "Solar Panel Installation", user: "Imran Abbas", rating: 4.7, reviews: 15, imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1000" },
    { id: 29, title: "Bookkeeping & Tax Help", user: "Asif Raza", rating: 4.6, reviews: 10, imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000" },
    { id: 30, title: "Social Media Marketing", user: "Hania Aamir", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000" },
    { id: 31, title: "Car Washing", user: "Bilal", rating: 4.8, reviews: 31, imageUrl: "https://plus.unsplash.com/premium_photo-1664303228186-a61e7dc91597?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 32, title: "Digital marketing", user: "Ahmad", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 50, title: "Social Media Marketing", user: "Hania Aamir", rating: 4.8, reviews: 31, imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setSkillStartIndex((prev) => (prev + 1) % allSkills.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [allSkills.length]);

  const visibleSkills = [
    allSkills[skillStartIndex],
    allSkills[(skillStartIndex + 1) % allSkills.length],
    allSkills[(skillStartIndex + 2) % allSkills.length],
    allSkills[(skillStartIndex + 3) % allSkills.length],
  ];

  // --- Scroll Reveal Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleOfferSkillClick = () => {
    user ? navigate('/offer-skill') : navigate('/login');
  };

  const handleFindSkillClick = () => {
    navigate('/marketplace');
  };

  const handleWomenZoneClick = () => {
    if (user) {
      if (user.gender === 'Female') {
        navigate('/women-zone');
      } else {
        alert("Access Restricted: This zone is for female users only.");
      }
    } else {
      navigate('/login');
    }
  };

  const howItWorksSteps = [
    { id: 1, titleKey: "step1_title", descriptionKey: "step1_description", icon: <User size={32} /> },
    { id: 2, titleKey: "step2_title", descriptionKey: "step2_description", icon: <Search size={32} /> }, 
    { id: 3, titleKey: "step3_title", descriptionKey: "step3_description", icon: <Star size={32} /> },
  ];

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* --- HERO SECTION --- */}
      <main className="hero-section animated-bg">
        <div className="hero-content">
          <div className="hero-text-wrapper reveal fade-left">
            <div className="hero-badge bounce-in">
              <Zap size={16} fill="currentColor" /> {t('app_name')}
            </div>
            
            <h1 className="hero-headline">
              {t('hero_headline_prefix') || 'Trade Skills, Build'}
              {/* CHANGED: Replaced typewriter class with fade class */}
              <span className={`hero-dynamic-text ${heroFadeClass}`}>
                {heroWords[heroIndex]}
              </span>.
            </h1>
            
            <p className="hero-subtext">{t("hero_subtext")}</p>
            <div className="hero-buttons">
              <button className="btn btn-primary-orange btn-lg hover-pulse" onClick={handleOfferSkillClick}>
                {t("hero_offer_skill_btn")} <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary-outline btn-lg" onClick={handleFindSkillClick}>
                {t("hero_find_skill_btn")}
              </button>
            </div>
          </div>
          
          <div className="hero-visual reveal fade-right">
            <div className="image-stack float-anim">
                <img 
                  src="/Gadd_Kaam.png" 
                  alt="Community" 
                  className="hero-main-image" 
                  fetchpriority="high"
                  onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/500x500?text=Gadd+Kaam"}}
                />
            </div>
            <div className="hero-floating-card card-success float-anim-delayed">
              <CheckCircle size={24} className="icon-success" />
              <div>
                <strong>Skill Swapped!</strong>
                <span className="small-text">Just now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </main>

      {/* PREMIUM VISUAL ELEMENT 2: IMPACT IN NUMBERS STATS COUNTER GRID */}
      <section className="section-container stats-counter-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{lh.impact_title}</h2>
          <p className="section-subtitle">{lh.impact_subtitle}</p>
        </div>
        <div className="stats-counter-grid">
          <div className="stat-card reveal fade-up" style={{transitionDelay: '0ms'}}>
            <div className="stat-icon-wrapper orange-glow pulse-anim">
              <Users size={32} />
            </div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">15,000+</h3>
              <p className="stat-label">{lh.active_swappers}</p>
            </div>
          </div>

          <div className="stat-card reveal fade-up active-saved-card" style={{transitionDelay: '100ms'}}>
            <div className="stat-icon-wrapper green-glow pulse-anim">
              <Clock size={32} />
            </div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number ticker-font">
                {hoursSaved.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </h3>
              <p className="stat-label">{lh.hours_saved}</p>
            </div>
          </div>

          <div className="stat-card reveal fade-up" style={{transitionDelay: '200ms'}}>
            <div className="stat-icon-wrapper purple-glow pulse-anim">
              <Sparkles size={32} />
            </div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">1,200+</h3>
              <p className="stat-label">{lh.unique_skills}</p>
            </div>
          </div>

          <div className="stat-card reveal fade-up" style={{transitionDelay: '300ms'}}>
            <div className="stat-icon-wrapper pink-glow pulse-anim">
              <ThumbsUp size={32} />
            </div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">99.4%</h3>
              <p className="stat-label">{lh.match_rating}</p>
            </div>
          </div>
        </div>
      </section>



      {/* --- HOW IT WORKS --- */}
      <section className="section-container how-it-works-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{t("how_it_works_title")}</h2>
          <p className="section-subtitle">{t("how_it_works_subtitle")}</p>
        </div>
        <div className="steps-grid">
          {howItWorksSteps.map((step, index) => (
            <div className="step-card reveal fade-up" style={{transitionDelay: `${index * 150}ms`}} key={step.id}>
              <div className="step-number-bg">0{index + 1}</div>
              <div className="step-content">
                <div className="step-icon-wrapper pulse-anim">
                  {step.icon}
                </div>
                <h3 className="step-title">{t(step.titleKey)}</h3>
                <p className="step-description">{t(step.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREMIUM VISUAL ELEMENT 3: EXPLORE POPULAR CATEGORIES GRID */}
      <section className="section-container popular-categories-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{lh.explore_categories_title}</h2>
          <p className="section-subtitle">{lh.explore_categories_subtitle}</p>
        </div>
        <div className="categories-grid">
          <div className="category-card reveal fade-up tech-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper tech-glow">
              <Code size={26} />
            </div>
            <h3 className="category-title">{lh.cat_tech_title}</h3>
            <p className="category-desc">{lh.cat_tech_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">React.js</span>
              <span className="cat-tag">Python</span>
              <span className="cat-tag">WordPress</span>
            </div>
          </div>

          <div className="category-card reveal fade-up lang-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper lang-glow">
              <BookOpen size={26} />
            </div>
            <h3 className="category-title">{lh.cat_lang_title}</h3>
            <p className="category-desc">{lh.cat_lang_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">English IELTS</span>
              <span className="cat-tag">Algebra</span>
              <span className="cat-tag">Sindhi Lit</span>
            </div>
          </div>

          <div className="category-card reveal fade-up design-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper design-glow">
              <Brush size={26} />
            </div>
            <h3 className="category-title">{lh.cat_design_title}</h3>
            <p className="category-desc">{lh.cat_design_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">UI/UX</span>
              <span className="cat-tag">Illustrator</span>
              <span className="cat-tag">Premiere Pro</span>
            </div>
          </div>

          <div className="category-card reveal fade-up marketing-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper marketing-glow">
              <MessageSquare size={26} />
            </div>
            <h3 className="category-title">{lh.cat_marketing_title}</h3>
            <p className="category-desc">{lh.cat_marketing_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">SEO</span>
              <span className="cat-tag">Copywriting</span>
              <span className="cat-tag">FB Ads</span>
            </div>
          </div>

          <div className="category-card reveal fade-up trade-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper trade-glow">
              <Briefcase size={26} />
            </div>
            <h3 className="category-title">{lh.cat_trade_title}</h3>
            <p className="category-desc">{lh.cat_trade_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">Home Wiring</span>
              <span className="cat-tag">Tailoring</span>
              <span className="cat-tag">Baking</span>
            </div>
          </div>

          <div className="category-card reveal fade-up life-cat" onClick={handleFindSkillClick}>
            <div className="category-glow"></div>
            <div className="category-icon-wrapper life-glow">
              <HeartHandshake size={26} />
            </div>
            <h3 className="category-title">{lh.cat_lifestyle_title}</h3>
            <p className="category-desc">{lh.cat_lifestyle_desc}</p>
            <div className="category-tags">
              <span className="cat-tag">Yoga</span>
              <span className="cat-tag">Skin Care</span>
              <span className="cat-tag">Resume Build</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED SKILLS (4 Cards, Auto-Rotate) --- */}
      {!user && (
        <section className="section-container featured-skills-section centered-section">
          <div className="section-header text-center reveal fade-up">
            <h2 className="section-title">{t("featured_skills_title")} <Sparkles size={24} className="sparkle-icon"/></h2>
            <p className="section-subtitle">Discover what's popular in your area.</p>
            
            <button onClick={handleFindSkillClick} className="btn-link center-link">
              {t("view_all_link")} <ArrowRight size={16} />
            </button>
          </div>
          <div className="skills-grid">
            {visibleSkills.map((skill, idx) => (
              <div 
                className="home-skill-card reveal fade-up fade-in-anim" 
                key={`${skill.id}-${idx}`} // Unique key for animation triggering
                onClick={handleFindSkillClick}
              >
                <div className="skill-image-container">
                  <img src={skill.imageUrl} alt={skill.title} className="skill-image" loading="lazy" />
                  <div className="skill-overlay">
                    <span className="view-text">{t("view_details_link")}</span>
                  </div>
                </div>
                <div className="skill-content">
                  <h3 className="skill-title">{skill.title}</h3>
                  <div className="skill-meta">
                    <span className="skill-user"><User size={14}/> {skill.user}</span>
                    <div className="skill-rating">
                      <Star size={14} fill="#e38b40" stroke="#e38b40" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PREMIUM VISUAL ELEMENT 4: WHY CHOOSE GADD KAAM? CORE PILLARS GRID */}
      <section className="section-container core-pillars-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{lh.why_choose_title}</h2>
          <p className="section-subtitle">{lh.why_choose_subtitle}</p>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card reveal fade-up" style={{transitionDelay: '0ms'}}>
            <div className="pillar-header">
              <div className="pillar-icon-wrapper orange-glow">
                <Zap size={28} />
              </div>
              <h3 className="pillar-title">{lh.pillar_barter_title}</h3>
            </div>
            <p className="pillar-description">
              {lh.pillar_barter_desc}
            </p>
          </div>

          <div className="pillar-card reveal fade-up" style={{transitionDelay: '150ms'}}>
            <div className="pillar-header">
              <div className="pillar-icon-wrapper green-glow">
                <Shield size={28} />
              </div>
              <h3 className="pillar-title">{lh.pillar_safe_title}</h3>
            </div>
            <p className="pillar-description">
              {lh.pillar_safe_desc}
            </p>
          </div>

          <div className="pillar-card reveal fade-up" style={{transitionDelay: '300ms'}}>
            <div className="pillar-header">
              <div className="pillar-icon-wrapper purple-glow">
                <Sparkles size={28} />
              </div>
              <h3 className="pillar-title">{lh.pillar_growth_title}</h3>
            </div>
            <p className="pillar-description">
               {lh.pillar_growth_desc}
            </p>
          </div>
        </div>
      </section>

      {/* PREMIUM VISUAL ELEMENT 5: TOP SWAPPERS OF THE MONTH LEADERBOARD */}
      <section className="section-container leaderboard-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">
            <Trophy className="inline-icon gold-glow-text" size={32} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            {lh.leaderboard_title}
          </h2>
          <p className="section-subtitle">{lh.leaderboard_subtitle}</p>
        </div>
        <div className="leaderboard-grid">
          {/* Card 1: Gold - Tariq Ali */}
          <div className="swapper-card card-gold reveal fade-up" style={{ transitionDelay: '0ms' }}>
            <div className="medal-badge gold-badge">
              <Trophy size={20} />
              <span>1st</span>
            </div>
            <div className="swapper-avatar-wrapper">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Tariq Ali" className="swapper-avatar" />
              <div className="swapper-verified-badge" title={lh.leaderboard_verified}>
                <CheckCircle size={14} />
              </div>
            </div>
            <h3 className="swapper-name">{lh.tariq_name}</h3>
            <p className="swapper-location">{lh.tariq_location}</p>
            
            <div className="swapper-skills-container">
              <span className="swapper-skill-label">{lh.leaderboard_top_skills}:</span>
              <div className="swapper-skills-tags">
                <span className="swapper-skill-tag">{lh.tariq_skills.split(', ')[0]}</span>
                <span className="swapper-skill-tag">{lh.tariq_skills.split(', ')[1]}</span>
              </div>
            </div>

            <div className="swapper-stats-divider"></div>
            
            <div className="swapper-stats-row">
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">12</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_swaps}</span>
              </div>
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">48h</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_hours_shared}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Silver - Kanza Farooq */}
          <div className="swapper-card card-silver reveal fade-up" style={{ transitionDelay: '150ms' }}>
            <div className="medal-badge silver-badge">
              <Award size={20} />
              <span>2nd</span>
            </div>
            <div className="swapper-avatar-wrapper">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Kanza Farooq" className="swapper-avatar" />
              <div className="swapper-verified-badge" title={lh.leaderboard_verified}>
                <CheckCircle size={14} />
              </div>
            </div>
            <h3 className="swapper-name">{lh.kanza_name}</h3>
            <p className="swapper-location">{lh.kanza_location}</p>
            
            <div className="swapper-skills-container">
              <span className="swapper-skill-label">{lh.leaderboard_top_skills}:</span>
              <div className="swapper-skills-tags">
                <span className="swapper-skill-tag">{lh.kanza_skills.split(', ')[0]}</span>
                <span className="swapper-skill-tag">{lh.kanza_skills.split(', ')[1]}</span>
              </div>
            </div>

            <div className="swapper-stats-divider"></div>
            
            <div className="swapper-stats-row">
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">9</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_swaps}</span>
              </div>
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">36h</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_hours_shared}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Bronze - Shakir Khan */}
          <div className="swapper-card card-bronze reveal fade-up" style={{ transitionDelay: '300ms' }}>
            <div className="medal-badge bronze-badge">
              <Award size={20} />
              <span>3rd</span>
            </div>
            <div className="swapper-avatar-wrapper">
              <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Shakir Khan" className="swapper-avatar" />
              <div className="swapper-verified-badge" title={lh.leaderboard_verified}>
                <CheckCircle size={14} />
              </div>
            </div>
            <h3 className="swapper-name">{lh.shakir_name}</h3>
            <p className="swapper-location">{lh.shakir_location}</p>
            
            <div className="swapper-skills-container">
              <span className="swapper-skill-label">{lh.leaderboard_top_skills}:</span>
              <div className="swapper-skills-tags">
                <span className="swapper-skill-tag">{lh.shakir_skills.split(', ')[0]}</span>
                <span className="swapper-skill-tag">{lh.shakir_skills.split(', ')[1]}</span>
              </div>
            </div>

            <div className="swapper-stats-divider"></div>
            
            <div className="swapper-stats-row">
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">8</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_swaps}</span>
              </div>
              <div className="swapper-stat-item">
                <span className="swapper-stat-val">24h</span>
                <span className="swapper-stat-lbl">{lh.leaderboard_hours_shared}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- WOMEN'S ZONE BANNER --- */}
      {(!user || (user && user.gender === 'Female')) && (
        <section className="section-container women-zone-section-wrapper reveal scale-up centered-section">
          <div className="women-zone-banner">
            <div className="women-zone-text">
              <div className="badge-pink"><Shield size={16} /> {t("women_only_zone_tag")}</div>
              <h2 className="women-zone-title">
                {lh.women_zone_safe_space_for}<span className={`dynamic-text-pink ${womenFade}`}>{womenWords[womenIndex]}</span>.
              </h2>
              <p className="women-zone-description">{t("women_zone_description")}</p>
              <button className="btn btn-primary-pink" onClick={handleWomenZoneClick}>
                {t("women_zone_button")}<span className={`dynamic-text-pink2 ${womenFade}`}>{womenWords[womenIndex]}</span>.
              </button>
            </div>
            <div className="women-zone-visual">
               <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80" alt="Women Zone" className="women-zone-img float-anim" loading="lazy" />
            </div>
          </div>
        </section>
      )}

      {/* PREMIUM VISUAL ELEMENT 6: FAQ ACCORDION */}
      <section className="section-container faq-accordion-section centered-section">
        <div className="section-header text-center reveal fade-up">
          <h2 className="section-title">{lh.faq_title}</h2>
          <p className="section-subtitle">{lh.faq_subtitle}</p>
        </div>
        <div className="faq-accordion-wrapper reveal fade-up">
          {[
            { id: 1, q: lh.faq_q1, a: lh.faq_a1 },
            { id: 2, q: lh.faq_q2, a: lh.faq_a2 },
            { id: 3, q: lh.faq_q3, a: lh.faq_a3 },
            { id: 4, q: lh.faq_q4, a: lh.faq_a4 }
          ].map((item) => {
            const isOpen = activeFaqId === item.id;
            return (
              <div 
                key={item.id} 
                className={`faq-accordion-card ${isOpen ? 'active' : ''}`}
                onClick={() => setActiveFaqId(isOpen ? null : item.id)}
              >
                <div className="faq-question-bar">
                  <h3 className="faq-question-text">{item.q}</h3>
                  <div className="faq-chevron-wrapper">
                    <ChevronDown size={20} className="faq-chevron" />
                  </div>
                </div>
                <div className="faq-answer-container" style={{ maxHeight: isOpen ? '250px' : '0px' }}>
                  <div className="faq-answer-content">
                    <p className="faq-answer-text">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- ANIMATED TESTIMONIALS (3 Cards) --- */}
      {!user && (
        <section className="section-container testimonials-section centered-section">
          <h2 className="section-title text-center reveal fade-up">{t("testimonials_title")}</h2>
          
          <div className="testimonials-grid reveal fade-up">
            {visibleTestimonials.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="testimonial-card fade-in-anim">
                    <div className="quote-icon">“</div>
                    <p className="testimonial-quote">{item.quote}</p>
                    <div className="testimonial-author">
                        <img 
                            src={item.img} 
                            alt={item.name} 
                            className="author-avatar" 
                            loading="lazy"
                        />
                        <div>
                            <p className="author-name">{item.name}</p>
                            <p className="author-details">{item.details}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </section>
      )}

      {/* PREMIUM VISUAL ELEMENT 1: LIVE SWAP STREAM TICKER CARD (REPOSITIONED TO BOTTOM OF HOME PAGE) */}
      <section className="section-container home-ticker-section centered-section reveal fade-up" style={{ padding: '40px 20px 60px' }}>
        <div className="live-swap-ticker-card" style={{ margin: '0 auto' }}>
          <div className="ticker-badge">
            <span className="live-dot pulse-anim"></span>
            <span>LIVE SWAP</span>
          </div>
          <div className={`ticker-message ${swapFade ? 'fade-in' : 'fade-out'}`}>
            <strong className="ticker-user">{simulatedSwaps[activeSwapIndex].from}</strong>
            <span className="ticker-action"> swapped </span>
            <span className="ticker-skill-gave">{simulatedSwaps[activeSwapIndex].gave}</span>
            <span className="ticker-action"> with </span>
            <strong className="ticker-user">{simulatedSwaps[activeSwapIndex].to}</strong>
            <span className="ticker-action"> for </span>
            <span className="ticker-skill-req">{simulatedSwaps[activeSwapIndex].received}</span>
          </div>
          <div className="ticker-time">{simulatedSwaps[activeSwapIndex].time}</div>
        </div>
      </section>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default HomePage;
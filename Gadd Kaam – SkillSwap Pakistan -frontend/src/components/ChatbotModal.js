// src/components/ChatbotModal.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import '../styles/chatbot-modal.css';

const ChatbotModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Gadd Kaam AI. Ask me anything about skills, account, safety, or just say Hi! 👋 (I speak English, Urdu, and Sindhi)", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- 1. EXPANDED SUGGESTIONS POOL (Mix of all categories) ---
  const allSuggestions = [
    "Hi", "Hello", "How are you?", "Funny joke", "How to get money? 💰",

    // --- Account & Login ---
    "How do I create an account?",
    "Forgot password",
    "Delete my account",
    "Change email/phone",
    "Why no verification code?",

    // --- Profile & Skills ---
    "How to add skills?",
    "Can I offer multiple skills?",
    "How to add portfolio?",
    "Set availability",

    // --- How it Works ---
    "How does swapping work?",
    "Is it free?",
    "What is swiping?",
    "Guarantee of service?",
    "What if it goes wrong?",

    // --- Matching ---
    "Why no matches?",
    "How to chat?",
    "Can I send photos?",
    "Is user trustworthy?",

    // --- Safety ---
    "Is Women Zone safe?",
    "How do you verify users?",
    "Report a user",
    "Someone is rude",

    // --- Urdu ---
    "آپ کیسے ہیں؟ (How are you?)",
    "کیا یہ مفت ہے؟ (Is it free?)",
    "اکاؤنٹ کیسے بنائیں؟ (Create account)",
    "پاس ورڈ بھول گیا (Forgot password)",

    // --- Sindhi ---
    "توهان ڪيئن آهيو؟ (How are you?)",
    "اڪائونٽ ڪيئن ٺاهجي؟ (Create account)",
    "ڇا هي مفت آهي؟ (Is it free?)",
    "How to create an account?",
    "Forgot password",
    "How to add skills?",
    "How does swapping work?",
    "Is it free?",
    "Why no matches?",
    "How to report user?",
    "Is Women Zone safe?",
    "Can I use Facebook login?",
    "Delete my account",
    "Change email",
    "Add portfolio",
    "What is swiping?",
    "Start a chat",
    "Send photos in chat",
    "Verify my account",
    "Someone is rude",
    "Filter by city",
    "App for Android?",
    "Popular skills?",
    "آپ کیسے ہیں؟",
    "اکاؤنٹ کیسے بنائیں؟",
    "کیا یہ مفت ہے؟",
    "توهان ڪيئن آهيو؟",
    "اڪائونٽ ڪيئن ٺاهجي؟",
    "ڇا هي مفت آهي؟",
    "Tell me a joke",
    "How to get money? 💰"
  ];

  const [suggestions, setSuggestions] = useState(allSuggestions.slice(0, 4));

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // --- 2. MASSIVE KNOWLEDGE BASE (Local Logic) ---
  const getSmartResponse = (question) => {
    const q = question.toLowerCase();

    // =========================================================
    // 1. ACCOUNT & LOGIN / REGISTRATION
    // --- A. GREETINGS & CASUAL ---
    if (q.match(/^(hi|hello|hey|salam|slam|aslam)/)) return "Walaikum Assalam! Hello! Welcome to Gadd Kaam. How can I help you today? \n\n(اردو: خوش آمدید! سندھی: ڀلي ڪري آيا!)";
    if (q.match(/(how are you|haal chaal|kese ho|kian ahay|kian ahyo)/)) return "I am just a bot, but I'm functioning perfectly! 🤖 Thanks for asking. \n\nUrdu: میں ٹھیک ہوں، شکریہ! \nSindhi: مان ٺيڪ آهيان، مهرباني!";
    if (q.match(/(money|get money|earn|cash|paisa|paisay)/)) return "😂 This is a barter platform, my friend! We swap SKILLS, not cash. If you want money, maybe try swapping 'Financial Advice' skills? \n\nUrdu: یہاں ہنر کا تبادلہ ہوتا ہے، پیسوں کا نہیں! \nSindhi: هتي صرف هنر جي مٽا سٽا ٿيندي آهي، پيسن جي نه!";
    if (q.match(/(joke|funny|laugh)/)) return "Why did the developer go broke? Because he used up all his cache! 😂 Now go swap some skills!";
    if (q.match(/(who are you|what are you)/)) return "I am the Gadd Kaam Assistant. I live in the server (and sometimes in your browser cache).";

    // --- B. ACCOUNT & REGISTRATION ---
    if (q.match(/(sign up|register|create account|account banana|account thahyan)/)) return "To sign up, click the 'Signup' button on the navbar. You need a valid Phone Number and CNIC.\n\nUrdu: سائن اپ کرنے کے لیے اوپر بٹن دبائیں۔\nSindhi: سائن اپ ڪرڻ لاءِ مٿي بٽڻ دٻايو.";
    if (q.match(/(google|facebook|social login)/)) return "Currently, we only support direct sign-up using your details. Social login features might come in the future!";
    if (q.match(/(reset|forgot|password|pasword)/)) return "If you forgot your password, please use the 'Forgot Password' link on the login page or contact support if you need manual help.";
    if (q.match(/(delete account|remove account|khatam|delete)/)) return "To delete your account, go to Dashboard > Profile > Settings > Danger Zone. This action is permanent!";
    if (q.match(/(verify|verification|code|sms|email)/)) return "If you didn't receive a code, check your spam folder or ensure your phone number is correct (03XX...). Retrying after 1 minute usually helps.";
    if (q.match(/(change email|change phone)/)) return "You can update your email or phone number from your Profile Settings page.";

    // --- C. PROFILE & SKILLS ---
    if (q.match(/(add skill|edit skill|my skills|hunar)/)) return "Go to Dashboard > My Skills. Click 'Add New' to post a skill. Be sure to add a nice photo!";
    if (q.match(/(how many skills|limit)/)) return "You can offer as many skills as you want! However, focus on your best 3 for better matches.";
    if (q.match(/(portfolio|photo|image|picture)/)) return "When adding a skill, you can upload a cover photo. We support JPG and PNG under 6MB.";
    if (q.match(/(location|city|place|jaga|preferences)/)) return "Your location is set during registration. You can update it in Profile Settings. Availability can be mentioned in your skill description.";
    if (q.match(/(description|write)/)) return "Be clear! Mention what you do, your experience, and what you want in return. Keep it friendly and professional.";
    if (q.match(/(multiple categories|category)/)) return "Yes! You can post separate skill offers for different categories like 'Cooking' and 'Design'.";

    // --- D. PLATFORM MECHANICS (SWAPPING) ---
    if (q.match(/(how.*work|swapping|exchange|barter|mita sata)/)) return "It's simple: 1. Post a Skill. 2. Search for what you need. 3. Chat & Agree. 4. Swap! No money changes hands.";
    if (q.match(/(free|pay|paid|cost|paisa)/)) return "Yes! Gadd Kaam is 100% FREE to use. It is a pure barter system. \n\nUrdu: یہ بالکل مفت ہے۔ \nSindhi: هي بلڪل مفت آهي.";
    if (q.match(/(guarantee|trust|scam|dhoka)/)) return "We verify CNICs to ensure real users. However, always meet in public places or work remotely. Check reviews before swapping.";
    if (q.match(/(offering|requesting|difference)/)) return "Offering means you list a skill you HAVE. Requesting means you ask someone for a skill you NEED.";
    if (q.match(/(find someone|search)/)) return "Go to the Marketplace page. Use the search bar or filters to find the specific skill you need.";
    if (q.match(/(swiping|swipe)/)) return "Swipe Right if you are interested. Swipe Left to pass. If you both match, you can chat!";
    if (q.match(/(agree|exchange|hours)/)) return "Discuss the terms in the chat. Agree on hours, deliverables, and timelines before starting the work.";

    // --- E. MATCHING & COMMUNICATION ---
    if (q.match(/(no match|response|reply|jawab)/)) return "If you aren't getting matches, try improving your Skill Title and Description. Add a clear photo!";
    if (q.match(/(increase chances|boost)/)) return "Complete your profile, add a friendly bio, and list clear 'Skills Wanted' to get better matches.";
    if (q.match(/(message before match)/)) return "No, you must match (or send a direct request) before messaging to prevent spam.";
    if (q.match(/(start chat|message|msg)/)) return "Once matched or request accepted, go to Dashboard > Messages to start chatting.";
    if (q.match(/(photo in chat|video)/)) return "Currently, chat supports text only for safety. Please exchange numbers if you need to share media files securely.";
    if (q.match(/(serious|trustworthy)/)) return "Look for users with the 'Verified' badge and check their ratings/reviews from previous swaps.";

    // --- F. SAFETY & TRUST ---
    if (q.match(/(women|woman|ladies|female|aurat|aurton|women zone)/)) return "The Women-Only Zone is a safe space where only verified female users can see and swap skills. It is hidden from male users.";
    if (q.match(/(verify|verification)/)) return "We verify users via CNIC. You can also verify your email and phone number for added trust.";
    if (q.match(/(personal info|safe)/)) return "Your data is encrypted. We do not share your exact location or phone number publicly unless you choose to.";
    if (q.match(/(rude|behavior|report)/)) return "If someone is rude or scams you, go to their profile and click 'Report User'. Our admin team will investigate.";
    if (q.match(/(rating|review)/)) return "Yes! After a swap is marked complete, you can rate and review the other person.";

    // --- G. PROBLEMS & DISPUTES ---
    if (q.match(/(didn't complete|not done|incomplete)/)) return "If a user fails to deliver, report them. We track incomplete swaps and may ban repeat offenders.";
    if (q.match(/(report user)/)) return "Go to their profile, click the three dots/menu, and select 'Report'. Provide details of the incident.";
    if (q.match(/(asking for money|inappropriate)/)) return "Strictly prohibited! Report them immediately. We have a zero-tolerance policy for harassment or money demands.";
    if (q.match(/(stopped replying|ghosting)/)) return "People get busy. Give them 24-48 hours. If they vanish mid-swap, report them for 'Ghosting'.";

    // --- H. FEATURES & LIMITATIONS ---
    if (q.match(/(paid service|premium)/)) return "Currently, Gadd Kaam is fully barter-based. We do not have paid services or premium plans yet.";
    if (q.match(/(who viewed|views)/)) return "We do not show profile views to maintain privacy.";
    if (q.match(/(search distance|filter)/)) return "You can filter by City in the Marketplace search bar.";
    if (q.match(/(app|ios|android)/)) return "We are currently a web platform. The mobile app is coming soon! Stay tuned.";

    // --- I. MISCELLANEOUS ---
    if (q.match(/(multiple languages|language)/)) return "Yes, you can post skills in English, Urdu, or Sindhi. Communication is key!";
    if (q.match(/(family|friends)/)) return "You can swap with anyone, but the platform is designed to help you meet NEW people with skills you don't have.";
    if (q.match(/(business|commercial)/)) return "Yes, you can offer professional services for barter. It's a great way to build a portfolio.";
    if (q.match(/(typical time|duration)/)) return "It varies! A logo design might take 2 days, while gardening might take 2 hours. Agree on this beforehand.";
    if (q.match(/(popular skills)/)) return "Web Dev, Graphic Design, Tutor, and Handyman services are very popular right now.";
    if (q.match(/(pause profile|hide)/)) return "You can temporarily hide your skills by editing them and toggling 'Active' off, or setting them to Private.";

    // --- J. LANGUAGE SPECIFIC (URDU/SINDHI) ---
    if (q.includes("مدد") || q.includes("madad")) return "میں آپ کی کیا مدد کر سکتا ہوں؟ برائے مہربانی اپنا سوال پوچھیں۔";
    if (q.includes("مدد") && q.includes("سنڌي")) return "مان توهان جي ڪهڙي مدد ڪري سگهان ٿو؟ مهرباني ڪري سوال پڇو.";
    if (q.includes("پيسن") || q.includes("پیسے")) return "یہ پلیٹ فارم ہنر کے تبادلے کے لیے ہے، پیسوں کے لیے نہیں۔ (Barter only!)";
    // =========================================================
    if (q.match(/(create account|sign up|register|new account|join)/)) 
      return "To create an account:\n1. Click the 'Signup' button on the navbar.\n2. Fill in your Name, Username, Email, Phone, and CNIC.\n3. Upload a profile picture (optional).\n4. Click Register!\n\nUrdu: سائن اپ بٹن پر کلک کریں اور فارم پُر کریں۔";
    
    if (q.match(/(google|facebook|social login|gmail)/)) 
      return "Currently, we only support direct signup via our form. Social login (Google/Facebook) is coming in a future update!";

    if (q.match(/(forgot password|reset password|lost password)/)) 
      return "If you forgot your password, please contact our support team or use the 'Forgot Password' link on the login page (if available). We verify identity before resetting.";

    if (q.match(/(verification code|sms|email|code not received)/)) 
      return "If you aren't receiving the code:\n1. Check your Spam/Junk folder.\n2. Ensure your phone number is correct (03XX format).\n3. Wait 2 minutes and try again.\n4. If issues persist, contact support.";

    if (q.match(/(change email|change phone|update contact)/)) 
      return "Yes! Go to Dashboard > Profile > Settings to update your email or phone number.";

    if (q.match(/(delete account|remove account|deactivate)/)) 
      return "To delete your account permanently: Go to Dashboard > Profile > Settings > Danger Zone > Delete Account. Warning: This cannot be undone!";


    // =========================================================
    // 2. PROFILE & SKILLS
    // =========================================================
    if (q.match(/(add skill|edit skill|post skill|create offer)/)) 
      return "To add a skill: Go to Dashboard > My Skills > 'Offer a Skill'. Fill in the title, description, and upload a photo.";

    if (q.match(/(how many skills|limit)/)) 
      return "You can offer as many skills as you want! However, we recommend focusing on your top 3-5 skills for better quality matches.";

    if (q.match(/(description|write about skill)/)) 
      return "In your description, write:\n- What exactly you can do.\n- Your experience level.\n- What tools/equipment you have.\n- What you expect in return (e.g., 'I want plumbing help').";

    if (q.match(/(portfolio|photos|add image)/)) 
      return "Yes! When creating a skill offer, click the camera icon to upload a cover photo. A good photo increases matches by 50%!";

    if (q.match(/(multiple categories|category|mix skills)/)) 
      return "Yes, you can offer skills in different categories. For example, you can post one offer for 'Web Design' and another for 'Home Cooking'.";

    if (q.match(/(availability|location|set time)/)) 
      return "You can mention your availability (e.g., 'Weekends only') in the skill description. Your location is set in your Profile, but you can also specify it in the offer (or choose 'Remote').";


    // =========================================================
    // 3. HOW THE PLATFORM WORKS
    // =========================================================
    if (q.match(/(how.*work|swapping|exchange|barter|concept)/)) 
      return "Gadd Kaam connects people to swap skills without money.\nExample: You fix someone's sink, and they design a logo for you. It's a direct barter system.";

    if (q.match(/(pay|free|money|cost|charge)/)) 
      return "It is 100% FREE! We do not charge fees for swaps. It is a community-driven barter platform.\n\nUrdu: یہ سروس بالکل مفت ہے۔\nSindhi: هي پليٽ فارم بلڪل مفت آهي.";

    if (q.match(/(offering vs requesting|difference)/)) 
      return "Offering = You listing a skill you HAVE.\nRequesting = You asking someone for a skill you NEED.";

    if (q.match(/(find someone|search|locate)/)) 
      return "Go to the 'Marketplace'. Use the search bar to type a skill (e.g., 'Carpenter') or use the filters to find people near you.";

    if (q.match(/(swipe|swiping|left|right)/)) 
      return "Swipe Right 👉 if you are interested in a skill.\nSwipe Left 👈 to skip.\nIf you both show interest, it's a Match!";

    if (q.match(/(after swipe|matched|what next)/)) 
      return "After swiping right (or clicking Request), a notification is sent to the user. If they accept, you can start chatting to arrange the swap.";

    if (q.match(/(agree|agreement|deal)/)) 
      return "You should agree on:\n1. The scope of work (hours/tasks).\n2. The timeline.\n3. The standard of quality.\nDo this via Chat BEFORE starting work.";

    if (q.match(/(guarantee|assurance)/)) 
      return "Since this is a free community platform, we cannot strictly guarantee delivery. However, we verify CNICs to ensure user authenticity. Check reviews before swapping!";

    if (q.match(/(bad experience|not go well)/)) 
      return "If a swap doesn't go well, try to resolve it politely first. If the user was abusive or fraudulent, please Report them immediately via their profile.";


    // =========================================================
    // 4. MATCHING & COMMUNICATION
    // =========================================================
    if (q.match(/(no match|no response|ignored)/)) 
      return "Not getting matches? Try:\n- Adding a better profile picture.\n- Writing a clearer description.\n- Offering popular skills like Tutoring or Repairs.";

    if (q.match(/(increase chances|more matches)/)) 
      return "Be proactive! Don't just wait. Browse the Marketplace and send requests to people who have the skills you need.";

    if (q.match(/(message before match)/)) 
      return "To prevent spam, you can only message users after you have Matched or sent a formal Request.";

    if (q.match(/(start chat|how to chat)/)) 
      return "Go to your Dashboard > Messages. Select a user from your matched list to start talking.";

    if (q.match(/(send photo|send video|media)/)) 
      return "Currently, our chat is text-only for security reasons. If you need to share files, please do so via email or WhatsApp after you trust the person.";

    if (q.match(/(trustworthy|serious|fake)/)) 
      return "Look for the 'Verified' badge (CNIC verified). Also, read the Reviews on their profile to see what others say.";


    // =========================================================
    // 5. SAFETY & TRUST
    // =========================================================
    if (q.match(/(verify user|verification process)/)) 
      return "We require CNIC (National ID) verification for full access. This helps keep the platform safe and reduces fake accounts.";

    if (q.match(/(safe|safety|personal info)/)) 
      return "Your data is encrypted. We do NOT show your exact address publicly. Only your City/Area is shown.";

    if (q.match(/(rude|behavior|harass)/)) 
      return "We have zero tolerance for rude behavior. Block the user immediately and use the 'Report' button on their profile.";

    if (q.match(/(women only|women zone|female)/)) 
      return "The Women-Only Zone is a special secure area where only verified female users can interact. Male users cannot see profiles or skills posted there.";

    if (q.match(/(rating|review system)/)) 
      return "Yes! After a swap is completed, you will be prompted to rate the user from 1-5 stars and leave a review.";

    if (q.match(/(scam|fraud|waste time)/)) 
      return "If someone scams you (takes service but doesn't give back), Report them. We investigate all reports and ban scammers permanently.";


    // =========================================================
    // 6. PROBLEMS & DISPUTES
    // =========================================================
    if (q.match(/(didn't complete|incomplete|half work)/)) 
      return "Communicate with them. Sometimes life happens. If they refuse to finish, report the transaction as 'Incomplete'.";

    if (q.match(/(report user|how to report)/)) 
      return "Go to the User's Profile -> Click the 3 dots (Menu) -> Select 'Report User'. Choose a reason and submit.";

    if (q.match(/(asking for money|payment)/)) 
      return "This is a violation of our rules. Gadd Kaam is for Barter only. Please report anyone asking for money.";

    if (q.match(/(ghosted|stopped reply)/)) 
      return "If a user stops replying mid-swap, report them for 'Non-responsive'. We track such behavior.";


    // =========================================================
    // 7. FEATURES & LIMITATIONS
    // =========================================================
    if (q.match(/(paid service|premium|gold)/)) 
      return "Currently, all features are Free! We may introduce premium features (like 'Super Boost') in the future.";

    if (q.match(/(who viewed|profile view)/)) 
      return "We prioritize privacy, so we do not show who viewed your profile, only who 'Requested' or 'Swiped Right' on you.";

    if (q.match(/(distance|search radius)/)) 
      return "In the Marketplace, you can filter results by City or specific Location to find people nearby.";

    if (q.match(/(app|mobile app|ios|android)/)) 
      return "We are currently a Web Platform (PWA). You can 'Add to Home Screen' to use it like an app on your phone!";


    // =========================================================
    // 8. MISCELLANEOUS / EDGE CASES
    // =========================================================
    if (q.match(/(language|urdu|sindhi)/)) 
      return "You can use the platform in English, Urdu, or Sindhi! Change the language from the globe icon in the Navbar.";

    if (q.match(/(friends|family|swap with known)/)) 
      return "You can swap with friends, but the app is best for finding NEW connections and skills you don't have access to.";

    if (q.match(/(business|commercial use)/)) 
      return "Small businesses can use it to barter services (e.g., a Cafe swapping meals for Graphic Design).";

    if (q.match(/(time|how long|duration)/)) 
      return "Swaps can be 1 hour or 1 week. It depends entirely on what you and your partner agree upon.";

    if (q.match(/(popular|trending)/)) 
      return "Trending skills right now: Graphic Design, Web Dev, AC Repair, Home Tutoring, and Cooking.";

    if (q.match(/(pause|hide profile)/)) 
      return "Yes, you can 'Deactivate' specific skill offers from your dashboard if you are busy or away.";


    // =========================================================
    // 9. FUNNY / CHIT CHAT
    // =========================================================
    if (q.match(/(joke|funny|laugh)/)) return "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😂";
    if (q.match(/(money|cash|paisa|rich)/)) return "I can't give you money, but I can help you find a skill that saves you money! 💡";
    if (q.match(/(robot|ai|human)/)) return "I am a highly advanced AI... programmed to help you swap skills! 🤖";
    if (q.match(/(married|single|date)/)) return "I am married to my job (helping you). Please keep conversations professional! 👔";


    // =========================================================
    // 10. URDU & SINDHI SPECIFIC
    // =========================================================
    
    // Urdu
    if (q.includes("کیسے") || q.includes("مدد") || q.includes("کام")) 
       return "جی میں آپ کی مدد کے لیے حاضر ہوں۔ آپ ہنر کے تبادلے، اکاؤنٹ، یا سیفٹی کے بارے میں پوچھ سکتے ہیں۔";
    
    if (q.includes("پیسے") || q.includes("کمائیں")) 
       return "یہ پلیٹ فارم ہنر کے تبادلے کے لیے ہے، یہاں پیسے نہیں چلتے۔";

    // Sindhi
    if (q.includes("ڪيئن") || q.includes("مدد") || q.includes("ڪم")) 
       return "جي، آئون توهان جي مدد لاءِ حاضر آهيان. توهان هنر جي مٽا سٽا، اڪائونٽ، يا تحفظ بابت پڇي سگهو ٿا.";

    if (q.includes("پيسا") || q.includes("ڪمائڻ")) 
       return "هي پليٽ فارم صرف هنر جي مٽا سٽا لاءِ آهي، هتي پيسا نٿا هلن.";


    // No match
    return null;
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg = { text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Rotate suggestions randomly
    const randomStart = Math.floor(Math.random() * (allSuggestions.length - 3));
    setSuggestions(allSuggestions.slice(randomStart, randomStart + 3));

    // CHECK LOCAL LOGIC FIRST
    const localReply = getSmartResponse(messageText);

    if (localReply) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: localReply, sender: 'bot' }]);
        setLoading(false);
      }, 500);
      return;
    }

    // IF NO LOCAL MATCH, CALL API
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`, 
        { message: messageText },
        { headers }
      );
      
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to the server. But you can check our Help Center page for more info!", 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay glass-entrance">
      <div className="chatbot-container glass-panel">
        
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-content">
            <div className="bot-avatar-glow">
              <Bot size={24} className="bot-icon-anim" />
              <span className="status-dot"></span>
            </div>
            <div className="header-text">
              <h4>Gadd Kaam AI</h4>
              <span className="status-text">Online & Ready</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => setMessages([{ text: "How can I help you today?", sender: 'bot' }])} className="action-btn"><RefreshCw size={16} /></button>
            <button onClick={onClose} className="action-btn close"><X size={20} /></button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="chatbot-messages custom-scrollbar">
          <div className="chat-start-time">Today</div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-row ${msg.sender}`}>
              {msg.sender === 'bot' && <div className="chat-icon bot"><Bot size={16} /></div>}
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                ))}
              </div>
              {msg.sender === 'user' && <div className="chat-icon user"><User size={16} /></div>}
            </div>
          ))}

          {loading && (
            <div className="chat-row bot">
              <div className="chat-icon bot"><Bot size={16} /></div>
              <div className="chat-bubble bot loading-bubble">
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips */}
        {!loading && (
          <div className="suggestions-container">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => handleSend(s)}>
                <Sparkles size={12} className="chip-icon"/> {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <form className="chatbot-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input 
            type="text" 
            placeholder="Type 'Hello' or ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className={`send-btn ${input.trim() ? 'active' : ''}`} disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotModal;
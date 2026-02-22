const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const auth = require('../middleware/auth'); 
const Chat = require('../models/Chat');

require('dotenv').config({ path: path.join(__dirname, '..', 'config', '.env') });

// --- 🧠 SITE KNOWLEDGE BASE (The Brain) ---
// This text teaches the AI about your specific website features.
const SITE_KNOWLEDGE = `
You are the AI Assistant for "Gadd Kaam" (SkillSwap Pakistan), a cash-free barter platform.
Your goal is to help users navigate the site and swap skills.

PLATFORM DETAILS:
1. **Marketplace**: The main hub where users list skills (e.g., Tractor Repair, Web Dev, Henna Art).
2. **Women's Zone**: A secure, verified space exclusively for female users to swap skills safely.
3. **How it Works**: 
   - Post a Skill -> Receive Requests -> Chat & Agree -> Confirm Swap -> Leave Review.
   - No money is exchanged. It is purely skill-for-skill.
4. **Dashboard**: Users can track "Received Requests", "My Skills", and "Account Settings".
5. **Languages**: The platform supports English, Urdu, and Sindhi.
6. **Safety**: We verify CNIC/Phone numbers. Always meet in public places or use the Women's Zone.

If a user asks about something not listed here, kindly guide them to the 'Contact Us' page.
`;

// --- 🤖 LOCAL FALLBACK BRAIN (Offline Mode) ---
const getLocalResponse = (msg) => {
  const m = msg.toLowerCase();
  
  // Greetings
  if (m.match(/\b(hi|hello|hey|salam)\b/)) 
    return "Walaikum Assalam! Welcome to Gadd Kaam. How can I help you swap a skill today?";
  
  // Navigation / Features
  if (m.includes('market') || m.includes('search')) 
    return "You can find all available skills in the **Marketplace**. Use the search bar to find plumbers, tutors, or designers near you!";
  if (m.includes('women') || m.includes('pink') || m.includes('safe')) 
    return "The **Women's Zone** is our verified, female-only section. It ensures a safe environment for women to trade skills like cooking, sewing, or tutoring.";
  if (m.includes('dashboard') || m.includes('profile')) 
    return "Go to your **Dashboard** to manage your posted skills, view received requests, and update your profile picture.";
  
  // Mechanics of the site
  if (m.includes('how') && (m.includes('swap') || m.includes('trade') || m.includes('work'))) 
    return "It's simple: \n1. Post a skill you offer.\n2. Browse the Marketplace for what you need.\n3. Click 'Request Swap' and chat to finalize the deal!";
  if (m.includes('money') || m.includes('price') || m.includes('cost')) 
    return "Gadd Kaam is 100% **cash-free**! We believe in the power of community and sharing talent without money.";
  
  // Specific Skills (Context from your previous prompts)
  if (m.includes('tractor') || m.includes('repair')) 
    return "Need a repair? Check the Marketplace! We have experts in Tractor Repair, AC Maintenance, and Mobile Repair listed.";
  if (m.includes('henna') || m.includes('makeup') || m.includes('cooking')) 
    return "Looking for lifestyle skills? Our Women's Zone features amazing Henna Artists, Home Chefs, and Beauticians.";

  return "I'm not 100% sure about that, but you can browse the **Marketplace** or check the **FAQ** page for more help!";
};

// --- GET: Fetch Chat History ---
router.get('/history', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      return res.json([{ 
        sender: 'bot', 
        text: "Hi! I'm Gadd Kaam AI. I know everything about the Marketplace, Women's Zone, and swapping skills. Ask me anything!" 
      }]);
    }
    // Return last 50 messages
    res.json(chat.messages.slice(-50));
  } catch (err) {
    console.error("History Error:", err.message);
    res.json([]); // Return empty array instead of crashing
  }
});

// --- POST: Send Message ---
router.post('/', auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get/Create Chat History
    let chat = await Chat.findOne({ user: userId });
    if (!chat) chat = new Chat({ user: userId, messages: [] });
    
    // 2. Save User Message
    chat.messages.push({ sender: 'user', text: message });

    let botReply = "";

    // 3. Try Cohere API (Primary)
    if (process.env.COHERE_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.cohere.ai/v1/chat',
          {
            message: message,
            preamble: SITE_KNOWLEDGE, // ✅ Inject Site Knowledge here
            temperature: 0.3,
            connectors: [{ id: "web-search" }] // Optional: Lets it search web if needed (usually paid, but good to have struct)
          },
          { headers: { Authorization: `Bearer ${process.env.COHERE_API_KEY}` } }
        );

        if (response.data && response.data.text) {
          botReply = response.data.text;
        }
      } catch (apiError) {
        console.warn("Cohere API Failed, switching to Local Brain.");
      }
    } 

    // 4. Failover: Local Brain
    if (!botReply) {
      botReply = getLocalResponse(message);
    }

    // 5. Save Bot Response
    chat.messages.push({ sender: 'bot', text: botReply });
    await chat.save();

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.json({ reply: getLocalResponse(message) }); // Final fallback
  }
});

module.exports = router;
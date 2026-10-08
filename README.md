# Gadd-Kaam – SkillSwap Pakistan

A comprehensive skill-sharing platform designed for Pakistan, connecting individuals who want to learn new skills with those willing to teach them. Gadd Kaam serves as a trusted bridge for skill exchange, professional growth, and community development, ensuring every user has access to quality learning opportunities.

## 🚀 Features

### 👤 User Profiles
- **Personalized Profiles:** Users can create detailed profiles including name, contact information, date of birth, and gender.
- **Profile Picture:** Option to upload a profile photo.
- **CNIC Verification:** Secure verification system using CNIC hash for identity confirmation.

### 🛠️ Service Offerings
- **Skill Listing:** Users can list skills they are willing to teach or offer as services.
- **Category-Based Browsing:** Browse skills across multiple categories including Academics, Arts & Crafts, Home Services, Beauty & Fashion, and Health & Fitness.
- **Skill Details:** Each skill listing includes a title, detailed description, remote availability, and skills wanted in return.

### 👥 Matching & Discovery
- **Skill Matching Algorithm:** Intelligent system to match learners with suitable skill providers based on skills and location.
- **Location-Based Search:** Find skills available in specific cities across Pakistan.
- **Detailed View:** View complete details of any skill offering, including provider information and location.

### 🔄 Pure Barter Economy
- **100% Cash-Free Trading:** Direct peer-to-peer barter of skills without monetary exchange.

### 💬 Communication
- **Real-Time Chat:** Built-in messaging system to connect learners with skill providers.
- **Notifications:** Instant notifications for new messages, swap requests, and updates.

### 🔐 Trust & Safety
- **Comprehensive Verification:** Verification through CNIC encryption and identity hashing.
- **Women-Only Zone:** Dedicated, verified safe space for female swappers.
- **Reporting System:** Easy-to-use reporting tool for users to flag inappropriate content or behavior.
- **Moderation Dashboard:** Admin panel to review and manage user reports, ensuring a safe platform.

### 📱 Mobile-First Design
- **Responsive Interface:** Optimized for both desktop and mobile devices.
- **Modern UI/UX:** Clean, intuitive interface with smooth navigation and interactive elements.

## 🏗️ Tech Stack

### ⚙️ Backend
- **Node.js & Express.js:** Fast and scalable RESTful API with Socket.io real-time websockets.
- **MongoDB & Mongoose:** Document database with field-level encryption for sensitive data.
- **JWT:** Secure token-based authentication.
- **Cohere AI:** AI-powered chatbot assistant.

### 💻 Frontend
- **React.js (v19) & Vite:** Ultra-fast modern frontend development and bundling.
- **Tailwind CSS (v4):** Next-generation utility styling and responsive design tokens.
- **i18next:** Multi-language support (English, Urdu, Sindhi).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Community Server or MongoDB Atlas)

## 🏁 Getting Started

Follow these steps to set up and run the project locally.

### 1. Install Dependencies

**Backend:**
```bash
cd "Gadd Kaam – SkillSwap Pakistan _backend"
npm install
```

**Frontend:**
```bash
cd "Gadd Kaam – SkillSwap Pakistan -frontend"
npm install
```

### 2. Configure Environment Variables

**Backend:**
Copy `.env.example` to `.env` in the backend directory (`Gadd Kaam – SkillSwap Pakistan _backend`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gadd_kaam
JWT_SECRET=your_secret_key_here
COHERE_API_KEY=your_cohere_api_key_here
```

**Frontend:**
Copy `.env.example` to `.env` in the frontend directory (`Gadd Kaam – SkillSwap Pakistan -frontend`):

```env
REACT_APP_API_URL=http://localhost:5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Application

**Start Backend:**
```bash
cd "Gadd Kaam – SkillSwap Pakistan _backend"
npm run dev
```

**Start Frontend:**
```bash
cd "Gadd Kaam – SkillSwap Pakistan -frontend"
npm start
```

Both applications will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🎨 Design & UI/UX

Gadd Kaam features a modern, user-friendly interface designed to make skill discovery and exchange effortless. The platform combines a clean layout with intuitive navigation, ensuring a seamless experience for users of all technical backgrounds.

### Key Design Principles:
- **Mobile-First Approach:** Optimized for mobile users with a fully responsive design.
- **Intuitive Navigation:** Easy-to-find menus, clear category organization, and logical user flows.
- **Visual Hierarchy:** Clear emphasis on key actions like searching, browsing, and messaging.
- **Accessibility:** High-contrast text, keyboard navigation support, and ARIA labels.
- **Interactive Feedback:** Visual cues for form validation, loading states, and button interactions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms of the MIT license.

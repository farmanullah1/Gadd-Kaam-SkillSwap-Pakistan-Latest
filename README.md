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
- **Skill Details:** Each skill listing includes a title, detailed description, and price (PKR).

### 👥 Matching & Discovery
- **Skill Matching Algorithm:** Intelligent system to match learners with suitable skill providers based on skills and location.
- **Location-Based Search:** Find skills available in specific cities across Pakistan.
- **Detailed View:** View complete details of any skill offering, including provider information and location.

### 💳 Secure Payments
- **Integrated Payment System:** Seamless and secure payment processing for skill-based transactions.

### 💬 Communication
- **Real-Time Chat:** Built-in messaging system to connect learners with skill providers.
- **Notifications:** Instant notifications for new messages and updates.

### 🔐 Trust & Safety
- **Comprehensive Verification:** Verification through CNIC and email address.
- **Reporting System:** Easy-to-use reporting tool for users to flag inappropriate content or behavior.
- **Moderation Dashboard:** Admin panel to review and manage user reports, ensuring a safe platform.

### 📱 Mobile-First Design
- **Responsive Interface:** Optimized for both desktop and mobile devices.
- **Modern UI/UX:** Clean, intuitive interface with smooth navigation and interactive elements.

## 🏗️ Tech Stack

### ⚙️ Backend
- **Node.js:** Runtime environment for server-side JavaScript.
- **Express.js:** Web framework for building APIs.
- **MongoDB:** NoSQL database for data storage.
- **JWT:** JSON Web Tokens for secure authentication.

### 💻 Frontend
- **React.js:** JavaScript library for building user interfaces.
- **HTML5 & CSS3:** Core web technologies for structure and styling.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Community Server)

## 🏁 Getting Started

Follow these steps to set up and run the project locally.

### 1. Install Dependencies

**Backend:**
```bash
cd d:\Codes\Gadd Kaam – SkillSwap Pakistan\Gadd Kaam – SkillSwap Pakistan _backend
npm install
```

**Frontend:**
```bash
cd d:\Codes\Gadd Kaam – SkillSwap Pakistan\Gadd Kaam – SkillSwap Pakistan -frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory (`Gadd Kaam – SkillSwap Pakistan _backend`) with the following credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_secret_key_here
```

### 3. Run the Application

**Start Backend:**
```bash
npm run dev
```

**Start Frontend:**
```bash
npm start
```

Both applications will start automatically. You can access the platform at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🎨 Design & UI/UX

Gadd Kaam features a modern, user-friendly interface designed to make skill discovery and exchange effortless. The platform combines a clean layout with intuitive navigation, ensuring a seamless experience for users of all technical backgrounds.

### Key Design Principles:
- **Mobile-First Approach:** Optimized for mobile users with a fully responsive design.
- **Intuitive Navigation:** Easy-to-find menus, clear category organization, and logical user flows.
- **Visual Hierarchy:** Clear emphasis on key actions like searching, browsing, and messaging.
- **Accessibility:** High-contrast text, keyboard navigation support, and ARIA labels for screen readers.
- **Interactive Feedback:** Visual cues for form validation, loading states, and button interactions.

### Design Elements:
- **Navigation Bar:** Prominent navigation with links to Home, Marketplace, Women Zone, About Us, Contact, Helpline, and Dashboard.
- **Search Functionality:** Advanced search with filters for categories, location, and pricing.
- **Skill Cards:** Visually appealing cards displaying skill image, title, provider, and price.
- **User Profiles:** Comprehensive profile pages with verified status, skill listings, and contact details.
- **Modern Components:** Utilizes modern UI components like modals, date pickers, and interactive maps.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms of the MIT license.

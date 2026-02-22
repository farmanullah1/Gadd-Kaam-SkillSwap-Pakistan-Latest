// skillswap-pakistan-frontend/src/index.js

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// Import modular CSS files
import './styles/global.css';
import './styles/navbar.css';
import './styles/homepage.css';
import './styles/forms.css';
import './styles/footer.css';
import './styles/popup.css';
import './styles/dashboard.css';
import './styles/profile.css';
import './styles/offer-skill.css';
import './styles/my-skills.css';
import './styles/marketplace.css';
import './styles/WomenOnlyZonePage.css';
import './styles/LoadingSpinner.css';
import './styles/chatbot-modal.css'; 
import './styles/requests.css';
import './styles/reviews.css';
import './styles/admin.css';

// Import all your components
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import OfferSkillPage from './components/OfferSkillPage';
import MySkillPage from './components/MySkillPage';
import MarketplacePage from './components/MarketplacePage';
import WomenOnlyZonePage from './components/WomenOnlyZonePage';
import ReceivedRequestsPage from './components/ReceivedRequestsPage';
import MessagesPage from './components/MessagesPage';
import ReviewsPage from './components/ReviewsPage';

// Content Pages
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import FAQPage from './components/FAQPage';
import DisputeResolutionPage from './components/DisputeResolutionPage';
// ✅ New Legal Pages Imports
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageSkills from './components/admin/ManageSkills';
import ManageReports from './components/admin/ManageReports';
import AdminRoute from './components/AdminRoute';

// Chatbot
import ChatbotModal from './components/ChatbotModal';

import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const RootApp = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/signup" element={<SignupPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/login" element={<LoginPage onChatbotToggle={toggleChatbot} />} />
          
          {/* Content Pages */}
          <Route path="/about-us" element={<AboutUsPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/about" element={<AboutUsPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/contact-us" element={<ContactUsPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/contact" element={<ContactUsPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/faq-page" element={<FAQPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dispute-resolution-page" element={<DisputeResolutionPage onChatbotToggle={toggleChatbot} />} />
          
          {/* ✅ Legal Pages Routes (Updated) */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage onChatbotToggle={toggleChatbot} />} />
          
          <Route path="/forgot-password" element={<LoginPage onChatbotToggle={toggleChatbot} />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/profile" element={<ProfilePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/my-skills" element={<MySkillPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/offer-skill" element={<OfferSkillPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/marketplace" element={<MarketplacePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/women-zone" element={<WomenOnlyZonePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/received-requests" element={<ReceivedRequestsPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/messages" element={<MessagesPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/reviews" element={<ReviewsPage onChatbotToggle={toggleChatbot} />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="reports" element={<ManageReports />} />
          </Route>
        </Routes>

        {/* Chatbot overlay */}
        {showChatbot && <ChatbotModal onClose={toggleChatbot} />}
      </BrowserRouter>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootApp />);
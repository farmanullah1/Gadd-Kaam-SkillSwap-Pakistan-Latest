// skillswap-pakistan-frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. All CSS is managed through the Tailwind CSS v4 pipeline in index.css
import './index.css';


// 2. Import core/guards (eagerly imported since they are lightweight or critical)
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotModal from './components/ChatbotModal';
import LoadingSpinner from './components/LoadingSpinner';
import './i18n';

// 3. Lazy loaded route components from pages/ directory
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const OfferSkillPage = React.lazy(() => import('./pages/OfferSkillPage'));
const MySkillPage = React.lazy(() => import('./pages/MySkillPage'));
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage'));
const WomenOnlyZonePage = React.lazy(() => import('./pages/WomenOnlyZonePage'));
const ReceivedRequestsPage = React.lazy(() => import('./pages/ReceivedRequestsPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const ReviewsPage = React.lazy(() => import('./pages/ReviewsPage'));

// Content Pages
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = React.lazy(() => import('./pages/ContactUsPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const DisputeResolutionPage = React.lazy(() => import('./pages/DisputeResolutionPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage'));
const SafetyTipsPage = React.lazy(() => import('./pages/SafetyTipsPage'));
const SuccessStoriesPage = React.lazy(() => import('./pages/SuccessStoriesPage'));
const CommunityLeaderboardPage = React.lazy(() => import('./pages/CommunityLeaderboardPage'));
const HelpCenterPage = React.lazy(() => import('./pages/HelpCenterPage'));
const BarterStoriesPage = React.lazy(() => import('./pages/BarterStoriesPage'));
const PlatformStatusPage = React.lazy(() => import('./pages/PlatformStatusPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const PartnersPage = React.lazy(() => import('./pages/PartnersPage'));
const SurveyPage = React.lazy(() => import('./pages/SurveyPage'));
const ResponsiveLayoutPage = React.lazy(() => import('./pages/ResponsiveLayoutPage'));

// Admin Components
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers'));
const ManageSkills = React.lazy(() => import('./pages/admin/ManageSkills'));
const ManageReports = React.lazy(() => import('./pages/admin/ManageReports'));

function App() {
  // Global States
  const [showChatbot, setShowChatbot] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle handlers
  const toggleChatbot = () => setShowChatbot(prev => !prev);

  // Effect to set initial theme based on localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Effect to apply/remove dark mode class and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Decoupled listener to receive theme toggles from other components like Navbar
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && (e.detail === 'dark' || e.detail === 'light')) {
        setIsDarkMode(e.detail === 'dark');
      }
    };
    window.addEventListener('theme_changed', handleThemeChange);
    return () => window.removeEventListener('theme_changed', handleThemeChange);
  }, []);

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <BrowserRouter>
        <React.Suspense fallback={<div className="suspense-loading-container"><LoadingSpinner /></div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/home" element={<HomePage onChatbotToggle={toggleChatbot} />} />
            <Route path="/signup" element={<SignupPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/login" element={<LoginPage onChatbotToggle={toggleChatbot} />} />
            
            {/* Content Pages */}
            <Route path="/about-us" element={<AboutUsPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/about" element={<AboutUsPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/contact-us" element={<ContactUsPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/contact" element={<ContactUsPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/faq-page" element={<FAQPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/dispute-resolution-page" element={<DisputeResolutionPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/how-it-works" element={<HowItWorksPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/safety-tips" element={<SafetyTipsPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/success-stories" element={<SuccessStoriesPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/leaderboard" element={<CommunityLeaderboardPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/support" element={<HelpCenterPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/stories" element={<BarterStoriesPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/status" element={<PlatformStatusPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/careers" element={<CareersPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/blog" element={<BlogPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/partners" element={<PartnersPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/survey" element={<SurveyPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/responsive-layout" element={<ResponsiveLayoutPage onChatbotToggle={toggleChatbot} />} />
            
            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage onChatbotToggle={toggleChatbot} />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage onChatbotToggle={toggleChatbot} />} />
            <Route path="/forgot-password" element={<LoginPage onChatbotToggle={toggleChatbot} />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/dashboard/my-skills" element={<ProtectedRoute><MySkillPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/offer-skill" element={<ProtectedRoute><OfferSkillPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/women-zone" element={<ProtectedRoute><WomenOnlyZonePage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/dashboard/received-requests" element={<ProtectedRoute><ReceivedRequestsPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />
            <Route path="/dashboard/reviews" element={<ProtectedRoute><ReviewsPage onChatbotToggle={toggleChatbot} /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="reports" element={<ManageReports />} />
            </Route>

            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFoundPage onChatbotToggle={toggleChatbot} />} />
          </Routes>
        </React.Suspense>

        {/* Global Chatbot overlay */}
        {showChatbot && <ChatbotModal onClose={toggleChatbot} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
// skillswap-pakistan-frontend/src/App.js

import React, { useState, useEffect } from 'react';
// No need to import ChatbotModal directly here if it's managed by index.js
// If App.js directly manages ChatbotModal, then you would import it:
// import ChatbotModal from './components/ChatbotModal';

import '../styles/global.css'; // Your global styles
// Note: chatbot-modal.css is imported within ChatbotModal.js now

// Main App component, responsible for overall layout and chatbot toggle
function App() {
    // State to control chatbot modal visibility
    // If index.js is managing this, you might receive it as a prop
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    // State to control dark/light mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to set initial theme based on localStorage or system preference
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

    // Effect to apply/remove dark mode class to body and save preference to localStorage
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Function to toggle between dark and light mode
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <div className={`home-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Header section with app title and theme toggle */}
            <header className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center transition-colors duration-300">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My App</h1>
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 rounded-full bg-blue-500 text-white dark:bg-purple-600 hover:opacity-80 transition-opacity duration-300"
                >
                    Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
            </header>

            {/* Main content area */}
            <main className="flex-grow p-8">
                <section className="section-container">
                    <h2 className="section-title">Welcome to SkillSwap Pakistan</h2>
                    <p className="section-subtitle">
                        Your platform for local services. Click the button below to chat with our AI assistant.
                    </p>
                    <div className="flex justify-center mt-8">
                        {/* Button to open the chatbot modal */}
                        <button
                            onClick={() => setIsChatbotOpen(true)} // This will open the chatbot
                            className="btn btn-primary-orange"
                        >
                            Open AI Assistant
                        </button>
                    </div>
                </section>
            </main>

            {/*
                Important: If App.js is the root component rendered by index.js:
                Then you would render ChatbotModal here directly like this:
                {isChatbotOpen && <ChatbotModal onClose={() => setIsChatbotOpen(false)} />}
                However, your index.js suggests RootApp handles global state and routes,
                so we'll modify index.js next. This App.js can remain as a standard page component.
            */}
        </div>
    );
}

export default App;
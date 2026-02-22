// gadd_kaam_backend/mockChatbotServer.js
const express = require('express');
const cors = require('cors'); // Required for cross-origin requests from your frontend
const app = express();
const PORT = 3001; // Choose a port that isn't already in use (e.g., 3000 for React, 5000 for your backend API)

// Enable CORS for all origins during local development
// In a production environment, you would restrict this to your frontend's domain
app.use(cors());
// Middleware to parse JSON bodies from requests
app.use(express.json());

// This is the endpoint that your frontend's ChatbotModal will call
app.post('/mock-gemini-chat', (req, res) => {
    console.log('Received request on mock server:', req.body);

    // Simulate an AI response
    const mockResponse = {
        candidates: [{
            content: {
                parts: [{
                    text: "Hello! This is a mock AI response from your local server. How can I help you today?"
                }]
            }
        }]
    };

    // Simulate a slight delay for a more realistic AI response time
    setTimeout(() => {
        res.json(mockResponse);
    }, 500); // Respond after 0.5 seconds
});

// Start the mock server
app.listen(PORT, () => {
    console.log(`Mock Chatbot Server running on http://localhost:${PORT}`);
    console.log('You can now point your frontend chatbot to this URL for local testing.');
});


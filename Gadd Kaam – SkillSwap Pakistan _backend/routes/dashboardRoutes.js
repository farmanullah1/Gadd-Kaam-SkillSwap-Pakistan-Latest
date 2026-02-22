const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillOffer = require('../models/SkillOffer');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const Review = require('../models/Review');

// @route   GET /api/dashboard/stats
// @desc    Get user dashboard statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Count Skills Offered
        const skillsOfferedCount = await SkillOffer.countDocuments({ user: userId });

        // 2. Count Skills Received/Swapped (Completed requests)
        const skillsReceivedCount = await Request.countDocuments({
            $or: [{ sender: userId }, { receiver: userId }],
            status: 'completed'
        });

        // 3. Count Pending Requests (Requests waiting for user's action)
        const pendingRequestsCount = await Request.countDocuments({
            receiver: userId,
            status: 'pending'
        });

        // 4. Count Unread Notifications (Proxy for unread messages/alerts)
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        // 5. Calculate Average Rating
        const reviews = await Review.find({ reviewedFor: userId });
        let averageRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = (sum / reviews.length).toFixed(1); // One decimal place
        }

        res.json({
            skillsOffered: skillsOfferedCount,
            skillsReceived: skillsReceivedCount,
            pendingRequests: pendingRequestsCount,
            unreadNotifications: unreadCount,
            averageRating: averageRating,
            totalReviews: reviews.length
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
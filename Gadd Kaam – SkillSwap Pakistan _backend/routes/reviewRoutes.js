const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { awardBadge } = require('../utils/badgeUtils'); // ✅ Import Badge Utils

// ✅ Helper
const createNotification = async (recipientId, senderId, type, referenceId, text) => {
    try {
        if (recipientId.toString() === senderId.toString()) return; 
        const newNotification = new Notification({
            recipient: recipientId, sender: senderId, type, referenceId, text
        });
        await newNotification.save();
    } catch (err) { console.error('Notification failed:', err.message); }
};

// @route   POST /api/reviews
router.post(
  '/',
  auth,
  [
    check('requestId', 'Request ID is required').not().isEmpty(),
    check('rating', 'Rating is required (1-5)').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { requestId, rating, comment, endorsedSkills } = req.body;
    const reviewerId = req.user.id;

    try {
      const request = await Request.findById(requestId);
      if (!request) return res.status(404).json({ msg: 'Request not found' });
      if (request.status !== 'completed') return res.status(400).json({ msg: 'Exchange not completed.' });

      let reviewedForId;
      if (request.sender.toString() === reviewerId) reviewedForId = request.receiver;
      else if (request.receiver.toString() === reviewerId) reviewedForId = request.sender;
      else return res.status(401).json({ msg: 'Not a participant.' });

      const existingReview = await Review.findOne({ reviewer: reviewerId, requestId: requestId });
      if (existingReview) return res.status(400).json({ msg: 'Review already submitted.' });

      const newReview = new Review({
        reviewer: reviewerId,
        reviewedFor: reviewedForId,
        skillOffer: request.skillOffer,
        requestId: requestId,
        rating,
        comment,
        endorsedSkills: endorsedSkills || [],
      });

      await newReview.save();

      // ✅ TRIGGER NOTIFICATION: Review Received
      const reviewerUser = await User.findById(reviewerId);
      await createNotification(
          reviewedForId,
          reviewerId,
          'review_received',
          requestId,
          `${reviewerUser.username} left you a ${rating}-star review!`
      );

      // ✅ CHECK & AWARD "TOP RATED" BADGE
      // Calculate new average rating for the user
      const allReviews = await Review.find({ reviewedFor: reviewedForId });
      const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      // Criteria: At least 5 reviews and > 4.5 average
      if (allReviews.length >= 5 && avgRating >= 4.5) {
          try {
             await awardBadge(reviewedForId, 'Top Rated');
          } catch (bErr) {
             console.error("Badge Award Error (Top Rated):", bErr);
          }
      }

      res.status(201).json({ msg: 'Review submitted successfully!', review: newReview });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ... (GET routes remain the same)
router.get('/received', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedFor: req.user.id })
      .populate('reviewer', ['username', 'profilePicture'])
      .populate('skillOffer', ['skills'])
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/pending', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const completedRequests = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'completed',
    })
    .populate('sender', ['username', 'profilePicture', 'id', 'firstName', 'lastName'])
    .populate('receiver', ['username', 'profilePicture', 'id', 'firstName', 'lastName'])
    .populate('skillOffer', ['skills']);

    const pendingReviews = [];
    for (const req of completedRequests) {
      const existingReview = await Review.findOne({ reviewer: userId, requestId: req._id });

      if (!existingReview) {
        pendingReviews.push({
          requestId: req._id,
          skillOffer: req.skillOffer,
          skillRequested: req.skillRequested,
          sender: req.sender,
          receiver: req.receiver,
          isCurrentUserSenderOfRequest: req.sender._id.toString() === userId,
          updatedAt: req.updatedAt
        });
      }
    }
    res.json(pendingReviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
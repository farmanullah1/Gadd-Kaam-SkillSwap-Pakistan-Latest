const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillOffer',
    required: false,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
    // REMOVED unique: true from here
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  endorsedSkills: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIX: Create a compound index so a user can only review a request ONCE,
// but the request itself can have multiple reviews (from different people).
ReviewSchema.index({ requestId: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
// gadd_kaam_backend/models/Badge.js
const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Store Lucide icon name (e.g., "Award", "CheckCircle")
    required: true,
  },
  criteriaType: { // e.g., 'skill_exchanges_completed', 'skill_offers_made', 'endorsements_received'
    type: String,
    required: true,
    enum: ['skill_exchanges_completed', 'skill_offers_made', 'endorsements_received'], // Enforce allowed types
  },
  criteriaValue: { // The numeric value required to earn the badge
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Badge || mongoose.model('Badge', BadgeSchema);
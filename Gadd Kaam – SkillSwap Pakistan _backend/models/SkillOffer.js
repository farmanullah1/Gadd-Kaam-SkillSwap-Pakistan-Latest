// gadd_kaam_backend/models/SkillOffer.js
const mongoose = require('mongoose');

const SkillOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this offer to a User model
    required: true,
  },
  skills: {
    type: [String], // Array of strings for skills offered
    required: true,
  },
  photo: {
    type: String, // Path to the uploaded photo
    required: false, // Optional photo
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  // REMOVED: username, phoneNumber - These will be populated from the User model
  location: {
    type: String,
    required: true,
  },
  remotely: {
    type: Boolean,
    default: false,
  },
  anonymous: { // This flag controls frontend display of username/phone
    type: Boolean,
    default: false,
  },
  shareWithWomenZone: { // For filtering skills in the women-only zone
    type: Boolean,
    default: false,
  },
  skillsToSwap: {
    type: [String], // Array of strings for skills user wants to learn
    required: false, // Optional
  },
  date: { // Timestamp for the offer creation
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.SkillOffer || mongoose.model('SkillOffer', SkillOfferSchema);
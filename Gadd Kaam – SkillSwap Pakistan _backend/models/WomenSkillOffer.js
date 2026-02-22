const mongoose = require("mongoose");

const WomenSkillOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: {
    type: [String], // Array of skills
    required: true,
  },
  photo: {
    type: String, // File path
    required: false,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    required: true,
  },
  remotely: {
    type: Boolean,
    default: false,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  skillsToSwap: {
    type: [String],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Always use same export style to avoid overwrite issues
module.exports =
  mongoose.models.WomenSkillOffer ||
  mongoose.model("WomenSkillOffer", WomenSkillOfferSchema);

// routes/skillSuggestionRoutes.js
const express = require('express');
const router = express.Router(); // CORRECTED: This line must be 'const router = express.Router();'
const { check, validationResult } = require('express-validator');
const SkillSuggestion = require('../models/SkillSuggestion');
const auth = require('../middleware/auth'); // Assuming skill suggestions require auth

// @route   POST /api/skill-suggestions
// @desc    Add a new skill suggestion
// @access  Private
router.post(
  '/',
  auth,
  [
    check('skillName', 'Skill name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skillName } = req.body;

    try {
      let skillSuggestion = await SkillSuggestion.findOne({ skillName: skillName.toLowerCase() });

      if (skillSuggestion) {
        // If skill exists, increment the suggestion count
        skillSuggestion.suggestionCount++;
        skillSuggestion.lastSuggested = Date.now();
        await skillSuggestion.save();
        return res.status(200).json(skillSuggestion);
      } else {
        // If skill doesn't exist, create a new one
        skillSuggestion = new SkillSuggestion({
          skillName: skillName.toLowerCase(),
        });
        await skillSuggestion.save();
        return res.status(201).json(skillSuggestion);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/skill-suggestions
// @desc    Get all skill suggestions
// @access  Public (or Private, depending on app logic)
router.get('/', async (req, res) => {
  try {
    const suggestions = await SkillSuggestion.find().sort({ suggestionCount: -1 });
    res.json(suggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
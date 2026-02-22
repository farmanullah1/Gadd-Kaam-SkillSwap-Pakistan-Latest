// gadd_kaam_backend/routes/badgeRoutes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth'); // Assuming badge management requires authentication (e.g., admin)
const Badge = require('../models/Badge');

// @route   POST /api/badges/define
// @desc    Define a new badge (e.g., by an admin or initial setup script)
// @access  Private (Admin/Internal) - You might want more granular role-based auth here
router.post(
  '/define',
  auth, // Ensure only authenticated users (e.g., admins) can define badges
  [
    check('name', 'Badge name is required').not().isEmpty(),
    check('description', 'Badge description is required').not().isEmpty(),
    check('icon', 'Badge icon is required').not().isEmpty(),
    check('criteriaType', 'Badge criteria type is required').not().isEmpty(),
    check('criteriaValue', 'Badge criteria value is required and must be a number').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, icon, criteriaType, criteriaValue } = req.body;

    try {
      let badge = await Badge.findOne({ name: name });

      if (badge) {
        return res.status(400).json({ msg: 'Badge with this name already exists' });
      }

      badge = new Badge({
        name,
        description,
        icon,
        criteriaType,
        criteriaValue,
      });

      await badge.save();
      res.status(201).json(badge);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/badges
// @desc    Get all defined badges
// @access  Public (or Private, depending on whether you want to show all possible badges)
router.get('/', auth, async (req, res) => { // Adding auth for consistency, can be removed if public
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
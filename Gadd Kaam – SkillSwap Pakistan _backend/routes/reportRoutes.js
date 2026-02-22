// gadd_kaam_backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   POST api/reports
// @desc    Create a new report
// @access  Private
router.post(
  '/',
  auth,
  [
    check('reportedUserId', 'Reported User ID is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportedUserId, description, requestId } = req.body;

    try {
      // Prevent self-reporting
      if (req.user.id === reportedUserId) {
        return res.status(400).json({ msg: 'You cannot report yourself.' });
      }

      // Check if reported user exists
      const reportedUser = await User.findById(reportedUserId);
      if (!reportedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const newReport = new Report({
        reporter: req.user.id,
        reportedUser: reportedUserId,
        description,
        requestId: requestId || null, // Optional chat context
      });

      const report = await newReport.save();
      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
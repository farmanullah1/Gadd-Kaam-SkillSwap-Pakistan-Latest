// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const User = require('../models/User');
const keys = require('../config/keys');
const path = require('path');
const fs = require('fs');

const generateToken = (id, role) => {
  return jwt.sign({ user: { id, role } }, keys.jwtSecret, { expiresIn: '7d' });
};

// ✅ Helper: Delete uploaded files if validation fails
const cleanupFiles = (files) => {
  if (files) {
    Object.values(files).forEach(fileArray => {
      fileArray.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
          });
        }
      });
    });
  }
};

// @route   POST api/auth/register
router.post('/register', (req, res, next) => {
  // Wrap upload to catch Multer errors (like file too large > 10MB)
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ errors: [{ msg: `Upload Error: ${err.message}` }] });
    }
    next();
  });
}, [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty().isLength({ min: 3 }),
    check('email', 'Please include a valid email').isEmail(),
    check('phoneNumber', 'Phone Number is required').not().isEmpty(),
    check('dateOfBirth', 'Date of Birth is required').not().isEmpty(),
    check('cnicNumber', 'Valid CNIC is required (e.g., 12345-1234567-1)').matches(/^\d{5}-\d{7}-\d{1}$/),
    check('gender', 'Gender is required').isIn(['Male', 'Female']),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('confirmPassword', 'Confirm Password is required').not().isEmpty(),
], async (req, res) => {
    
    // 1. Check Express Validation Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      cleanupFiles(req.files);
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, username, phoneNumber, email, dateOfBirth, cnicNumber, gender, password, confirmPassword } = req.body;

    // 2. Check Password Match
    if (password !== confirmPassword) {
      cleanupFiles(req.files);
      return res.status(400).json({ errors: [{ msg: 'Passwords do not match' }] });
    }

    // 3. ✅ Custom File Size Validation
    const MIN_SIZE = 100 * 1024; // 100KB
    const MAX_PROFILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_CNIC_SIZE = 6 * 1024 * 1024; // 6MB

    if (req.files) {
      // Validate Profile Picture (100KB - 10MB)
      if (req.files['profilePicture']) {
        const file = req.files['profilePicture'][0];
        if (file.size < MIN_SIZE || file.size > MAX_PROFILE_SIZE) {
          cleanupFiles(req.files);
          return res.status(400).json({ errors: [{ msg: `Profile Picture must be between 100KB and 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` }] });
        }
      }

      // Validate CNIC Front (100KB - 6MB)
      if (req.files['cnicFrontPicture']) {
        const file = req.files['cnicFrontPicture'][0];
        if (file.size < MIN_SIZE || file.size > MAX_CNIC_SIZE) {
          cleanupFiles(req.files);
          return res.status(400).json({ errors: [{ msg: `CNIC Front must be between 100KB and 6MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` }] });
        }
      }

      // Validate CNIC Back (100KB - 6MB)
      if (req.files['cnicBackPicture']) {
        const file = req.files['cnicBackPicture'][0];
        if (file.size < MIN_SIZE || file.size > MAX_CNIC_SIZE) {
          cleanupFiles(req.files);
          return res.status(400).json({ errors: [{ msg: `CNIC Back must be between 100KB and 6MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` }] });
        }
      }
    }

    try {
      // 4. Check Duplicate User
      let user = await User.findOne({ $or: [{ username }, { email }, { cnicNumber }] });
      if (user) {
        cleanupFiles(req.files);
        return res.status(400).json({ errors: [{ msg: 'User with these credentials (Email, Username, or CNIC) already exists' }] });
      }

      // 5. Prepare File Paths (Normalize for Windows/Linux)
      const normalizePath = (file) => file.path.replace(/\\/g, "/");

      const profilePicturePath = req.files?.['profilePicture'] ? normalizePath(req.files['profilePicture'][0]) : undefined;
      const cnicFrontPicturePath = req.files?.['cnicFrontPicture'] ? normalizePath(req.files['cnicFrontPicture'][0]) : undefined;
      const cnicBackPicturePath = req.files?.['cnicBackPicture'] ? normalizePath(req.files['cnicBackPicture'][0]) : undefined;

      // 6. Create User
      user = new User({
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        dateOfBirth,
        cnicNumber,
        gender,
        password,
        profilePicture: profilePicturePath,
        cnicFrontPicture: cnicFrontPicturePath,
        cnicBackPicture: cnicBackPicturePath,
        role: 'user'
      });

      await user.save();

      const token = generateToken(user.id, user.role);

      res.status(201).json({
        msg: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role
        }
      });

    } catch (err) {
      console.error("Signup Server Error:", err.message);
      cleanupFiles(req.files);
      res.status(500).send('Server Error');
    }
});

// Login Route (Unchanged logic, just ensure imports match)
router.post('/login', [
    check('credential', 'Credential is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { credential, password } = req.body;
    try {
      const user = await User.findOne({
        $or: [{ username: credential.toLowerCase() }, { email: credential.toLowerCase() }, { cnicNumber: credential }],
      });

      if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

      if (user.isBanned) return res.status(403).json({ msg: 'Your account has been banned. Contact support.' });

      const token = generateToken(user.id, user.role);

      res.status(200).json({
        msg: 'Logged in successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
// gadd_kaam_backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @route   GET /api/profile/me
// @desc    Get current user profile (including badges)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password') // Exclude password
            .populate('badges'); // ✅ Populate badges to show icons/descriptions

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/update
// @desc    Update user profile details
// @access  Private
router.put('/update', auth, upload, async (req, res) => {
    try {
        const userId = req.user.id;
        const { location, aboutMe } = req.body;
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Update user fields
        user.location = location;
        user.aboutMe = aboutMe;
        
        if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
            const newProfilePictureFile = req.files['profilePicture'][0];
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            
            const newFilename = `profile_picture_${user.username}_${Date.now()}${path.extname(newProfilePictureFile.originalname)}`;
            const newPath = path.join(uploadsDir, newFilename);
            
            if (user.profilePicture) {
                const oldPath = path.join(__dirname, '..', user.profilePicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error('Error deleting old profile picture:', err);
                    });
                }
            }
            
            fs.renameSync(newProfilePictureFile.path, newPath);
            user.profilePicture = `uploads/${newFilename}`;
        }
        
        await user.save();
        
        // Return updated user data (populated)
        // We re-fetch or just return fields, but re-fetching ensures badges populate if needed later
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            location: user.location,
            aboutMe: user.aboutMe,
            profilePicture: user.profilePicture
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
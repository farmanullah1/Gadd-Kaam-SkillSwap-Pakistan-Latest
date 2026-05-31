// gadd_kaam_backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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

// @route   PUT /api/profile/security/email
// @desc    Update email with password verification
// @access  Private
router.put('/security/email', auth, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter new email and your password' });
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password. Cannot change email.' });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists && emailExists.id !== req.user.id) {
            return res.status(400).json({ msg: 'Email is already in use by another user' });
        }

        user.email = email.toLowerCase();
        await user.save();

        res.json({
            msg: 'Email updated successfully',
            email: user.email
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/security/password
// @desc    Update password securely
// @access  Private
router.put('/security/password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please enter old and new passwords' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid current password' });
        }

        user.password = newPassword; // Hashed inside pre-save middleware
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/security/phone
// @desc    Update phone number
// @access  Private
router.put('/security/phone', auth, async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ msg: 'Phone number is required' });
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if phone already in use
        const phoneExists = await User.findOne({ phoneNumber });
        if (phoneExists && phoneExists.id !== req.user.id) {
            return res.status(400).json({ msg: 'Phone number already in use by another user' });
        }

        user.phoneNumber = phoneNumber;
        await user.save();

        res.json({
            msg: 'Phone number updated successfully',
            phoneNumber: user.phoneNumber
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profile/security/cnic
// @desc    Update CNIC number and upload files
// @access  Private
router.put('/security/cnic', auth, upload, async (req, res) => {
    const { cnicNumber } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Validate format if updating CNIC number
        if (cnicNumber) {
            if (!/^\d{5}-\d{7}-\d{1}$/.test(cnicNumber)) {
                return res.status(400).json({ msg: 'Valid CNIC format is required (e.g., 12345-1234567-1)' });
            }

            const cnicHash = crypto.createHash('sha256').update(cnicNumber).digest('hex');
            const cnicExists = await User.findOne({ cnicHash });
            if (cnicExists && cnicExists.id !== req.user.id) {
                return res.status(400).json({ msg: 'CNIC number is already registered by another user' });
            }

            user.cnicNumber = cnicNumber;
        }

        const normalizePath = (file) => file.path.replace(/\\/g, "/");

        // Front picture update
        if (req.files && req.files['cnicFrontPicture'] && req.files['cnicFrontPicture'][0]) {
            const frontFile = req.files['cnicFrontPicture'][0];
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            const frontFilename = `cnic_front_${user.username}_${Date.now()}${path.extname(frontFile.originalname)}`;
            const frontPath = path.join(uploadsDir, frontFilename);

            if (user.cnicFrontPicture) {
                const oldPath = path.join(__dirname, '..', user.cnicFrontPicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error('Error deleting old cnic front picture:', err);
                    });
                }
            }
            fs.renameSync(frontFile.path, frontPath);
            user.cnicFrontPicture = `uploads/${frontFilename}`;
        }

        // Back picture update
        if (req.files && req.files['cnicBackPicture'] && req.files['cnicBackPicture'][0]) {
            const backFile = req.files['cnicBackPicture'][0];
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            const backFilename = `cnic_back_${user.username}_${Date.now()}${path.extname(backFile.originalname)}`;
            const backPath = path.join(uploadsDir, backFilename);

            if (user.cnicBackPicture) {
                const oldPath = path.join(__dirname, '..', user.cnicBackPicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error('Error deleting old cnic back picture:', err);
                    });
                }
            }
            fs.renameSync(backFile.path, backPath);
            user.cnicBackPicture = `uploads/${backFilename}`;
        }

        await user.save();

        res.json({
            msg: 'CNIC credentials updated successfully',
            cnicNumber: user.cnicNumber,
            cnicFrontPicture: user.cnicFrontPicture,
            cnicBackPicture: user.cnicBackPicture
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/profile/security/delete
// @desc    Delete account after password verification
// @access  Private
router.delete('/security/delete', auth, async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ msg: 'Please provide password to verify account deletion' });
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password. Account cannot be deleted.' });
        }

        // Clean up files (profile picture, cnic images)
        const deleteFile = (filePath) => {
            if (filePath) {
                const fullPath = path.join(__dirname, '..', filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
        };

        deleteFile(user.profilePicture);
        deleteFile(user.cnicFrontPicture);
        deleteFile(user.cnicBackPicture);

        // Delete user
        await User.findByIdAndDelete(req.user.id);

        res.json({ msg: 'Your account has been deleted permanently' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
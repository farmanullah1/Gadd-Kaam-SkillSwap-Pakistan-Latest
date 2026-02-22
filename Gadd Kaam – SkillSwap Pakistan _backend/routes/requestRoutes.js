const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Request = require('../models/Request');
const User = require('../models/User'); 
const SkillOffer = require('../models/SkillOffer'); 
const Notification = require('../models/Notification');
const { check, validationResult } = require('express-validator');
const { awardBadge } = require('../utils/badgeUtils'); // ✅ Import Badge Utils

// ✅ Helper function to create notifications safely
const createNotification = async (recipientId, senderId, type, referenceId, text) => {
    try {
        if (recipientId.toString() === senderId.toString()) return; 
        
        const newNotification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            referenceId,
            text
        });
        await newNotification.save();
    } catch (err) {
        console.error('Notification creation failed:', err.message);
    }
};

// @route   POST api/requests
// @desc    Send a skill swap request
router.post('/', auth, [
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('skillOfferId', 'Skill Offer ID is required').not().isEmpty(),
    check('skillRequested', 'Skill you are offering in return is required').not().isEmpty(),
    check('message', 'Initial message is required').not().isEmpty(),
    check('isRemote', 'Remote status is required').isBoolean(),
    check('location', 'Location must be a string if provided').optional({ nullable: true }).isString(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { receiverId, skillOfferId, skillRequested, message, isRemote, location } = req.body;
    const senderId = req.user.id;

    if (!isRemote && (!location || location.trim() === '')) {
        return res.status(400).json({ msg: 'Location is required for non-remote requests.' });
    }

    try {
        if (senderId === receiverId) return res.status(400).json({ msg: 'Cannot send a request to yourself' });

        const skillOffer = await SkillOffer.findById(skillOfferId);
        if (!skillOffer) return res.status(404).json({ msg: 'Skill offer not found' });
        if (skillOffer.user.toString() !== receiverId) return res.status(400).json({ msg: 'Invalid receiver for this skill offer' });

        const existingRequest = await Request.findOne({
            sender: senderId, receiver: receiverId, skillOffer: skillOfferId, status: 'pending',
        });
        if (existingRequest) return res.status(400).json({ msg: 'You have already sent a pending request.' });

        const newRequest = new Request({
            sender: senderId, receiver: receiverId, skillOffer: skillOfferId, skillRequested, message, isRemote,
            location: isRemote ? '' : location
        });

        const request = await newRequest.save();

        // ✅ TRIGGER NOTIFICATION: Request Received
        const senderUser = await User.findById(senderId);
        await createNotification(
            receiverId, 
            senderId, 
            'request_received', 
            request._id, 
            `${senderUser.username} requested your skill: ${skillOffer.skills[0]}`
        );

        const populatedRequest = await Request.findById(request._id)
            .populate('sender', 'username profilePicture')
            .populate('receiver', 'username profilePicture')
            .populate('skillOffer', 'skills');

        res.status(201).json(populatedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requests/received
router.get('/received', auth, async (req, res) => {
    try {
        const requests = await Request.find({ receiver: req.user.id })
            .populate('sender', 'username profilePicture location phoneNumber')
            .populate('skillOffer', 'skills')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requests/sent
router.get('/sent', auth, async (req, res) => {
    try {
        const requests = await Request.find({ sender: req.user.id })
            .populate('receiver', 'username profilePicture location phoneNumber')
            .populate('skillOffer', 'skills')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requests/
router.get('/', auth, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
        .populate('sender', 'username profilePicture location phoneNumber')
        .populate('receiver', 'username profilePicture location phoneNumber')
        .populate('skillOffer', 'skills')
        .sort({ updatedAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/:id/accept
router.post('/:id/accept', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });
        if (request.receiver.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        if (request.status !== 'pending') return res.status(400).json({ msg: 'Request is not pending' });

        request.status = 'accepted';
        await request.save();

        // ✅ TRIGGER NOTIFICATION: Request Accepted
        const accepter = await User.findById(req.user.id);
        await createNotification(
            request.sender, 
            req.user.id, 
            'request_accepted', 
            request._id, 
            `${accepter.username} accepted your skill swap request!`
        );

        const populatedRequest = await Request.findById(request._id)
            .populate('sender', 'username profilePicture location phoneNumber')
            .populate('receiver', 'username profilePicture location phoneNumber')
            .populate('skillOffer', 'skills');

        res.json(populatedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/:id/cancel
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });
        if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        request.status = 'cancelled';
        await request.save();

        // ✅ TRIGGER NOTIFICATION: Request Cancelled
        const recipient = request.sender.toString() === req.user.id ? request.receiver : request.sender;
        const canceller = await User.findById(req.user.id);
        
        await createNotification(
            recipient,
            req.user.id,
            'request_cancelled',
            request._id,
            `${canceller.username} cancelled the skill request.`
        );

        res.json({ msg: 'Request cancelled successfully', request });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/:id/confirm-skill-received
router.post('/:id/confirm-skill-received', auth, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        const userId = req.user.id;
        if (request.status !== 'accepted') return res.status(400).json({ msg: 'Skill can only be confirmed for accepted requests.' });

        let updated = false;
        if (request.sender.toString() === userId) {
            if (request.senderConfirmedReceived) return res.status(400).json({ msg: 'Already confirmed.' });
            request.senderConfirmedReceived = true;
            updated = true;
        } else if (request.receiver.toString() === userId) {
            if (request.receiverConfirmedReceived) return res.status(400).json({ msg: 'Already confirmed.' });
            request.receiverConfirmedReceived = true;
            updated = true;
        } else {
            return res.status(401).json({ msg: 'Not authorized.' });
        }

        if (updated) {
            if (request.senderConfirmedReceived && request.receiverConfirmedReceived) {
                request.status = 'completed';
                
                // ✅ AWARD BADGES for completing a swap
                try {
                    await awardBadge(request.sender, 'First Swap');
                    await awardBadge(request.receiver, 'First Swap');
                } catch (bErr) {
                    console.error("Badge Award Error:", bErr);
                }
            }
            await request.save();

            // ✅ TRIGGER NOTIFICATION: Skill Confirmed
            const otherPersonId = request.sender.toString() === userId ? request.receiver : request.sender;
            const confirmer = await User.findById(userId);
            
            await createNotification(
                otherPersonId,
                userId,
                'skill_confirmed',
                request._id,
                `${confirmer.username} confirmed they received the skill.`
            );
        }

        const populatedRequest = await Request.findById(request._id)
            .populate('sender', 'username profilePicture location phoneNumber')
            .populate('receiver', 'username profilePicture location phoneNumber')
            .populate('skillOffer', 'skills');

        res.json({ msg: 'Skill received confirmed!', request: populatedRequest });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/requests/:id/messages
router.post('/:id/messages', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Message text is required.' });

    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found.' });

        const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
        if (!isParticipant) return res.status(401).json({ msg: 'Not authorized.' });

        if (request.status === 'completed') return res.status(400).json({ msg: 'Exchange completed. Messages closed.' });

        const newMessage = { sender: req.user.id, text: text, timestamp: new Date() };
        request.messages.push(newMessage);
        await request.save();

        // ✅ TRIGGER NOTIFICATION: New Message
        const recipientId = request.sender.toString() === req.user.id ? request.receiver : request.sender;
        const senderUser = await User.findById(req.user.id);
        
        await createNotification(
            recipientId,
            req.user.id,
            'message',
            request._id,
            `New message from ${senderUser.username}`
        );

        const updatedRequest = await Request.findById(request._id)
            .populate('messages.sender', 'username profilePicture')
            .select('messages');
        const latestMessage = updatedRequest.messages[updatedRequest.messages.length - 1];

        res.status(201).json(latestMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requests/:id/messages
router.get('/:id/messages', auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('messages.sender', 'username profilePicture')
            .select('messages status sender receiver');

        if (!request) return res.status(404).json({ msg: 'Request not found.' });

        const isParticipant = request.sender.toString() === req.user.id || request.receiver.toString() === req.user.id;
        if (!isParticipant) return res.status(401).json({ msg: 'Not authorized.' });

        res.json(request.messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
// gadd_kaam_backend/models/Request.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Message Schema
const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const RequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillOffer: {
        type: Schema.Types.ObjectId,
        ref: 'SkillOffer',
        required: true
    },
    skillRequested: { // The skill the sender wants in return for the swap
        type: String,
        required: true
    },
    message: { // Initial message from sender when creating the request
        type: String,
        required: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    location: { // Only required if isRemote is false
        type: String,
        trim: true,
        default: '' // Can be empty if remote
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },
    senderConfirmedReceived: { // Flag if sender has confirmed skill received
        type: Boolean,
        default: false
    },
    receiverConfirmedReceived: { // Flag if receiver has confirmed skill received
        type: Boolean,
        default: false
    },
    // NEW: Messages array for the chat conversation
    messages: [MessageSchema] // Embed the MessageSchema directly
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);
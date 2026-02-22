const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },
  type: {
    type: String,
    enum: ['request_received', 'request_accepted', 'request_cancelled', 'message', 'review_received', 'skill_confirmed'],
    required: true,
  },
  referenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
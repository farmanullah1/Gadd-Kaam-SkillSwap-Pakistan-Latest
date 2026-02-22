// gadd_kaam_backend/models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Link to the specific conversation (Request)
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: false, 
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'resolved', 'dismissed'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);
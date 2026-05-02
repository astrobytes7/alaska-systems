const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: false },
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now },
  claimedBy: { type: String, default: null },
  claimStatus: { type: String, default: 'unclaimed' },
  closedBy: { type: String, default: null },
  ticketId: { type: String, required: true, unique: true },
  closeReason: { type: String, default: 'Not Provided' },
  aiEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);

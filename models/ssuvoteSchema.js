const mongoose = require('mongoose');

const ssuVoteSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    channelId: { type: String, required: true },
    amountRequired: { type: Number, required: true },
    amount: { type: Number, default: 0 },
    voters: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('SsuVote', ssuVoteSchema);
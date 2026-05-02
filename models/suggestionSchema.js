const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messageId: { type: String, required: true },
    suggestion: { type: String, required: true },
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    status: { type: String, default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);

const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    promotionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    messageId: { type: String, required: true },
    promoterId: { type: String, required: true },
    newRankId: { type: String, required: true },
    reason: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    revokerId: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Promotion', promotionSchema);

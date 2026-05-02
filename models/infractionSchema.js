const mongoose = require('mongoose');

const infractionSchema = new mongoose.Schema({
    infractionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    messageId: { type: String, required: true },
    infracterId: { type: String, required: true },
    punishment: { type: String, required: true },
    reason: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    revokerId: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Infraction', infractionSchema);

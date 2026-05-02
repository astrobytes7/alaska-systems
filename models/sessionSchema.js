const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    status: { type: String, required: true, default: "offline" },
    messageId: { type: String },
    channelId: { type: String },
    messageId2: { type: String },
    channelId2: { type: String },
});

module.exports = mongoose.model("Session", sessionSchema);

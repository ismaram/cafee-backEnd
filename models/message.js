const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true
    },

    recipient: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    read: {
        type: Boolean,
        default: false
    }
});

module.exports = messageSchema;
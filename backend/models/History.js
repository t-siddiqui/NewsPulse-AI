const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    prediction: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    reasons: {
        type: [String],
        default: []
    },
    highlights: {
        type: [String],
        default: []
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

HistorySchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('History', HistorySchema);

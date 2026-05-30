const mongoose = require('mongoose');

const ResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800 // Automatically deletes from DB after 30 minutes (1800 seconds)
    }
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);

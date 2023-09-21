const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const GuestModel = mongoose.model('Guest', guestSchema);

module.exports = GuestModel;
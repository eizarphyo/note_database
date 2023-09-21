const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    uid: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
        maxLength: [40, 'Note title must be less than 40 characters']
    },
    content: {
        type: String,
        trim: true
    },
    bgColor: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

exports.NoteModel = mongoose.model('Note', noteSchema);
exports.GuestNoteModel = mongoose.model('guestnote', noteSchema);

// module.exports = NoteModel;
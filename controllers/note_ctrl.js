const NoteModels = require('../models/note_model');
const ApiFeatures = require('../api_features/api_features');
const AppError = require('../middlewares/app_error');
const catchError = require('../middlewares/catch_error');

const UserNote = NoteModels.NoteModel;
const GuestNote = NoteModels.GuestNoteModel;

// function findWord(word, str) {
//     return RegExp('\\b' + word + '\\b').test(str);
// }

function isGuestRoute(str) {
    return str.includes('guest');
}

exports.postOneNote = catchError(async (req, res, next) => {

    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    const userNote = Object.assign(req.body, { uid: req.user.id });

    const note = await NoteModel.create(userNote);

    res.status(200).json({
        status: 'success',
        note
    });
});

exports.getAllNotes = catchError(async (req, res, next) => {
    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    const features = new ApiFeatures(NoteModel.find(), req.query).filter().sort().select().paginate();
    const notes = await features.query;

    res.status(200).json({
        status: 'success',
        results: notes.length,
        notes
    });
});

exports.getAllNotesByUid = catchError(async (req, res, next) => {
    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    const features = new ApiFeatures(NoteModel.find({ uid: req.user.id }), req.query).filter().sort().select();
    const notes = await features.query;

    res.status(200).json({
        status: 'success',
        results: notes.length,
        notes
    });
});

exports.getOneNoteByNid = catchError(async (req, res, next) => {
    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    const features = new ApiFeatures(NoteModel.findById(req.params.id, req.query));
    const note = await features.query;

    if (!note) return next(new AppError(`No note found with ID: ${req.params.id}`, 404));

    res.status(200).json({
        status: 'success',
        note
    });
});

exports.updateNote = catchError(async (req, res, next) => {
    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    const note = await NoteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!note) return next(new AppError(`No note found with ID: ${req.params.id}`, 404));

    res.status(200).json({
        status: 'success',
        note
    });
});

exports.deleteNote = catchError(async (req, res, next) => {
    const NoteModel = isGuestRoute(req.originalUrl) ? GuestNote : UserNote;

    await NoteModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        note: null
    });
});
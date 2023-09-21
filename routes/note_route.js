const express = require('express');
const noteCtrl = require('../controllers/note_ctrl');
const jwtCtl = require('../middlewares/jwt_token');

const noteRouter = express.Router();
const notesRouter = express.Router();

notesRouter.route('/').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotes);

noteRouter.route('/').post(jwtCtl.checkJwtToken, noteCtrl.postOneNote).get(jwtCtl.checkJwtToken, noteCtrl.getAllNotesByUid);
noteRouter.route('/:id').get(jwtCtl.checkJwtToken, noteCtrl.getOneNoteByNid).patch(jwtCtl.checkJwtToken, noteCtrl.updateNote).delete(jwtCtl.checkJwtToken, noteCtrl.deleteNote);

// noteRouter.route('/').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotes).post(jwtCtl.checkJwtToken, noteCtrl.postOneNote);
// noteRouter.route('/uid/:uid').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotesByUid);
// noteRouter.route('/:id').get(jwtCtl.checkJwtToken, noteCtrl.getOneNoteByNid).patch(jwtCtl.checkJwtToken, noteCtrl.updateNote).delete(jwtCtl.checkJwtToken, noteCtrl.deleteNote);

exports.note = noteRouter;
exports.notes = notesRouter;
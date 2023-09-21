const express = require('express');
const userCtrl = require('../controllers/user_ctrl');
const noteCtrl = require('../controllers/note_ctrl');
const jwtCtl = require('../middlewares/jwt_token');

const guestRouter = express.Router();
const guestsRouter = express.Router();

// get all guests
guestsRouter.route('/').get(jwtCtl.checkJwtToken, userCtrl.getAllGuests);
guestsRouter.route('/notes').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotes);

guestRouter.route('/').post(userCtrl.createGuestUser).get(jwtCtl.checkJwtToken, userCtrl.getOneGuest).delete(jwtCtl.checkJwtToken, userCtrl.deleteGuest);
guestRouter.route('/notes').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotes);

guestRouter.route('/note').post(jwtCtl.checkJwtToken, noteCtrl.postOneNote).get(jwtCtl.checkJwtToken, noteCtrl.getAllNotesByUid);
guestRouter.route('/note/:id').get(jwtCtl.checkJwtToken, noteCtrl.getOneNoteByNid).patch(jwtCtl.checkJwtToken, noteCtrl.updateNote).delete(jwtCtl.checkJwtToken, noteCtrl.deleteNote);

// guestRouter.route('/').post(userCtrl.createGuestUser).get(jwtCtl.checkJwtToken, userCtrl.getAllGuests);
// guestRouter.route('/notes').post(jwtCtl.checkJwtToken, noteCtrl.postOneNote).get(jwtCtl.checkJwtToken, noteCtrl.getAllNotes);
// guestRouter.route('/notes/:id').get(jwtCtl.checkJwtToken, noteCtrl.getOneNoteByNid).patch(jwtCtl.checkJwtToken, noteCtrl.updateNote).delete(noteCtrl.deleteNote);
// guestRouter.route('/:uid/notes').get(jwtCtl.checkJwtToken, noteCtrl.getAllNotesByUid);
// guestRouter.route('/:uid').get(jwtCtl.checkJwtToken, userCtrl.getOneGuest);

exports.guests = guestsRouter;
exports.guest = guestRouter;
const express = require('express');
const userCtrl = require('../controllers/user_ctrl');
const jwtCtl = require('../middlewares/jwt_token');

const userRouter = express.Router();

// userRouter.get('/').get(jwtCtl.checkJwtToken, userCtrl.getAllUsers);
userRouter.route('/').get(jwtCtl.checkJwtToken, userCtrl.getOneUser).patch(jwtCtl.checkJwtToken, userCtrl.updateUser).delete(jwtCtl.checkJwtToken, userCtrl.deleteUser);

// userRouter.route('/').get(jwtCtl.checkJwtToken, userCtrl.getAllUsers);
// userRouter.route('/:id').get(jwtCtl.checkJwtToken, userCtrl.getOneUser).patch(jwtCtl.checkJwtToken, userCtrl.updateUser).delete(jwtCtl.checkJwtToken, userCtrl.deleteUser);

module.exports = userRouter;
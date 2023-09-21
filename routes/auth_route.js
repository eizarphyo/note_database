const express = require('express');
const userCtrl = require('../controllers/user_ctrl');
const passwordCtl = require('../controllers/password_ctl');
const jwtCtl = require('../middlewares/jwt_token');

const authRouter = express.Router();

authRouter.route('/signin').post(userCtrl.userSignIn);
authRouter.route('/signup').post(userCtrl.postOneUser);
authRouter.route('/updatepassword').patch(jwtCtl.checkJwtToken, passwordCtl.updatePassword);
authRouter.route('/forgotpassword').post(passwordCtl.forgotPassword);
authRouter.route('/resetpassword/:token').patch(passwordCtl.resetPassword);

module.exports = authRouter;
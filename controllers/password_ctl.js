const bcrypt = require('bcrypt');
const crypto = require('crypto');
const catchError = require('../middlewares/catch_error');
const AppError = require('../middlewares/app_error');
const User = require('../models/user_model');
const sendMail = require('../api_features/nodemailer');
const jwtCtl = require('../middlewares/jwt_token');

exports.forgotPassword = catchError(async (req, res, next) => {
    if (!req.body.email) return next(new AppError("Must provide an email to reset password", 400));

    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new AppError("No user found with the provided email", 404));

    const resetToken = user.generatePasswordResetToken();
    user.save({ validateBeforeSave: false });

    const protocol = req.protocol;
    const host = req.get('host');
    const link = `${protocol}://${host}/noteapp/v1/auth/resetpassword/${resetToken}`;

    const emailContext = {
        to: user.email,
        subject: "Reset Password (valid for 10 mins)",
        message: `You've requested to reset your password for Note Taker. Please follow this link \n${link}\nIf you didn't request it, please ignore this mail.`
    }

    await sendMail(emailContext);

    res.status(200).json({
        status: 'success',
        resetToken,
        link
    });

});

exports.resetPassword = catchError(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresIn: { $gt: Date.now() }
    });

    if (!user) return next(new AppError("Password reset token expires or invalid", 401));
    // if (!req.body.password) return next(new AppError("Must provide current password to reset it", 401));
    // if (!req.body.new_password) return next(new AppError("Reqiured a new password", 401));

    // const passwordsMatch = await bcrypt.compare(req.body.password, user.password);

    // if (!passwordsMatch) return (new AppError("Wrong password", 401));

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    user.passwordResetAt = Date.now() - 1000;

    await user.save();

    const token = jwtCtl.generateJwtToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        user
    });
});

exports.updatePassword = catchError(async (req, res, next) => {
    if (!req.body.password) return next(new AppError("Must provide current password to change it", 400));
    if (!req.body.new_password) return next(new AppError("Required new password", 400));

    const isPasswordsMatch = await bcrypt.compare(req.body.password, req.user.password);

    if (!isPasswordsMatch) return next(new AppError("Wrong password", 401));

    req.user.password = req.body.new_password;
    await req.user.save();

    res.status(200).json({
        status: 'success',
        message: "Succefully updated password"
    });
});
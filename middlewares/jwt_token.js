const jwt = require('jsonwebtoken');
const AppError = require('./app_error');
const catchError = require('./catch_error');
const UserModel = require('../models/user_model');
const GuestModel = require('../models/guest_model');

function isGuestRoute(str) {
    // return RegExp('\\bguest\\b').test(str);
    return str.includes('guest');
}

exports.generateJwtToken = (id) => {
    console.log(id);
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

exports.checkJwtToken = catchError(async (req, res, next) => {
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')) return next(new AppError("You must sign in to access this info.", 401));

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);

    const User = isGuestRoute(req.originalUrl) ? GuestModel : UserModel;
    console.log(isGuestRoute(req.originalUrl));

    const user = await User.findById(decodedToken['id']).select('-__v');

    if (!user) return next(new AppError("Invalid token. No user exists with the provided token", 401));

    if (!isGuestRoute(req.originalUrl)) {
        if (!user.isPasswordChangedAfterTokenIssued(decodedToken.iat))
            return next(new AppError("User recently changed password. Please login again", 401));
    }

    req.user = user;

    next();
});
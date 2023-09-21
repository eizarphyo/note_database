const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const { findOne } = require('../models/note_model');
const UserModel = require('../models/user_model');
const GuestModel = require('../models/guest_model');
const AppError = require('../middlewares/app_error');
const catchError = require('../middlewares/catch_error');
const authTokenCtrl = require('../middlewares/jwt_token');

exports.getAllUsers = catchError(async (req, res, next) => {
    const users = await UserModel.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        users
    });
});

exports.getOneUser = catchError(async (req, res, next) => {
    // const user = await UserModel.findById(req.params.id);
    // if (!user) return next(new AppError(`No user found with the ID: ${req.params.id}`, 404));

    const user = req.user;

    res.status(200).json({
        status: 'success',
        user
    });
});

exports.userSignIn = catchError(async (req, res, next) => {
    const user = await UserModel.findOne({ username: req.body.username });

    if (!user) return next(new AppError(`No user found with the username: ${req.body.username}`), 404);

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) return next(new AppError('Wrong Password', 403));

    const token = authTokenCtrl.generateJwtToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        // user
    });
});

// Sign up
exports.postOneUser = catchError(async (req, res, next) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    const user = await UserModel.create(newUser);

    const token = authTokenCtrl.generateJwtToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        // user
    });
});

exports.updateUser = catchError(async (req, res, next) => {
    var updatedBody;

    if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        updatedBody = Object.assign(req.body, { password: hash });
    } else {
        updatedBody = req.body;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updatedBody, { new: true });

    res.status(200).json({
        status: 'success',
        updatedUser
    });
});

exports.deleteUser = catchError(async (req, res, next) => {

    await UserModel.findByIdAndDelete(req.params.id, { new: true });

    res.status(200).json({
        status: 'success',
        message: 'User deleted',
        user: null
    });

});

// ------------ GUEST USER CONTROLLER ------------
exports.createGuestUser = catchError(async (req, res, next) => {
    const guest = await GuestModel.create(req.body);

    const token = authTokenCtrl.generateJwtToken(guest._id);

    res.status(200).json({
        status: 'success',
        token,
        // guest
    });
});

exports.getAllGuests = catchError(async (req, res, next) => {
    const guests = await GuestModel.find();

    res.status(200).json({
        status: 'success',
        results: guests.length,
        guests
    });
});

exports.getOneGuest = catchError(async (req, res, next) => {
    // const guest = await GuestModel.findById(req.params.uid);
    // if (!guest) return next(new AppError(`No user found with the ID: ${req.params.uid}`, 404));

    const guest = req.user;
    res.status(200).json({
        status: 'success',
        guest
    });
});

exports.deleteGuest = catchError(async (req, res, next) => {

    await GuestModel.findByIdAndDelete(req.user.id, { new: true });

    res.status(200).json({
        status: 'success',
        message: 'User deleted',
        user: null
    });

});

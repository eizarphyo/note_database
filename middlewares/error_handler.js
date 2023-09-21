const AppError = require('../middlewares/app_error');

const handleJWTError = () => new AppError("Invalid token. Please log in again", 401);

const handleJWTExpireError = () => new AppError("Token expired. Please log in again.", 401);

const handleDbError = (err) => {
    const message = `Invalid ObjectID format: '${err.value}'`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsError = (err) => {
    // console.log(err.keyValue.username);
    // const message = `Duplicated field value: ${err.keyValue.username}.Please use another value!`;
    const message = `Username '${err.keyValue.username}' already exists.`
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log('ERROR:', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }

};

module.exports = (err, req, res, next) => {
    console.log("ERROR STACK:");
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {

        if (err.name === 'CastError') err = handleDbError(err);
        if (err.code === 11000) err = handleDuplicateFieldsError(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpireError();

        sendErrorProd(err, res);
    }
}
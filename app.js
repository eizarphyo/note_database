const express = require('express');
const cors = require('cors');
const AppError = require('./middlewares/app_error');
const errorHandler = require('./middlewares/error_handler');

const dotenv = require('dotenv');
const userRouter = require('./routes/user_route');
const noteRouter = require('./routes/note_route');
const authRouter = require('./routes/auth_route');
const guestRouter = require('./routes/guest_route');


dotenv.config({ path: './.env' });
console.log(process.env.NODE_ENV);

const app = express();

app.use(express.json());

// if (process.env.NODE_ENV == 'development' ) {
//     app.use(morgan("dev"));
// }

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

app.use(cors());

app.use('/noteapp/v1/user', userRouter);

app.use('/noteapp/v1/note', noteRouter.note);
app.use('/noteapp/v1/notes', noteRouter.notes);

app.use('/noteapp/v1/auth', authRouter);
app.use('/noteapp/v1/guest', guestRouter.guest);
app.use('/noteapp/v1/guests', guestRouter.guests);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

module.exports = app;
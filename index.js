const app = require('./app');
const mongoose = require('mongoose');

const host = "127.0.0.1";

const uri = 'mongodb+srv://ezp:<password>@note.9brwaaj.mongodb.net/noteapp?retryWrites=true&w=majority';

mongoose.connect(uri.replace('<password>', process.env.DB_PASSWORD)).then(async (connect) => {
    connect.connection.db.collection('guestnotes').createIndex({ createdAt: 1 }, { expireAfterSeconds: 30 * 86400 });
    connect.connection.db.collection('guests').createIndex({ createdAt: 1 }, { expireAfterSeconds: 30 * 86400 });

    // console.log(db);

    console.log("Connected to database 🍉");
});

const server = app.listen(process.env.port, process.env.HOST, () => {
    console.log(`Server is listening on port ${process.env.PORT} of ${process.env.HOST} 🍎`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
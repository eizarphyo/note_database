const nodemailer = require('nodemailer');

const sendPasswordResetMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "465",
        auth: {
            user: "eizarphyo2601@gmail.com",
            pass: "ealhbixeguhjhuuh"
        }

        // host: "sandbox.smtp.mailtrap.io",
        // port: 2525,
        // auth: {
        //     user: "e4388e372cb45b",
        //     pass: "2b653161f2e128"
        // }
    });

    const mail = {
        from: "Note Taker",
        to: options.to,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mail);
    console.log("password rest email sent");
};

module.exports = sendPasswordResetMail;
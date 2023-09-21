const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, 'User must have a name.'],
            unique: true,
            trim: true,
            maxlength: [16, 'Username must have less than 16 characters'],
            minlength: [4, 'Username must have at least 4 characters']
        },
        email: {
            type: String,
            require: [true, 'User must provide an email'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            require: [true, 'User must provide a password'],
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        passwordResetToken: String,
        passwordResetTokenExpiresIn: Date,
        passwordResetAt: Date,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return (next);

    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
});

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.isPasswordChangedAfterTokenIssued = function (jwtIat) {
    if (this.passwordResetAt) {
        const passwordResetTimestamp = parseInt(this.passwordResetAt.getTime() / 1000, 10);

        return jwtIat > passwordResetTimestamp;
    }
    return false;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
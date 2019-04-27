const { Schema, model } = require('mongoose');

var UserSchema = new Schema({
    name: { type: String, required: true },
    gender: { type: String },
    given_name: { type: String },
    family_name: { type: String },
    password: { type: String, required: true },
    google_picture: { type: String },
    facebook_picture: { type: String },
    password_verified: { type: Boolean, required: true, default: false },
    email: { type: String, required: true, lowercase: true, unique: true },
    avatar: { type: String, default: null },
    avatar_public_id: { type: String },
    role: { type: String, required: true, default: 'user' },
    active: { type: Boolean, required: true, default: false },
    temporaryToken: { type: String, required: true },
    resetPasswordToken: { type: String, required: false },
});

module.exports = model('User', UserSchema);
const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: String },
    avatar: { type: String },
    avatar_public_id: { type: String },
    checkdata: [],
    author: { type: String, required: true },
    genres: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = model('Task', TaskSchema);
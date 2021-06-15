const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 128
    },
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    // grade: {
    //     type: Number,
    //     required: true
    // },
    // division: {
    //     type: String,
    //     required: true
    // },
    // subjects: {
    //     type: Array,
    //     required: true,
    //     default: []
    // }
});

module.exports = User = mongoose.model('user', userSchema);
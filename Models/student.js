const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
        required: false,
        minlength: 8,
        maxlength: 128
    },
    phone: {
        type: Number,
        required: true,
        unique: 10,
    },
    enrollmentStatus: 
    {
        type: Boolean,
        required: true,
        default: false
    }
    // subjects: {
    //     type: Array,
    //     required: true,
    //     default: []
    // }
});

module.exports = Student = mongoose.model('student', studentSchema);
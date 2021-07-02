const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 128,
  },
  email: {
    type: String,
    trim: true,
    minlength: 8,
    maxlength: 128,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: 10,
  },
  enquiryStatus: {
    type: Boolean,
    default: false,
  },
  enquiryDate: {
    type: Date,
  },
  isEnquiryActive: {
    type: Boolean,
    default: false,
  },
  enrollmentStatus: {
    type: Boolean,
    default: false,
  },
  isEnrollmentActive: {
    type: Boolean,
    default: false,
  },
  enrollmentDate: {
    type: Date,
  },
  year: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  offeredFees: {
    type: Number,
  },
  actualFees: {
    type: Number,
  },
});

module.exports = Student = mongoose.model('student', studentSchema);

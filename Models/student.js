const mongoose = require("mongoose");

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
    required: false,
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
    required: true,
    default: false,
  },
  isEnquiryActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  enrollmentStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  isEnrollmentActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  enquiryDate: {
    type: Date,
    required: false,
  },
  enrollmentDate: {
    type: Date,
    required: false,
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
});

module.exports = Student = mongoose.model("student", studentSchema);

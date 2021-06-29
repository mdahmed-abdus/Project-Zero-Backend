const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 128,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 128,
  },
  fees: {
    type: Number,
    required: true,
    trim: true,
  },
  numberOfLectures: {
    type: Number,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
    max: 10,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = Course = mongoose.model("course", courseSchema);

const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;
const courseSchema = new mongoose.Schema({
  name: {
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
  authorName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 128,
  },
  rating: {
    type: Number,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 2,
  },

  /*
  student: {
    type: ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  offeredFees: {
    type: Number,
    required: true,
    trim: true,
  },
  actualFees: {
    type: Number,
    required: false,
    trim: true,
  },
  */
});

module.exports = Course = mongoose.model("course", courseSchema);

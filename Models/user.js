const mongoose = require("mongoose");

// change schema name
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 128,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 8,
    maxlength: 128,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  phoneNumber: {
    type: Number,
    required: true,
    trim: true,
    unique: 10,
  },
});

module.exports = User = mongoose.model("user", userSchema);

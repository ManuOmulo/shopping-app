const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Not a valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(password) {
      if (validator.equals(password, "password")) {
        throw new Error("Password cannot be 'password'");
      }
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

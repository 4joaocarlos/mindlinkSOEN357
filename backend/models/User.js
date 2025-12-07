// Mongoose schema and helpers for application users.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plainPassword, salt);
};

userSchema.methods.validatePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.generateAuthToken = function() {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.sign(
    { userId: this._id },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);

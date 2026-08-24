const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: {
        values: ['member', 'admin'],
        message: '{VALUE} is not a valid user role'
      },
      default: 'member'
    },
    membershipType: {
      type: String,
      enum: {
        values: ['basic', 'premium', 'platinum'],
        message: '{VALUE} is not a valid membership type'
      },
      default: 'basic'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Member', memberSchema);

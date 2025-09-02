const mongoose = require('mongoose');

const rulesSchema = new mongoose.Schema({
  breakEnabled: { type: Boolean, default: false },
  breakCount: { type: Number, default: 1 },
  breakTime: { type: Number, default: 5 },
  passwordEnabled: { type: Boolean, default: false },
  passwordHash: { type: String, default: null }
}, { _id: false });

const userSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  displayName: String,
  email: { type: String, index: true },
  photo: String,
  block_list: { type: [String], default: [] },
  allow_list: { type: [String], default: [] },
  task_list: { type: [Object], default: [] },
  rules: { type: rulesSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

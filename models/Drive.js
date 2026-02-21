const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  title: String,
  description: String,
  minCGPA: Number,
  maxBacklogs: Number,
  branchesAllowed: [String],
  date: Date
});

module.exports = mongoose.model('Drive', driveSchema);

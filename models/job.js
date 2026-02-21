const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // assuming alumni are Users
  company: { type: String, required: true },
  position: { type: String, required: true },
  skillsRequired: [String],
  minCgpa: { type: Number, default: 0 },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
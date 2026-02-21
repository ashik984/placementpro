const mongoose = require("mongoose");

const MentorshipSchema = new mongoose.Schema({
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  availableHours: [{ type: Date }],
  type: { type: String, enum: ["Mock Interview", "Guidance"], default: "Guidance" },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

module.exports = mongoose.model("Mentorship", MentorshipSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student","tpo","alumni"] },

  // Student Fields
  cgpa: Number,
  backlogs: Number,
  branch: String,
  skills: [String],
  projects: [String]
});

module.exports = mongoose.model("User", userSchema);
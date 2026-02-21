const router = require("express").Router();
const Drive = require("../models/Drive");
const User = require("../models/user");

// Create Drive (TPO)
router.post("/create", async (req,res)=>{
  const drive = await Drive.create(req.body);

  // Criteria Engine
  const eligibleStudents = await User.find({
    role: "student",
    cgpa: { $gte: drive.minCGPA },
    backlogs: { $lte: drive.maxBacklogs },
    branch: { $in: drive.branchesAllowed }
  });

  res.json({
    drive,
    eligibleCount: eligibleStudents.length,
    eligibleStudents
  });
});

module.exports = router;

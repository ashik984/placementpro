const router = require("express").Router();

router.post("/", (req,res)=>{
  const msg = req.body.message.toLowerCase();

  if(msg.includes("cutoff"))
    return res.json({reply:"Cutoff is 7.0 CGPA"});

  if(msg.includes("interview"))
    return res.json({reply:"Interview schedule will be updated on dashboard"});

  if(msg.includes("venue"))
    return res.json({reply:"Seminar Hall A"});

  res.json({reply:"Please contact TPO office for more details"});
});

module.exports = router;
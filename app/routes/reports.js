const express = require("express");
var router = express.Router();
const reporter = require('../helpers/system-report');

router.get('/api/v1.0/reports/daily', async (req, res) => {

  try{
    reporter.sendReport(1);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
 
});

module.exports = router
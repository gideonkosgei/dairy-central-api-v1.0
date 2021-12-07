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

router.get('/api/v1.0/reports/weekly', async (req, res) => {
  try{
    reporter.sendReport(2);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/reports/monthly', async (req, res) => {
  try{
    reporter.sendReport(3);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});


router.get('/api/v1.0/pra-performance/daily', async (req, res) => {
  try{
    reporter.sendPraPerformanceReport(4);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/pra-performance/weekly', async (req, res) => {
  try{
    reporter.sendPraPerformanceReport(5);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/pra-performance/monthly', async (req, res) => {
  try{
    reporter.sendPraPerformanceReport(6);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});




module.exports = router
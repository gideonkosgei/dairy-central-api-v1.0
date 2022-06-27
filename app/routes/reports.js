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

router.get('/api/v1.0/pra-performance/county/weekly', async (req, res) => {
  try{
    reporter.sendCountyPraPerformanceReport(10);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/pra-performance/county/monthly', async (req, res) => {
  try{
    reporter.sendCountyPraPerformanceReport(11);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/tag-id-unification', async (req, res) => {
  try{
    reporter.sendTagIdUnificationReport(7);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/data-quality-report', async (req, res) => {
  try{
    reporter.sendDataQualityReport(8);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.get('/api/v1.0/comparative-data-quality-report', async (req, res) => {
  try{
    reporter.sendComparativeDataQualityReport(9);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});


router.get('/api/v1.0/graduation-report/:report_code/:report_option/:report_date', async (req, res) => {
  try{
    console.lo
    const {report_code,report_option, report_date} = req.params;   
    reporter.sendGraduationReport(parseInt(report_code),parseInt(report_option),report_date);
    res.status(200).json({ status: 200, message: "success" });
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});






module.exports = router
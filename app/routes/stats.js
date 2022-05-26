const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/stats/top-cows/:option/:user/:year', async (req, res) => {
  const { user, year, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_stats_top_cows(${option},${user},${year})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/milk-performance-comparator/:org', async (req, res) => {
  const { org } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_stats_milk_pre_cur_year_comparison(${org})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/breed-distribution/:user/:level/:herd', async (req, res) => {
  const { user, level, herd } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_stats_breed_distribution(${user},${level},${herd})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/dashboard-overview/:org', async (req, res) => {
  const { org } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_stats_dashboard_overview(${org})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/lactation-table/:animal_id', async (req, res) => {
  const { animal_id } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_milking_trends(${animal_id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});
router.get('/api/v1.0/stats/lactation-curve/:id/:option', async (req, res) => {
  const { id,option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_lactation_curve(${id},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/herd-milking-summary/:report_type/:user', async (req, res) => {
  const { report_type, user } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_herd_milking_summary(${report_type},${user})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/weight-growth-curve/:option/:type/:animal_id', async (req, res) => {
  const { animal_id, type, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_weight_growth_curve(${option},${type},${animal_id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/health-management-trends/:option/:id/:date_start/:date_end', async (req, res) => {
  const { id, option, date_start, date_end } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_health_management_trends(${option},${id},${JSON.stringify(date_start)},${JSON.stringify(date_end)})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/due-dates/:user/:option', async (req, res) => {
  const { user, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_animals_due_dates(${user},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/pd-action-list/:user/:option', async (req, res) => {
  const { user, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_animals_pd_action_list(${user},${option})`; 
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/stats/service-action-list/:user/:option', async (req, res) => {
  const { user, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_analytics_service_action_list(${user},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


router.get('/api/v1.0/stats/events-summary/:user/:level/:herd', async (req, res) => {
  const { user, level, herd } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_stats_events_summary(${user},${level},${herd})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

// Admin dashboard & summaries: General stats
router.get('/api/v1.0/stats/admin-dashboard/summary-statistics/:report/:country/:farm_type', async (req, res) => {
  const { report, country, farm_type } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_rpt_lsf_msf_summaries(${report},${country},${farm_type})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


module.exports = router
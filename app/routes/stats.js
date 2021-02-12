const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/stats/top-cows/:org/:start/:end', async (req, res) => {   
  const {org,start,end} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_stats_top_cows(${org},${JSON.stringify(start)},${JSON.stringify(end)})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/milk-performance-comparator/:org', async (req, res) => {   
  const {org} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_stats_milk_pre_cur_year_comparison(${org})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/breed-distribution/:org', async (req, res) => {   
  const {org} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_stats_breed_distribution(${org})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/dashboard-overview/:org', async (req, res) => {   
  const {org} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_stats_dashboard_overview(${org})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/lactation-table/:animal_id', async (req, res) => {   
  const {animal_id} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_analytics_milking_trends(${animal_id})`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});
router.get('/api/v1.0/stats/lactation-curve/:animal_id', async (req, res) => {   
  const {animal_id} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_analytics_lactation_curve(${animal_id})`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/herd-milking-summary/:report_type/:org_id', async (req, res) => {   
  const {report_type,org_id} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_analytics_herd_milking_summary(${report_type},${org_id})`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/weight-growth-curve/:option/:animal_id', async (req, res) => {   
  const {animal_id,option} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_analytics_weight_growth_curve(${option},${animal_id})`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/stats/health-management-trends/:animal_id', async (req, res) => {   
  const {animal_id} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_analytics_health_management_trends(${animal_id})`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});
module.exports = router
const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/graduation/settings/:org_id', async (req, res) => {
  const{org_id}  = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_graduation_settings_view(${org_id})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/graduation/list/:org_id/:status_id', async (req, res) => {
  const{org_id,status_id}  = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_graduation_list_view(${org_id},${status_id})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


module.exports = router
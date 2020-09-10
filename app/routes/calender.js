const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

// view calender Items
router.get('/api/v1.0/calender/event/:org_id', async (req, res) => {
  const org_id = req.params.org_id;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_view_calender_events(${org_id})`;       
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

//create calender 
router.post('/api/v1.0/calender/event', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;});
  const {title,description,event_start,event_end,all_day,color,org_id,created_by} = req.body;
  const sql = `CALL sp_create_calender_events(${JSON.stringify(title)},${JSON.stringify(description)},${JSON.stringify(event_start)},${JSON.stringify(event_end)},${JSON.stringify(all_day)},${JSON.stringify(color)},${JSON.stringify(org_id)},${JSON.stringify(created_by)})`;
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});
 
module.exports = router
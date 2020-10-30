const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

   //create new limit parameter
   router.post('/api/v1.0/batches/milking/upload', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {rows ,cols,created_by,org_id,uuid} = req.body; 
    const batch_type = 1;
    
    const rows_clone = rows.slice(1)   
    let i = 0;

    for (i; i<rows_clone.length; i++){
      rows_clone[i].push(uuid);
    }  

    var jString = JSON.stringify(rows_clone);
    jString = jString.substr(1);
    jString = jString.substring(0,jString.length-1);
    jString = jString.replace(/\[/g, "(");
    jString = jString.replace(/\]/g, ")");                  
    const sql = `CALL sp_create_batch_upload_milk( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;
    
    query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
    .catch(e=>{res.status(400).json({status:400, message:e })});      
});


// view milking batched on validation queue
router.get('/api/v1.0/batches/milking/validation/:uuid', async (req, res) => {
  const uuid = req.params.uuid;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_view_batch_upoad_milk_validate_step('${uuid}')`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// actions on milk batch i.e validation or discard
router.post('/api/v1.0/batches/milking/action', async (req, res) => { 
  const {action,uuid,user} = req.body; 
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_action(${JSON.stringify(uuid)},${action},${user})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
 });

// view batch records based on organization and step. Filters -> org_id, step
router.get('/api/v1.0/batches/milking/:org/:step/:user', async (req, res) => {
  const org = req.params.org;  
  const step = req.params.step;  
  const user = req.params.user;
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_view_records(${org},${step},${user})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


// view deleted batches based on organization and step. 
router.get('/api/v1.0/batches/deleted/milking/:org/:user', async (req, res) => {
  const org = req.params.org;
  const user = req.params.user;
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_view_deleted_records(${org},${user})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// view POSTED batches based on organization and step. 
router.get('/api/v1.0/batches/posted/milking/:org/:user', async (req, res) => {
  const org = req.params.org;
  const user = req.params.user;
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_view_posted_batches(${org},${user})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// view error details of a batch milk record
router.get('/api/v1.0/batches/milking/errors/:record_id', async (req, res) => {
  const record_id = req.params.record_id;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_view_record_error(${record_id})`;       
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/batches/milking/list/:org', async (req, res) => {
  const {org} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_milking_list(${org})`;       
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});
 
module.exports = router
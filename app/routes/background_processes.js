const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

// GET BACKGROUND PROCESSES
// router.get('/api/v1.0/background-process/org/:org_id', async (req, res) => {
//   const{org_id}  = req.params;    
//   const conn = await connection(dbConfig).catch(e => {return e;});     
//   const sql = `CALL sp_background_processes_view(${org_id})`;         
//   await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
// });

// router.get('/api/v1.0/background-process/:id', async (req, res) => {
//   const{id}  = req.params;    
//   const conn = await connection(dbConfig).catch(e => {return e;});     
//   const sql = `CALL sp_background_process_record_view(${id})`;         
//   await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
// });

// Run Background Process
router.post('/api/v1.0/background-process', async (req, res) => { 
  try{     
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = `CALL sp_background_processor()`;      
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});   
  }catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
   
});

module.exports = router
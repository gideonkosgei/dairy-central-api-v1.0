const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/orgs', async (req, res) => {     
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_org_all_view()`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/orgs/access/:id', async (req, res) => {   
  const user_id = req.params.id;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_org_access_view(${user_id})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.put('/api/v1.0/orgs/access/:id', async (req, res) => {   
  const user = req.params.id;   
  const {orgs,created_by} = req.body;  
  let org_access = '';
  if (orgs.length>0){
    for (var i = 0; i<orgs.length;i++){
      org_access += `,${orgs[i]}`
    }
  } else {
    org_access = null;
  }

  if(org_access) {
    org_access = org_access.replace(',', '');     
  }
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_org_access_create(${JSON.stringify(org_access)},${user},${created_by})`;       
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

router.put('/api/v1.0/orgs/switch/access', async (req, res) => {   
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const {org,user} = req.body;    
  const sql = `CALL sp_org_switch(${org},${user})`;       
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});       
});

module.exports = router
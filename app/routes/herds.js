const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

  router.get('/api/v1.0/herds/:option/:id/:user', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {id,option,user} = req.params;
    const sql =  `CALL sp_ViewHerdOrHerds(${option},${id},${user})`;  
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
  
  router.post('/api/v1.0/herds', async (req, res) => { 
    try {    
    const conn = await connection(dbConfig).catch(e => {return e;});
    
    const {country, district,farm_id, herd_name, region , village, ward, org, user} = req.body; 
    const option = 0;
    const id = null;
    const reg_date = null;
      
    const sql = `CALL sp_CreateOrUpdateHerdRecord(${option},${id},${reg_date},${farm_id},${JSON.stringify(herd_name)},${country},${region},${district},${ward},${village},${user},${org})`;        
  
    await query(conn, sql).then(
      response => {            
      res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
    })
    .catch(e => {res.status(400).json({status:400, message:e })}); 
    } catch(error) {
      res.send({status:0,message:`system error! ${error.message}`});
    }   
  });

router.put('/api/v1.0/herds', async (req, res) => { 
  try {    
  const conn = await connection(dbConfig).catch(e => {return e;});
  
  const {country, district,farm_id, herd_name, region , village, ward, org, user, reg_date,herd_id,org_id} = req.body; 
  const option = 1;    
  const sql = `CALL sp_CreateOrUpdateHerdRecord(${option},${herd_id},${JSON.stringify(reg_date)},${farm_id},${JSON.stringify(herd_name)},${country},${region},${district},${ward},${village},${user},${org_id})`;        
  await query(conn, sql).then(
    response => {            
    res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
  })
  .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch(error) {
    res.send({status:0,message:`system error! ${error.message}`});
  }   
});

//create default herd
router.post('/api/v1.0/default-herd', async (req, res) => { 
  try {    
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  
  const {farm_id, user_id} = req.body; 
    
  const sql = `CALL sp_CreateDefaultHerd(${farm_id},${user_id})`;   

  await query(conn, sql).then(
    response => {            
    res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
  })
  .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch(error) {
    res.send({status:0,message:`system error! ${error.message}`});
  }   
});

module.exports = router
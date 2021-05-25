const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

  router.get('/api/v1.0/farms/:option/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {id,option} = req.params;
    const sql = `CALL sp_ViewFarmOrFarms(${option},${id})`;       
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });  

  router.post('/api/v1.0/farms', async (req, res) => { 
    try {    
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const { user,org,country,district,email,farm_code,farm_type,farm_name,farmer_name,phone,region,village,ward} = req.body; 
    const option = 0;
    const id = null;
    const reg_date = null;

    const sql = `CALL sp_CreateOrUpdateFarmRecord(
      ${option},
      ${id},
      ${reg_date}, 
      ${JSON.stringify(email)},
      ${JSON.stringify(farm_code)},
      ${JSON.stringify(farm_type)},
      ${JSON.stringify(farm_name)},
      ${JSON.stringify(farmer_name)}, 
      ${JSON.stringify(phone)},
      ${country},
      ${region},
      ${district},
      ${ward},
      ${village},
      ${user},
      ${org}
      )`;        
  
    await query(conn, sql).then(
      response => {            
      res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
    })
    .catch(e => {res.status(400).json({status:400, message:e })}); 
    } catch(error) {
      res.send({status:0,message:`system error! ${error.message}`});
    }   
  });

router.put('/api/v1.0/farms', async (req, res) => { 
  try {    
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const { user,org,country,district,email,farm_code,farm_type,farm_name,farmer_name,phone,region,village,ward,reg_date,farm_id} = req.body; 
  const option = 1;
  
  const sql = `CALL sp_CreateOrUpdateFarmRecord(
    ${option},
    ${farm_id},   
    ${JSON.stringify(reg_date)}, 
    ${JSON.stringify(email)},
    ${JSON.stringify(farm_code)},
    ${JSON.stringify(farm_type)},
    ${JSON.stringify(farm_name)},
    ${JSON.stringify(farmer_name)}, 
    ${JSON.stringify(phone)},
    ${country},
    ${region},
    ${district},
    ${ward},
    ${village},
    ${user},
    ${org}
    )`;

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
const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/straws/:id/:option/:active', async (req, res) => {
  const{id,option,active}  = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_ai_straws_view(${id},${option},${active})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


router.post('/api/v1.0/straws', async (req, res) => {        
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {straw_id,barcode,bull_tag_id,bull_name,breed,breed_composition,semen_source,farm_name,batch_number,ejaculation_number,production_date,specification,additional_info,org_id,created_by} = req.body; 
  const sql = `CALL sp_ai_straw_create(${JSON.stringify(straw_id)}, ${JSON.stringify(barcode)}, ${JSON.stringify(bull_tag_id)}, ${JSON.stringify(bull_name)} ,${breed}, ${breed_composition}, ${JSON.stringify(semen_source)}, ${JSON.stringify(farm_name)},${JSON.stringify(batch_number)} ,${JSON.stringify(ejaculation_number)} ,${JSON.stringify(production_date)}, ${JSON.stringify(specification)} ,${JSON.stringify(additional_info)} ,${org_id} ,${created_by} )`;   
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

router.put('/api/v1.0/straws/:id', async (req, res) => {        
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const{id}  = req.params;
  const {straw_id,barcode,bull_tag_id,bull_name,breed,breed_composition,semen_source,farm_name,batch_number,ejaculation_number,production_date,specification,additional_info,updated_by} = req.body; 
  const sql = `CALL sp_ai_straw_update(${id},${JSON.stringify(straw_id)}, ${JSON.stringify(barcode)}, ${JSON.stringify(bull_tag_id)}, ${JSON.stringify(bull_name)} ,${breed}, ${breed_composition}, ${JSON.stringify(semen_source)}, ${JSON.stringify(farm_name)},${JSON.stringify(batch_number)} ,${JSON.stringify(ejaculation_number)} ,${JSON.stringify(production_date)}, ${JSON.stringify(specification)} ,${JSON.stringify(additional_info)},${updated_by} )`;   
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});



module.exports = router
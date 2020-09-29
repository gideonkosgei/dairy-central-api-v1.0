const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/partners/service-provider/:id/:option', async (req, res) => {
  const{id,option}  = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_service_provider_view(${id},${option})`;        
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


router.post('/api/v1.0/partners/service-provider', async (req, res) => {        
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {name, acronym, service_provider_type, country, postal_address ,postal_code, city ,phone ,email ,description ,services_offered ,contact_person ,contact_person_mobile_number ,org_id, created_by} = req.body; 
  const sql = `CALL sp_service_provider_create(${JSON.stringify(name)}, ${JSON.stringify(acronym)}, ${service_provider_type}, ${country}, ${JSON.stringify(postal_address)} ,${JSON.stringify(postal_code)}, ${JSON.stringify(city)} ,${JSON.stringify(phone)} ,${JSON.stringify(email)} ,${JSON.stringify(description)} ,${JSON.stringify(services_offered)} ,${JSON.stringify(contact_person)} ,${JSON.stringify(contact_person_mobile_number)} ,${org_id}, ${created_by})`;  
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

// system parameterization - update  local settings
router.put('/api/v1.0/partners/service-provider/:param_id', async (req, res) => {  
  const param_id = req.params.param_id;      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {description,is_active,key,value,updated_by,farm_id} = req.body;                     
  const sql = `CALL sp_update_parameter_local_settings(${param_id},${JSON.stringify(key)},${JSON.stringify(value)},${is_active} ,${JSON.stringify(description)},${farm_id},${updated_by})`; 
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});
 
module.exports = router
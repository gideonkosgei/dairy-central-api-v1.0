const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

  router.get('/api/v1.0/parameters/limit', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = `CALL sp_parameter_limit_view_all()`;         
    await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/parameters/limit/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_parameter_limit_view_one(${id})`;         
      await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

   //create new limit parameter
   router.post('/api/v1.0/parameters/limit', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {category ,description,is_active,max_value,min_value,created_by} = req.body;                       
    const sql = `CALL sp_create_parameter_limit(${JSON.stringify(category)} ,${JSON.stringify(description)},${min_value},${max_value},${is_active},${created_by})`; 
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

//update limit parameter
router.put('/api/v1.0/parameters/limit/:id', async (req, res) => { 
    const limit_id = req.params.id;       
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {category ,description,is_active,max_value,min_value,updated_by} = req.body;                       
    const sql = `CALL sp_update_parameter_limit(${limit_id},${JSON.stringify(category)} ,${JSON.stringify(description)},${min_value},${max_value},${is_active},${updated_by})`; 
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

// system parameterization - get local settings - filter by org id
router.get('/api/v1.0/parameters/local-settings/:org_id', async (req, res) => {
  const org_id = req.params.org_id;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_parameter_local_system_settings_view_all(${org_id})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// system parameterization - get specific local settings - order by setting/parameter id
router.get('/api/v1.0/parameters/local-settings/param/:param_id', async (req, res) => {
  const param_id = req.params.param_id;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_parameter_local_system_settings_view_one(${param_id})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// system parameterization - create new local settings
router.post('/api/v1.0/parameters/local-settings', async (req, res) => {        
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {name ,description,is_active,key,value,created_by,org_id} = req.body;                       
  const sql = `CALL sp_create_parameter_local_settings(${JSON.stringify(name)},${JSON.stringify(key)},${JSON.stringify(value)},${is_active} ,${JSON.stringify(description)},${org_id},null,${created_by})`; 
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

// system parameterization - update  local settings
router.put('/api/v1.0/parameters/local-settings/param/:param_id', async (req, res) => {  
  const param_id = req.params.param_id;      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {description,is_active,key,value,updated_by,farm_id} = req.body;                     
  const sql = `CALL sp_update_parameter_local_settings(${param_id},${JSON.stringify(key)},${JSON.stringify(value)},${is_active} ,${JSON.stringify(description)},${farm_id},${updated_by})`; 
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

// Get lactation Number
router.get('/api/v1.0/parameters/lactation-number/:option/:animal_id', async (req, res) => {
  const {option,animal_id} = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_get_lactation_number(${option},${animal_id})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/image-upload-dir', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const sql = "SELECT `value` AS image_dir FROM setting WHERE `key` = 'image-upload-dir' LIMIT 1";    
  await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
 
});


// Generate Temp Tag ID
router.get('/api/v1.0/parameters/tag-id/:org_id', async (req, res) => {
  const {org_id} = req.params;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_generate_temp_tag_id(${org_id})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});
 
module.exports = router
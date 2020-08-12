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


 
  module.exports = router
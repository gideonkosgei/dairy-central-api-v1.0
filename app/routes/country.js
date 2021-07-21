const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/countries', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = "select id,code,name,country,unit1_name,unit2_name,unit3_name,unit4_name from core_country where is_active=1";    
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
       
  });

  router.get('/api/v1.0/countries/:id', async (req, res) => {
     const conn = await connection(dbConfig).catch(e => {return e;}); 
     const {id} = req.params;
     const sql = `select id,code,name,country,unit1_name,unit2_name,unit3_name,unit4_name from core_country where  id = ${id}`;    
     await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
    
   });

   //get admin units
   router.get('/api/v1.0/admin-units/:unit/:option', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {unit,option} = req.params;    
    const sql = `CALL sp_administrative_units_view(${unit},${option})`;    
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
    
  });

  //get admin units all
   router.get('/api/v1.0/admin-units-all/:country/:region/:district/:ward', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {country,region,district,ward} = req.params;    
    const sql = `CALL sp_administrative_units_view_all(${country},${region},${district},${ward})`;  
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/countries-all', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = "SELECT id, iso2, name  FROM core_master_country WHERE is_active =1 order by name";    
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
       
  });

 module.exports = router
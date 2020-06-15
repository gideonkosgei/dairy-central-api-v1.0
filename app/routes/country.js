const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/countries', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = "select id,code,name,country,unit1_name,unit2_name,unit3_name,unit4_name from core_country where is_active=1";    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });

  router.get('/api/v1.0/countries/:id', async (req, res) => {
     const conn = await connection(dbConfig).catch(e => {return e;}); 
     const {id} = req.params;
     const sql = `select id,code,name,country,unit1_name,unit2_name,unit3_name,unit4_name from core_country where  id = ${id}`;    
     const payload = await query(conn, sql).catch(e=>{return e;});   
     res.json({ payload });
   });

   //get regions or counties
   router.get('/api/v1.0/admin-units/country/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {id} = req.params;    
    const sql = `select distinct county_id,county_name from v_administrative_units where country_id = ${id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });
   
  //get sub-county  or district
  router.get('/api/v1.0/admin-units/country/:country_id/county/:county_id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {country_id,county_id} = req.params;       
    const sql = `select  distinct sub_county_id,sub_county_name from v_administrative_units where country_id= ${country_id} and county_id = ${county_id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });


  //get ward or woreda 
  router.get('/api/v1.0/admin-units/country/:country_id/county/:county_id/sub-county/:sub_county_id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {country_id,county_id,sub_county_id} = req.params;       
    const sql = `select  distinct ward_id, ward_name from v_administrative_units where country_id= ${country_id} and county_id = ${county_id} and sub_county_id = ${sub_county_id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });

  //get village or kebele
  router.get('/api/v1.0/admin-units/country/:country_id/county/:county_id/sub-county/:sub_county_id/ward/:ward_id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const{country_id,county_id,sub_county_id,ward_id }= req.params;     
    const sql = `select  distinct village_id, village_name from v_administrative_units where country_id= ${country_id} and county_id = ${county_id} and sub_county_id = ${sub_county_id} and ward_id = ${ward_id} `;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });


 module.exports = router
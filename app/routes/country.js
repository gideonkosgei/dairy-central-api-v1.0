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
     const id = req.params.id;
     const sql = `select id,code,name,country,unit1_name,unit2_name,unit3_name,unit4_name from core_country where  id = ${id}`;    
     const payload = await query(conn, sql).catch(e=>{return e;});   
     res.json({ payload });
   });

 module.exports = router
const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/farm', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select * from core_farm limit 10";    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });

  router.get('/api/v1.0/farm/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    let id = req.params.id;
    const sql = `select * from core_farm where id = ${id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });

  router.get('/api/v1.0/farm/country/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    let id = req.params.id;
    const sql = `select * from core_farm where country_id = ${id} limit 10`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });



  module.exports = router
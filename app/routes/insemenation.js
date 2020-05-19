const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/event/insemenation', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = `select * from v_insemenation limit 100`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.send(payload);
  });

router.get('/api/v1.0/event/insemenation/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    let id = req.params.id;
    const sql = `select * from v_insemenation where id = ${id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.send(payload);
  });

  module.exports = router
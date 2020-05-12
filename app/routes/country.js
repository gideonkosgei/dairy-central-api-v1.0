const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/country', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select * from core_country";    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.json({ payload });
  });

  router.get('/country/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    let id = req.params.id;
    const sql = `select * from core_country where id = ${id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});    
    
   let payload_code = payload.code
   if(payload_code == 'ER_PARSE_ERROR'){
        res.status(400).json({status:400, payload })
   } else {
        res.status(200).json({status:200, payload });
   }  
     
  });



  module.exports = router
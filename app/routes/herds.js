const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');


  router.get('/api/v1.0/herds/org/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const id = req.params.id;
    const sql = `select * from core_animal_herd where org_id = ${id}`;
    const payload = await query(conn, sql).catch(e=>{return e;});     
    const payload_code = payload.code 
    const payLoadLength = (payload_code == 'ER_PARSE_ERROR')? 0: JSON.stringify(payload[0].length);
    if(payload_code == 'ER_PARSE_ERROR'){
          res.status(400).json({status:400, payload })
    } else if (payLoadLength<1) {
          res.status(200).json({status:204, payload });
    } else {
          res.status(200).json({status:200, payload });
    } 
  });
  module.exports = router
const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/timezones', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select name from conf_timezone_ref";    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    const payLoadLength  = JSON.stringify(payload[0].length); 
    const payload_code = payload.code 
    if(payload_code == 'ER_PARSE_ERROR'){
        res.status(400).json({status:400, payload })
    } else if (payLoadLength<1) {
        res.status(200).json({status:204, payload });
    } else {
        res.status(200).json({status:200, payload });
    } 
  });

  module.exports = router
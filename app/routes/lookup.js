const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/lookup/:ids', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});  
    const ids =  req.params.ids;   
    
    const sql = `CALL v_lookup('${ids.slice(1, -1)}')`;     
    const payload = await query(conn, sql).catch(e=>{return e;});     
    const payload_code = payload.code 
    const payLoadLength = (payload_code === 'ER_PARSE_ERROR')? 0: JSON.stringify(payload[0].length);
    if(payload_code == 'ER_PARSE_ERROR'){
          res.status(400).json({status:400, payload })
    } else if (payLoadLength<1) {
          res.status(200).json({status:204, payload });
    } else {
          res.status(200).json({status:200, payload });
    } 
  });

  module.exports = router
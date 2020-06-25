const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/user/auth', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  
  let username = req.query.username;
  let password = req.query.password; 
    
  const sql = `CALL sp_authenticate('${username}','${password}')`;    
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

router.get('/api/v1.0/user/:id', async (req, res) => {
      const conn = await connection(dbConfig).catch(e => {return e;}); 
      const id = req.params.id;
      const sql = `select * from v_user_profiles where id = ${id}`;    
      const payload = await query(conn, sql).catch(e=>{return e;});
      console.log(payload);      
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
  
router.get('/api/v1.0/user', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select * from v_user_profiles";    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.send(payload);
  });

  module.exports = router
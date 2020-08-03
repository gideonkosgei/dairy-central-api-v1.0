const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/lookup/:ids', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});  
    const ids =  req.params.ids;     
    const sql = `CALL v_lookup('${ids.slice(1, -1)}')`; 
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })});  
     
  });

  module.exports = router
const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/timezones', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select name from conf_timezone_ref"; 
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  module.exports = router
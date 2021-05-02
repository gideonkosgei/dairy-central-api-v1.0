const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

  router.get('/api/v1.0/farms/:option/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {id,option} = req.params;
    const sql = `CALL sp_ViewFarmOrFarms(${option},${id})`;       
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });  

  module.exports = router
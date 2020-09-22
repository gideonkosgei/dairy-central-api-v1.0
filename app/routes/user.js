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
  await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })});
   
});

router.get('/api/v1.0/user/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_view_user_profiles(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
  module.exports = router
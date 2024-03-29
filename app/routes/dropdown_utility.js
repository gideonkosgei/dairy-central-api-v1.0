const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/timezones', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "select id,name from conf_timezone_ref"; 
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/auth-levels', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "SELECT id,name from auth_user_levels WHERE is_active = 1"; 
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/auth-roles', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = "SELECT id,name from auth_roles WHERE is_active = 1"; 
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  module.exports = router
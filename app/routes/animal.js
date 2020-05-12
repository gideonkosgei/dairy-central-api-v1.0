const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/animal', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const payload = await query(conn, 'select * from core_animal limit 10').catch(e=>{return e;});    
    res.json({ payload });
  });

  router.get('/animalDetails', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const payload = await query(conn, 'select  name,tag_id,farm_id from core_animal limit 10').catch(e=>{return e;});   
    res.json({ payload });
  });

  module.exports = router
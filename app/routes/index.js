const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/db-connection-check');
const query = require('../helpers/query');

router.get("/api/v1.0/", (req, res) => {
    res.json({ message: "Welcome to ADGG Dairy Central." });
  }); 

  router.get('/api/v1.0/db', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});      
    res.json({ conn });
  });

  router.get('/api/v1.0/unauthorized',  (req, res)=> {
    res.status(200).json({message:'GET Forbidden'});
  });

  router.post('/api/v1.0/odk',  (req, res)=> {
    res.status(200).json({message:'odk called'});
  });
    
  module.exports = router


 
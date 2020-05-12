const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/db-connection-check');
const query = require('../helpers/query');

router.get("/", (req, res) => {
    res.json({ message: "Welcome to ADGG Dairy Central." });
  }); 

  router.get('/db', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});      
    res.json({ conn });
  });

  router.get('/unauthorized',  (req, res)=> {
    res.status(200).json({message:'GET Forbidden'});
  });
  
  router.post('/unauthorized', (req, res)=> {
    res.status(200).json({message:"Post Forbidden"});
  });


  module.exports = router
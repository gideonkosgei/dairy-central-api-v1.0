const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/event/synchronisation', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const sql = `select  Animal_id,SyncEvent_otherHormoneType,SyncEvent_animalParity, SyncEvent_otherHormoneSource, SyncEvent_syncTime,SyncEvent_syncOtherPerson,
    SyncEvent_syncPersonPhone, SyncEvent_syncDate,SyncEvent_fieldAgentID,SyncEvent_Latitude,SyncEvent_ID, SyncEvent_Latlng,
    SyncEvent_Longitude,SyncEvent_mapAddress,SyncEvent_migrationId,SyncEvent_testdayNo,SyncEvent_Uuid from v_synchronisation limit 100`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.send(payload);
  });

router.get('/api/v1.0/event/synchronisation/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    let id = req.params.id;
    const sql = `select * from v_synchronisation where id = ${id}`;    
    const payload = await query(conn, sql).catch(e=>{return e;});   
    res.send(payload);
  });

  module.exports = router
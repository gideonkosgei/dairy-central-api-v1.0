const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');


  router.get('/api/v1.0/events/weight/animal/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const id = req.params.id;
    const sql = `
    SELECT 
      core_animal_event.animal_id as animal_id, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."138"')),'null','') AS body_length, 
      JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."139"')) AS body_score_id, 
      (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 71) AND (list.value = JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."139"'))))) AS body_score, 
      DATE_FORMAT(core_animal_event.data_collection_date,'%Y-%m-%d') AS weight_Date, 
      DATE_FORMAT(core_animal_event.event_date,'%Y-%m-%d') AS event_date,      
      ifnull(core_animal_event.field_agent_id,'') AS field_agent_id, 
      JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."137"')) AS heart_girth, 
      core_animal_event.id AS Event_ID, 
      JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."136"')) AS weight_kg 
     FROM core_animal_event WHERE core_animal_event.event_type = 6
     AND core_animal_event.animal_id = ${id}`;
    const payload = await query(conn, sql).catch(e=>{return e;});     
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

  router.post('/api/v1.0/events/weight', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const {animal_id,body_length,heart_girth,weight,body_score,data_collection_date,field_agent_id,created_by} = req.body;
      const sql = `CALL sp_create_event_weight(${animal_id},${body_length},${heart_girth},${weight},${body_score},${JSON.stringify(data_collection_date)},${field_agent_id},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});     
      
  });

module.exports = router
 
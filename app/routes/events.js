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
      JSON_UNQUOTE(JSON_EXTRACT(core_animal_event.additional_attributes, '$."136"')) AS weight_kg,
      auth_users.name as created_by     
     FROM core_animal_event 
     LEFT JOIN auth_users ON core_animal_event.created_by = auth_users.ID 
     WHERE core_animal_event.event_type = 6
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

  router.post('/api/v1.0/events/weight/charts', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const {animal_id,year} = req.body;
      const sql = `CALL sp_weight_event_animal_analytics(${animal_id},${JSON.stringify(year)})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/events/pd/animal/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_event_pd_view(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.post('/api/v1.0/events/pd', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});       
      const {animal_id,service_date,time_examined,pd_results,pd_stage,body_score,cost,pd_method,data_collection_date,field_agent_id,created_by} = req.body;      
      const isServiceDateKnown = isNaN(Date.parse(service_date))? 0 : 1;      
      const sql = `CALL sp_create_event_pd(${animal_id},${JSON.stringify(service_date)},${isServiceDateKnown},${JSON.stringify(time_examined)},${pd_results},${pd_stage},${body_score},${cost},${pd_method},${JSON.stringify(data_collection_date)},${field_agent_id},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
  });

  //synchronization
  router.get('/api/v1.0/events/sync/animal/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_event_sync_view(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
 //create sync event
  router.post('/api/v1.0/events/sync', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});       
      const {animal_id, sync_date, sync_number, animal_parity, sync_time, hormone_type, other_hormone_type, hormone_source, other_hormone_source, sync_cost, sync_person, sync_other_person, sync_person_phone, field_agent_id, created_by} = req.body;      
      const sql = `CALL sp_create_event_sync(${animal_id},${JSON.stringify(sync_date)},${sync_number}, ${animal_parity}, ${JSON.stringify(sync_time)}, ${hormone_type}, ${other_hormone_type}, ${hormone_source}, ${other_hormone_source}, ${sync_cost}, ${sync_person}, ${sync_other_person}, ${JSON.stringify(sync_person_phone)},${field_agent_id},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
  });


  //insemination
  //view insemination records
  router.get('/api/v1.0/events/insemination/animal/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_event_insemination_view(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
 //create insemination event
  router.post('/api/v1.0/events/insemination', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});       
      const { animal_id ,ai_date ,straw_semen_type ,type_of_ai ,straw_id ,country_of_origin, body_condition_score ,breed_composition_bull ,ai_cost,cow_weight,semen_batch,semen_source ,semen_source_other,breed_of_bull ,breed_of_bull_other ,field_agent_id ,created_by} = req.body;      
      const sql = `CALL sp_create_event_insemination(${animal_id},${JSON.stringify(ai_date)},${straw_semen_type}, ${type_of_ai}, ${JSON.stringify(straw_id)}, ${JSON.stringify(country_of_origin)}, ${body_condition_score}, ${breed_composition_bull}, ${ai_cost}, ${cow_weight}, ${JSON.stringify(semen_batch)}, ${semen_source},${semen_source_other},${breed_of_bull} ,${breed_of_bull_other} ,${field_agent_id},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
  });

module.exports = router
 
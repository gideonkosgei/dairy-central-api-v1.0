const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

//view weight records for an animal
  router.get('/api/v1.0/events/weight/animal/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_event_weight_view(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

//view specific weight record : filter by event id
router.get('/api/v1.0/events/weight/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_event_specific_weight_view(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

  router.post('/api/v1.0/events/weight', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const {animal_id,body_length,heart_girth,weight,body_score,data_collection_date,field_agent_id,created_by} = req.body;
      const sql = `CALL sp_create_event_weight(${animal_id},${body_length},${heart_girth},${weight},${body_score},${JSON.stringify(data_collection_date)},${field_agent_id},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});     
      
  });
 //update weight event
  router.put('/api/v1.0/events/weight/:event_id', async (req, res) => {   
    const id = req.params.event_id;     
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const {body_length,heart_girth,weight,body_score,data_collection_date,field_agent_id,updated_by} = req.body;
    const sql = `CALL sp_update_event_weight(${id},${body_length},${heart_girth},${weight},${body_score},${JSON.stringify(data_collection_date)},${field_agent_id},${updated_by})`; 
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


  //Exit events
  //view exit records
  router.get('/api/v1.0/events/exit/animal/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_event_exits_view(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
 //create exit event
  router.post('/api/v1.0/events/exit', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});       
      const {animal_id ,exit_date,disposal_amount,disposal_reason,disposal_reason_other,new_breeder_name ,new_breeder_phone_number,new_country ,new_district ,new_farmer_name,new_farmer_phone_number,new_region,new_village,field_agent_id,created_by} = req.body;                       
      const sql = `CALL sp_create_event_exits(${animal_id} ,${JSON.stringify(exit_date)},${disposal_amount},${disposal_reason},${JSON.stringify(disposal_reason_other)},${JSON.stringify(new_breeder_name)} ,${JSON.stringify(new_breeder_phone_number)},${JSON.stringify(new_country)} ,${JSON.stringify(new_district)} ,${JSON.stringify(new_farmer_name)},${JSON.stringify(new_farmer_phone_number)},${JSON.stringify(new_region)},${JSON.stringify(new_village)},${JSON.stringify(field_agent_id)},${created_by})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
  });

  //Calving events
  //view Calving records
  router.get('/api/v1.0/events/calving/animal/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_event_calving_view(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});
//create Calving event
router.post('/api/v1.0/events/calving', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});       
    const {animal_id ,calving_date,birth_type ,body_condition_score ,calf_color ,calf_deformities ,other_calf_deformities , heart_girth,calf_name ,calf_sex ,calf_weight, ease_of_calving_other ,calving_method ,calving_type_other ,calving_type ,ease_of_calving ,calving_status ,use_of_calf ,use_of_calf_other ,calf_tag_id , lactation_number ,field_agent_id ,created_by } = req.body;                       
    const sql = `CALL sp_create_event_calving(${animal_id} ,${JSON.stringify(calving_date)},${birth_type} ,${body_condition_score} ,${calf_color} ,${calf_deformities} ,${JSON.stringify(other_calf_deformities)} , ${heart_girth},${JSON.stringify(calf_name)} ,${calf_sex} ,${calf_weight},${JSON.stringify(ease_of_calving_other)} ,${calving_method} ,${JSON.stringify(calving_type_other)} ,${calving_type} ,${ease_of_calving} ,${calving_status} ,${use_of_calf} ,${JSON.stringify(use_of_calf_other)} ,${JSON.stringify(calf_tag_id)},${lactation_number} ,${JSON.stringify(field_agent_id)} ,${created_by} )`; 
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

//Milking events
//view Calving records
  router.get('/api/v1.0/events/milking/animal/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_event_milking_view(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

//create Milking event
router.post('/api/v1.0/events/milking', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});       
    const {animal_id,milk_date,days_in_milk,lactation_id,lactation_number,milking_notes,milk_quality,milk_sample_type_id,milk_pm_litres,milk_butter_fat,milk_lactose,milk_mid_day,milk_protein,milk_am_litres,milk_somatic_cell_count,milk_urea,testday_no,milk_Weight,field_agent_id,created_by} = req.body;                          
    const sql = `CALL sp_create_event_milking(${animal_id},${JSON.stringify(milk_date)} ,${days_in_milk} ,${lactation_id} ,${JSON.stringify(lactation_number)},${JSON.stringify(milking_notes)} , ${JSON.stringify(milk_quality)} ,${milk_sample_type_id} ,${milk_pm_litres} ,${milk_butter_fat} ,${milk_lactose} ,${milk_mid_day} ,${milk_protein},${milk_am_litres} ,${milk_somatic_cell_count} ,${milk_urea},${testday_no},${milk_Weight},${field_agent_id} ,${created_by} )`; 
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});


//health events
//view health records
router.get('/api/v1.0/events/health/animal/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_event_heath_view(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

//create health event
router.post('/api/v1.0/events/health', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});       
    const {animal_id ,health_date ,health_category,drug_cost,health_provider,health_type,other_health_type,field_agent_id,created_by} = req.body;                          
    const sql = `CALL sp_create_event_health(${animal_id} ,${JSON.stringify(health_date)} ,${JSON.stringify(health_category)},${drug_cost},${health_provider},${health_type},${JSON.stringify(other_health_type)},${JSON.stringify(field_agent_id)},${created_by} )`; 
    await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});

module.exports = router





 
const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

//view weight records for an animal
router.get('/api/v1.0/events/weight/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_weight_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//view specific weight record : filter by event id
router.get('/api/v1.0/events/weight/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_specific_weight_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.post('/api/v1.0/events/weight', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { animal_id, body_length, heart_girth, weight, body_score, data_collection_date, field_agent_id, created_by } = req.body;
    const output = 1; // show message
    const sql = `CALL sp_create_event_weight(${output},${animal_id},${body_length},${heart_girth},${weight},${body_score},${JSON.stringify(data_collection_date)},${field_agent_id},${created_by})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});
//update weight event
router.put('/api/v1.0/events/weight/:event_id', async (req, res) => {
  try {
    const id = req.params.event_id;
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { body_length, heart_girth, weight, body_score, data_collection_date, field_agent_id, updated_by } = req.body;
    const sql = `CALL sp_update_event_weight(${id},${body_length},${heart_girth},${weight},${body_score},${JSON.stringify(data_collection_date)},${field_agent_id},${updated_by})`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

router.post('/api/v1.0/events/weight/charts', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { animal_id, year } = req.body;
  const sql = `CALL sp_weight_event_animal_analytics(${animal_id},${JSON.stringify(year)})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/events/pd/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_pd_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/events/pd/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_specific_pd_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.post('/api/v1.0/events/pd', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { animal_id, service_date, time_examined, pd_results, pd_stage, body_score, cost, pd_method, data_collection_date, field_agent_id, created_by } = req.body;
    const isServiceDateKnown = isNaN(Date.parse(service_date)) ? 0 : 1;
    const sql = `CALL sp_create_event_pd(${animal_id},${JSON.stringify(service_date)},${isServiceDateKnown},${JSON.stringify(time_examined)},${pd_results},${pd_stage},${body_score},${cost},${pd_method},${JSON.stringify(data_collection_date)},${field_agent_id},${created_by})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//update PD  record
router.put('/api/v1.0/events/pd/:event_id', async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { service_date, time_examined, pd_results, pd_stage, body_score, cost, pd_method, data_collection_date, field_agent_id, updated_by } = req.body;
    const isServiceDateKnown = isNaN(Date.parse(service_date)) ? 0 : 1;
    const sql = `CALL sp_update_event_pd(${event_id},${JSON.stringify(service_date)},${isServiceDateKnown},${JSON.stringify(time_examined)},${pd_results},${pd_stage},${body_score},${cost},${pd_method},${JSON.stringify(data_collection_date)},${field_agent_id},${updated_by})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//synchronization
router.get('/api/v1.0/events/sync/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_sync_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//create sync event
router.post('/api/v1.0/events/sync', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { animal_id, sync_date, sync_number, animal_parity, sync_time, hormone_type, other_hormone_type, hormone_source, other_hormone_source, sync_cost, sync_person, sync_other_person, sync_person_phone, field_agent_id, created_by } = req.body;
    const sql = `CALL sp_create_event_sync(${animal_id},${JSON.stringify(sync_date)},${sync_number}, ${animal_parity}, ${JSON.stringify(sync_time)}, ${hormone_type}, ${JSON.stringify(other_hormone_type)}, ${hormone_source}, ${JSON.stringify(other_hormone_source)}, ${sync_cost}, ${sync_person}, ${JSON.stringify(sync_other_person)}, ${JSON.stringify(sync_person_phone)},${field_agent_id},${created_by})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//update synchronization event record
router.put('/api/v1.0/events/sync/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const event_id = req.params.id;
    const { sync_date, sync_number, animal_parity, sync_time, hormone_type, other_hormone_type, hormone_source, other_hormone_source, sync_cost, sync_person, sync_other_person, sync_person_phone, field_agent_id, updated_by } = req.body;
    const sql = `CALL sp_update_event_sync(${event_id},${JSON.stringify(sync_date)},${sync_number}, ${animal_parity}, ${JSON.stringify(sync_time)}, ${hormone_type}, ${JSON.stringify(other_hormone_type)}, ${hormone_source}, ${JSON.stringify(other_hormone_source)}, ${sync_cost}, ${sync_person}, ${JSON.stringify(sync_other_person)}, ${JSON.stringify(sync_person_phone)},${field_agent_id},${updated_by})`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});
router.get('/api/v1.0/events/sync/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_record_view_sync(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});
//insemination
//view insemination records
router.get('/api/v1.0/events/insemination/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_insemination_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});
router.get('/api/v1.0/events/insemination/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_record_insemination_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});
//create insemination event
router.post('/api/v1.0/events/insemination', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const option = 0;
    const {
      breeding_type,
      semen_batch,
      source_of_semen,
      straw_semen_type,
      sire_id,
      id,
      ai_date,
      type_of_ai,
      body_condition_score,
      ai_cost,
      field_agent_id,
      user
    } = req.body;

    const sql = `CALL sp_CreateOrUpdateInseminationRecord(
      ${option},
      ${id},
      ${JSON.stringify(ai_date)}, 
      ${type_of_ai}, 
      ${sire_id}, 
      ${body_condition_score},  
      ${ai_cost} ,
      ${field_agent_id},
      ${user},
      ${breeding_type},
      ${JSON.stringify(semen_batch)},
      ${source_of_semen},
      ${straw_semen_type}  
      )`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});


//update insemination event Record
router.put('/api/v1.0/events/insemination', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const option = 1;
    const {
      breeding_type,
      semen_batch,
      source_of_semen,
      straw_semen_type,
      sire_id,
      id,
      ai_date,
      type_of_ai,
      body_condition_score,
      ai_cost,
      field_agent_id,
      user
    } = req.body;

    const sql = `CALL sp_CreateOrUpdateInseminationRecord(
      ${option},
      ${id},
      ${JSON.stringify(ai_date)}, 
      ${type_of_ai}, 
      ${sire_id}, 
      ${body_condition_score},  
      ${ai_cost} ,
      ${field_agent_id},
      ${user},
      ${breeding_type},
      ${JSON.stringify(semen_batch)},
      ${source_of_semen},
      ${straw_semen_type}  
      )`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//Exit events
//view exit records
router.get('/api/v1.0/events/exit/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_exits_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//view specific exit record : filter by event id
router.get('/api/v1.0/events/exit/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_record_view_exit(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//create exit event
router.post('/api/v1.0/events/exit', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { animal_id, exit_date, disposal_amount, disposal_reason, disposal_reason_other, new_breeder_name, new_breeder_phone_number, new_country, new_district, new_farmer_name, new_farmer_phone_number, new_region, new_ward, new_village, field_agent_id, created_by } = req.body;
    const sql = `CALL sp_create_event_exits(${animal_id} ,${JSON.stringify(exit_date)},${disposal_amount},${disposal_reason},${JSON.stringify(disposal_reason_other)},${JSON.stringify(new_breeder_name)} ,${JSON.stringify(new_breeder_phone_number)},${JSON.stringify(new_country)} ,${JSON.stringify(new_district)} ,${JSON.stringify(new_farmer_name)},${JSON.stringify(new_farmer_phone_number)},${JSON.stringify(new_region)},${JSON.stringify(new_ward)},${JSON.stringify(new_village)},${JSON.stringify(field_agent_id)},${created_by})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//update exit event record
router.put('/api/v1.0/events/exit/:event_id', async (req, res) => {
  const id = req.params.event_id;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { exit_date, disposal_amount, disposal_reason, disposal_reason_other, new_breeder_name, new_breeder_phone_number, new_country, new_district, new_farmer_name, new_farmer_phone_number, new_region, new_village, field_agent_id, updated_by } = req.body;
  const sql = `CALL sp_update_event_exits(${id},${JSON.stringify(exit_date)},${disposal_amount},${disposal_reason},${JSON.stringify(disposal_reason_other)},${JSON.stringify(new_breeder_name)} ,${JSON.stringify(new_breeder_phone_number)},${JSON.stringify(new_country)} ,${JSON.stringify(new_district)} ,${JSON.stringify(new_farmer_name)},${JSON.stringify(new_farmer_phone_number)},${JSON.stringify(new_region)},${JSON.stringify(new_village)},${JSON.stringify(field_agent_id)},${updated_by})`;
  await query(conn, sql).then(e => { res.status(200).json({ status: 200, message: "success" }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//view exit list for an organization
router.get('/api/v1.0/events/exit/list/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_exit_list_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


//view Calving records
router.get('/api/v1.0/events/calving/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const {
    parameter,
    option
  } = req.params;

  const sql = `CALL sp_event_calving_view (
        ${parameter},
        ${option}
    )`;

  await query(conn, sql).then(
    response => { res.status(200).json({ payload: response }) })
    .catch(e => { res.status(400).json({ status: 400, message: e }) }
    );
});

//create Calving event
router.post('/api/v1.0/events/calving', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const option = 0;
    const output = 1;
    const {
      animal_id,
      calving_date,
      birth_type,
      calving_method,
      lactation_number,
      field_agent_id,
      created_by,
      body_condition_score,
      calf_color1,
      calf_deformities1,
      other_calf_deformities,
      heart_girth,
      calf_name,
      calf_sex,
      calf_weight,
      ease_of_calving_other,
      calving_type_other,
      calving_type,
      ease_of_calving,
      calving_status,
      use_of_calf,
      use_of_calf_other,
      calf_tag_id,
      body_condition_score2,
      calf_color2,
      calf_deformities2,
      other_calf_deformities2,
      heart_girth2,
      calf_name2,
      calf_sex2,
      calf_weight2,
      ease_of_calving_other2,
      calving_type_other2,
      calving_type2,
      ease_of_calving2,
      calving_status2,
      use_of_calf2,
      use_of_calf_other2,
      calf_tag_id2
    } = req.body;


    let color_array1 = `${calf_color1}`;
    let deformaties_array1 = `${calf_deformities1}`;

    let color_array2 = `${calf_color2}`;
    let deformaties_array2 = `${calf_deformities2}`;


    const sql = `CALL sp_CreateOrUpdateCalvingEventRecord(        
        ${output},
        ${option},
        ${animal_id},
        ${JSON.stringify(calving_date)},
        ${birth_type},
        ${lactation_number},
        ${calving_method},
        ${JSON.stringify(field_agent_id)},
        ${created_by},
        ${body_condition_score},
        ${JSON.stringify(color_array1)},
        ${JSON.stringify(deformaties_array1)},
        ${JSON.stringify(other_calf_deformities)}, 
        ${heart_girth},
        ${JSON.stringify(calf_name)},
        ${calf_sex},
        ${calf_weight},
        ${JSON.stringify(ease_of_calving_other)},      
        ${JSON.stringify(calving_type_other)},
        ${calving_type},
        ${ease_of_calving},
        ${calving_status} ,
        ${use_of_calf},
        ${JSON.stringify(use_of_calf_other)},
        ${JSON.stringify(calf_tag_id)},
        ${body_condition_score2},
        ${JSON.stringify(color_array2)},
        ${JSON.stringify(deformaties_array2)},
        ${JSON.stringify(other_calf_deformities2)}, 
        ${heart_girth2},
        ${JSON.stringify(calf_name2)},
        ${calf_sex2},
        ${calf_weight2},
        ${JSON.stringify(ease_of_calving_other2)},      
        ${JSON.stringify(calving_type_other2)},
        ${calving_type2},
        ${ease_of_calving2},
        ${calving_status2},
        ${use_of_calf2},
        ${JSON.stringify(use_of_calf_other2)},
        ${JSON.stringify(calf_tag_id2)} 
    )`;


    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});


//update Calving event record
router.put('/api/v1.0/events/calving/:rec_id', async (req, res) => {
  try {
    const rec_id = req.params.rec_id;
    const conn = await connection(dbConfig).catch(e => { return e; });
    const option = 1;
    const output = 1;
    const {
      calving_date,
      birth_type,
      calving_method,
      lactation_number,
      field_agent_id,
      updated_by,
      body_condition_score,
      calf_color,
      calf_deformities,
      other_calf_deformities,
      heart_girth,
      calf_name,
      calf_sex,
      calf_weight,
      ease_of_calving_other,
      calving_type_other,
      calving_type,
      ease_of_calving,
      calving_status,
      use_of_calf,
      use_of_calf_other,
      calf_tag_id,
      body_condition_score2,
      calf_color2,
      calf_deformities2,
      other_calf_deformities2,
      heart_girth2,
      calf_name2,
      calf_sex2,
      calf_weight2,
      ease_of_calving_other2,
      calving_type_other2,
      calving_type2,
      ease_of_calving2,
      calving_status2,
      use_of_calf2,
      use_of_calf_other2,
      calf_tag_id2
    } = req.body;
    

    let color_array1 = `${calf_color}`;
    let deformaties_array1 = `${calf_deformities}`;

    let color_array2 = `${calf_color2}`;
    let deformaties_array2 = `${calf_deformities2}`;
  
    const sql = `CALL sp_CreateOrUpdateCalvingEventRecord(  
        ${output},       
        ${option},
        ${rec_id},
        ${JSON.stringify(calving_date)},
        ${birth_type},
        ${lactation_number},
        ${calving_method},
        ${JSON.stringify(field_agent_id)},
        ${updated_by},
        ${body_condition_score},

        ${JSON.stringify(color_array1)},
        ${JSON.stringify(deformaties_array1)},
       
        ${JSON.stringify(other_calf_deformities)}, 
        ${heart_girth},
        ${JSON.stringify(calf_name)},
        ${calf_sex},
        ${calf_weight},
        ${JSON.stringify(ease_of_calving_other)},      
        ${JSON.stringify(calving_type_other)},
        ${calving_type},
        ${ease_of_calving},
        ${calving_status} ,
        ${use_of_calf},
        ${JSON.stringify(use_of_calf_other)},
        ${JSON.stringify(calf_tag_id)},
        ${body_condition_score2},

        ${JSON.stringify(color_array2)},
        ${JSON.stringify(deformaties_array2)},

        ${JSON.stringify(other_calf_deformities2)}, 
        ${heart_girth2},
        ${JSON.stringify(calf_name2)},
        ${calf_sex2},
        ${calf_weight2},
        ${JSON.stringify(ease_of_calving_other2)},      
        ${JSON.stringify(calving_type_other2)},
        ${calving_type2},
        ${ease_of_calving2},
        ${calving_status2},
        ${use_of_calf2},
        ${JSON.stringify(use_of_calf_other2)},
        ${JSON.stringify(calf_tag_id2)} 
    )`;


    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//Milking events

//view miking records
router.get('/api/v1.0/events/milking/animal/:parameter/:option', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { parameter, option } = req.params;
  const sql = `CALL sp_event_milking_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//create Milking event
router.post('/api/v1.0/events/milking', async (req, res) => {

  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { animal_id, milk_date, days_in_milk, lactation_id, lactation_number, milking_notes, milk_sample_type_id, milk_pm_litres, milk_butter_fat, milk_lactose, milk_mid_day, milk_protein, milk_am_litres, milk_somatic_cell_count, milk_urea, testday_no, milk_Weight, field_agent_id, created_by } = req.body;
    const dry_date = null;
    const cow_status = 1;
    const sql = `CALL sp_create_event_milking(${animal_id},${JSON.stringify(milk_date)} ,${days_in_milk} ,${lactation_id} ,${lactation_number},${JSON.stringify(milking_notes)} ,${milk_sample_type_id} ,${milk_pm_litres} ,${milk_butter_fat} ,${milk_lactose} ,${milk_mid_day} ,${milk_protein},${milk_am_litres} ,${milk_somatic_cell_count} ,${milk_urea},${testday_no},${milk_Weight},${field_agent_id} ,${created_by},null,${cow_status}, ${dry_date})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//updating Milking record
router.put('/api/v1.0/events/milking/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const event_id = req.params.id;
    const { milk_date, days_in_milk, lactation_id, lactation_number, milking_notes, milk_sample_type_id, milk_pm_litres, milk_butter_fat, milk_lactose, milk_mid_day, milk_protein, milk_am_litres, milk_somatic_cell_count, milk_urea, testday_no, milk_Weight, field_agent_id, updated_by } = req.body;
    const sql = `CALL sp_update_event_milking(${event_id},${JSON.stringify(milk_date)} ,${days_in_milk} ,${lactation_id} ,${JSON.stringify(lactation_number)},${JSON.stringify(milking_notes)} ,${milk_sample_type_id} ,${milk_pm_litres} ,${milk_butter_fat} ,${milk_lactose} ,${milk_mid_day} ,${milk_protein},${milk_am_litres} ,${milk_somatic_cell_count} ,${milk_urea},${testday_no},${milk_Weight},${field_agent_id} ,${updated_by} )`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

router.get('/api/v1.0/events/milking/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_record_milking_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/events/milking/parameters/:option/:animal_id/:milk_date/:lactation_number', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { animal_id, milk_date, option, lactation_number } = req.params;
  const sql = `CALL sp_set_milking_parameters(${option},${animal_id},${JSON.stringify(milk_date)},${lactation_number})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//health events
//view health records
router.get('/api/v1.0/events/health/animal/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_heath_view(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//create health event
router.post('/api/v1.0/events/health', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { animal_id, health_date, health_category, drug_cost, health_provider, health_type, other_health_type, field_agent_id, created_by } = req.body;
  const sql = `CALL sp_create_event_health(${animal_id} ,${JSON.stringify(health_date)} ,${JSON.stringify(health_category)},${drug_cost},${health_provider},${health_type},${JSON.stringify(other_health_type)},${JSON.stringify(field_agent_id)},${created_by} )`;
  await query(conn, sql).then(e => { res.status(200).json({ status: 200, message: "success" }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


//view specific health record : filter by event id
router.get('/api/v1.0/events/health/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_event_record_view_health(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//update Health Record
router.put('/api/v1.0/events/health/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const event_id = req.params.id;
  const { health_date, health_category, drug_cost, health_provider, health_type, other_health_type, field_agent_id, updated_by } = req.body;
  const sql = `CALL sp_update_event_health(${event_id},${JSON.stringify(health_date)} ,${JSON.stringify(health_category)},${drug_cost},${health_provider},${health_type},${JSON.stringify(other_health_type)},${JSON.stringify(field_agent_id)},${updated_by} )`;
  await query(conn, sql).then(e => { res.status(200).json({ status: 200, message: "success" }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

//events menu setup
router.get('/api/v1.0/events/setup/:id', async (req, res) => {
  const animal_id = req.params.id;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_menu_setup_view(${animal_id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/events/setup', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_menu_setup_all_view()`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.put('/api/v1.0/events/setup/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const animal_type_id = req.params.id;
  const { calving, milking, health, bio_data, insemination, sync, exit, weight, pd,hair, updated_by } = req.body;
  const sql = `CALL sp_update_event_menu_setup(${calving},${milking},${health},${bio_data},${insemination},${sync},${exit},${weight},${pd},${hair},${updated_by},${animal_type_id})`;
  await query(conn, sql).then(e => { res.status(200).json({ status: 200, message: "success" }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

// create hoof health event
router.post('/api/v1.0/events/hoof-health', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { id, exam_date, other_hoof_problems, swelling_of_coronet, digital_dermatitis, heel_horn_erosion, horizontal_horn_fissure, interdigital_hyperplasia, interdigital_phlegmon, scissor_claws, vertical_horn_fissure, field_agent_id, user_id } = req.body;
    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateHoofHealthEventRecord(${createOrUpdateFlag},${id},${JSON.stringify(exam_date)},${digital_dermatitis},${interdigital_hyperplasia},${interdigital_phlegmon},${scissor_claws},${horizontal_horn_fissure},${vertical_horn_fissure},${swelling_of_coronet},${heel_horn_erosion},${JSON.stringify(other_hoof_problems)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit hoof health event record
router.put('/api/v1.0/events/hoof-health/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const record_id = req.params.id;
    const createOrUpdateFlag = 1;
    const { exam_date, other_hoof_problems, swelling_of_coronet, digital_dermatitis, heel_horn_erosion, horizontal_horn_fissure, interdigital_hyperplasia, interdigital_phlegmon, scissor_claws, vertical_horn_fissure, field_agent_id, user_id } = req.body;
    const sql = `CALL sp_CreateOrUpdateHoofHealthEventRecord(${createOrUpdateFlag},${record_id},${JSON.stringify(exam_date)},${digital_dermatitis},${interdigital_hyperplasia},${interdigital_phlegmon},${scissor_claws},${horizontal_horn_fissure},${vertical_horn_fissure},${swelling_of_coronet},${heel_horn_erosion},${JSON.stringify(other_hoof_problems)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//get all hoof health records
router.get('/api/v1.0/events/hoof-health/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_hoof_heath_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

// create animal injury event record
router.post('/api/v1.0/events/injury', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { id, treatmentDate, injury_type, injury_type_other, injury_service_provider, other_service_provider, injury_service_cost, injury_drug_cost, injury_cow_status, injury_cow_status_other, field_agent_id, user_id } = req.body;
    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateInjuryEventRecord(${createOrUpdateFlag},${id},${JSON.stringify(treatmentDate)},${injury_type},${JSON.stringify(injury_type_other)},${injury_service_provider},${JSON.stringify(other_service_provider)},${injury_drug_cost},${injury_service_cost},${injury_cow_status},${JSON.stringify(injury_cow_status_other)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit animal injury event record
router.put('/api/v1.0/events/injury/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const record_id = req.params.id;
    const createOrUpdateFlag = 1;
    const { treatmentDate, injury_type, injury_type_other, injury_service_provider, other_service_provider, injury_service_cost, injury_drug_cost, injury_cow_status, injury_cow_status_other, field_agent_id, user_id } = req.body;
    const sql = `CALL sp_CreateOrUpdateInjuryEventRecord(${createOrUpdateFlag},${record_id},${JSON.stringify(treatmentDate)},${injury_type},${JSON.stringify(injury_type_other)},${injury_service_provider},${JSON.stringify(other_service_provider)},${injury_drug_cost},${injury_service_cost},${injury_cow_status},${JSON.stringify(injury_cow_status_other)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//get all animal injury event record
router.get('/api/v1.0/events/injury/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_animal_injury_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


// Create Parasite Infection Event Record
router.post('/api/v1.0/events/parasite-infection', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { id, parasite_date, parasite_type, parasite_type_other, parasite_provider, parasite_provider_other, parasite_service_cost, parasite_drug_cost, parasite_cow_status, parasite_cow_status_other, field_agent_id, user_id } = req.body;
    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateParasiteInfectionEventRecord(${createOrUpdateFlag},${id},${JSON.stringify(parasite_date)},${parasite_type},${JSON.stringify(parasite_type_other)},${parasite_provider},${JSON.stringify(parasite_provider_other)},${parasite_drug_cost},${parasite_service_cost},${parasite_cow_status},${JSON.stringify(parasite_cow_status_other)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit Parasite Infection event record
router.put('/api/v1.0/events/parasite-infection/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const record_id = req.params.id;
    const createOrUpdateFlag = 1;
    const { parasite_date, parasite_type, parasite_type_other, parasite_provider, parasite_provider_other, parasite_service_cost, parasite_drug_cost, parasite_cow_status, parasite_cow_status_other, field_agent_id, user_id } = req.body;
    const sql = `CALL sp_CreateOrUpdateParasiteInfectionEventRecord(${createOrUpdateFlag},${record_id},${JSON.stringify(parasite_date)},${parasite_type},${JSON.stringify(parasite_type_other)},${parasite_provider},${JSON.stringify(parasite_provider_other)},${parasite_drug_cost},${parasite_service_cost},${parasite_cow_status},${JSON.stringify(parasite_cow_status_other)},${field_agent_id},${user_id})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//get all Parasite Infection event record
router.get('/api/v1.0/events/parasite-infection/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_parasite_infection_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


// Create Hoof Treatment Event Record
router.post('/api/v1.0/events/hoof-treatment', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });

    const { id, treatment_date, hoof_problem, hoof_treatment_type, hoof_treatment_type_other, hoof_treatment_provider, hoof_treatment_provider_other, hoof_treatment_drug_cost, hoof_treatment_service_cost, hoof_treatment_cow_status, hoof_treatment_cow_status_other, field_agent_id, user_id } = req.body;
    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateHoofTreatmentEventRecord(
        ${createOrUpdateFlag},
        ${id},
        ${JSON.stringify(treatment_date)},
        ${hoof_problem},
        ${hoof_treatment_type},
        ${JSON.stringify(hoof_treatment_type_other)},
        ${hoof_treatment_provider},
        ${JSON.stringify(hoof_treatment_provider_other)},
        ${hoof_treatment_drug_cost},
        ${hoof_treatment_service_cost},
        ${hoof_treatment_cow_status},
        ${JSON.stringify(hoof_treatment_cow_status_other)},
        ${field_agent_id},
        ${user_id}
    )`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit Hoof Treatment event record
router.put('/api/v1.0/events/hoof-treatment/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const record_id = req.params.id;
    const createOrUpdateFlag = 1;
    const { treatment_date, hoof_problem, hoof_treatment_type, hoof_treatment_type_other, hoof_treatment_provider, hoof_treatment_provider_other, hoof_treatment_drug_cost, hoof_treatment_service_cost, hoof_treatment_cow_status, hoof_treatment_cow_status_other, field_agent_id, user_id } = req.body;
    const sql = `CALL sp_CreateOrUpdateHoofTreatmentEventRecord(${createOrUpdateFlag},${record_id},${JSON.stringify(treatment_date)},${hoof_problem},${hoof_treatment_type},${JSON.stringify(hoof_treatment_type_other)},${hoof_treatment_provider},${JSON.stringify(hoof_treatment_provider_other)},${hoof_treatment_drug_cost},${hoof_treatment_service_cost},${hoof_treatment_cow_status},${JSON.stringify(hoof_treatment_cow_status_other)},${field_agent_id},${user_id})`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//get all Hoof Treatment event record
router.get('/api/v1.0/events/hoof-treatment/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_hoof_treatment_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});



// Create Vaccination Event Record
router.post('/api/v1.0/events/vaccination', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const {
      id,
      vacc_vaccine_date,
      vacc_vaccine_type,
      vacc_vaccine_type_other,
      vacc_vaccine_provider,
      vacc_vaccine_provider_other,
      vacc_vaccine_drug_cost,
      vacc_vaccine_service_cost,
      vacc_vaccine_cow_status,
      vacc_vaccine_cow_status_other,
      ecf_supervisor,
      ecf_provider,
      ecf_provider_mobile,
      ecf_vial_batch,
      ecf_dilution_time,
      ecf_first_immunization,
      ecf_last_immunization,
      ecf_vaccination_weight,
      ecf_vaccination_otc,
      ecf_vaccination_alb,
      ecf_vaccination_temp,
      ecf_vaccination_payment_modes,
      ecf_vaccination_cost,
      ecf_vaccination_is_subsidised,
      ecf_vaccination_voucher,
      user_id
    } = req.body;

    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateVaccinationEventRecord(
        ${createOrUpdateFlag},
        ${id},
        ${JSON.stringify(vacc_vaccine_date)},
        ${vacc_vaccine_type},
        ${JSON.stringify(vacc_vaccine_type_other)},
        ${vacc_vaccine_provider},
        ${JSON.stringify(vacc_vaccine_provider_other)},
        ${vacc_vaccine_drug_cost},
        ${vacc_vaccine_service_cost},
        ${vacc_vaccine_cow_status},
        ${JSON.stringify(vacc_vaccine_cow_status_other)},
        ${ecf_supervisor},
        ${ecf_provider},
        ${JSON.stringify(ecf_provider_mobile)},
        ${JSON.stringify(ecf_vial_batch)},
        ${JSON.stringify(ecf_dilution_time)},
        ${JSON.stringify(ecf_first_immunization)},
        ${JSON.stringify(ecf_last_immunization)},
        ${ecf_vaccination_weight},
        ${ecf_vaccination_otc},
        ${ecf_vaccination_alb},
        ${ecf_vaccination_temp},
        ${ecf_vaccination_payment_modes},
        ${ecf_vaccination_cost},
        ${ecf_vaccination_is_subsidised},
        ${JSON.stringify(ecf_vaccination_voucher)}, 
        ${user_id}
    )`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit Vaccination event record
router.put('/api/v1.0/events/vaccination/:id', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const record_id = req.params.id;
    const createOrUpdateFlag = 1;
    const {
      vacc_vaccine_date,
      vacc_vaccine_type,
      vacc_vaccine_type_other,
      vacc_vaccine_provider,
      vacc_vaccine_provider_other,
      vacc_vaccine_drug_cost,
      vacc_vaccine_service_cost,
      vacc_vaccine_cow_status,
      vacc_vaccine_cow_status_other,
      ecf_supervisor,
      ecf_provider,
      ecf_provider_mobile,
      ecf_vial_batch,
      ecf_dilution_time,
      ecf_first_immunization,
      ecf_last_immunization,
      ecf_vaccination_weight,
      ecf_vaccination_otc,
      ecf_vaccination_alb,
      ecf_vaccination_temp,
      ecf_vaccination_payment_modes,
      ecf_vaccination_cost,
      ecf_vaccination_is_subsidised,
      ecf_vaccination_voucher,
      user_id
    } = req.body;

    const sql = `CALL sp_CreateOrUpdateVaccinationEventRecord(
            ${createOrUpdateFlag},
            ${record_id},
            ${JSON.stringify(vacc_vaccine_date)},
            ${vacc_vaccine_type},
            ${JSON.stringify(vacc_vaccine_type_other)},
            ${vacc_vaccine_provider},
            ${JSON.stringify(vacc_vaccine_provider_other)},
            ${vacc_vaccine_drug_cost},
            ${vacc_vaccine_service_cost},
            ${vacc_vaccine_cow_status},
            ${JSON.stringify(vacc_vaccine_cow_status_other)},
            ${ecf_supervisor},
            ${ecf_provider},
            ${JSON.stringify(ecf_provider_mobile)},
            ${JSON.stringify(ecf_vial_batch)},
            ${JSON.stringify(ecf_dilution_time)},
            ${JSON.stringify(ecf_first_immunization)},
            ${JSON.stringify(ecf_last_immunization)},
            ${ecf_vaccination_weight},
            ${ecf_vaccination_otc},
            ${ecf_vaccination_alb},
            ${ecf_vaccination_temp},
            ${ecf_vaccination_payment_modes},
            ${ecf_vaccination_cost},
            ${ecf_vaccination_is_subsidised},
            ${JSON.stringify(ecf_vaccination_voucher)}, 
            ${user_id}
        )`;

    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

//get all Vaccination event record
router.get('/api/v1.0/events/vaccination/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_vaccination_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


/* 
  Event Capture validations
  -> checks if a event capture validation e.g 1) cannot capture milk record without lactation details
                                              2) Only capture milk records for cows & heifers
                                              3) Cannot capture calving details when the animal was not pregnant
                                              4) cannot capture insemination rec for bulls & calfs etc


*/
router.get('/api/v1.0/events/data-capture-validation/:option/:animal_id', async (req, res) => {
  const { animal_id, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_validate_data_capture(${option},${animal_id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


/* Hair Sampling */
// create hair Sample record


router.post('/api/v1.0/events/hair-sample', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { id, event_date, barcode,field_agent_id, user} = req.body;
    const createOrUpdateFlag = 0;
    const sql = `CALL sp_CreateOrUpdateHairSample(${createOrUpdateFlag},${id},${JSON.stringify(event_date)},${barcode},${field_agent_id},${user})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});

// edit animal injury event record
router.put('/api/v1.0/events/hair-sample', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const createOrUpdateFlag = 1;
    const { id, event_date, barcode,field_agent_id, user} = req.body;
    const sql = `CALL sp_CreateOrUpdateHairSample(${createOrUpdateFlag},${id},${JSON.stringify(event_date)},${barcode},${field_agent_id},${user})`;
    await query(conn, sql).then(
      response => {
        res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
      })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }
});


//get hair-sample(s)
router.get('/api/v1.0/events/hair-sample/:parameter/:option', async (req, res) => {
  const { parameter, option } = req.params;
  const conn = await connection(dbConfig).catch(e => { return e; });
  const sql = `CALL sp_event_hair_sample_view(${parameter},${option})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response[0] }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});





module.exports = router









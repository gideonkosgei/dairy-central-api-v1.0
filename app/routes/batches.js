const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

   //create new limit parameter
   router.post('/api/v1.0/batches/milking/upload', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {rows ,cols,created_by,org_id,uuid} = req.body; 
    const batch_type = 1;
    
    const rows_clone = rows.slice(1)   
    let i = 0;

    for (i; i<rows_clone.length; i++){
      rows_clone[i].push(uuid);
    }  

    var jString = JSON.stringify(rows_clone);
    jString = jString.substr(1);
    jString = jString.substring(0,jString.length-1);
    jString = jString.replace(/\[/g, "(");
    jString = jString.replace(/\]/g, ")");                  
    const sql = `CALL sp_create_batch_upload_milk( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;   
    query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
    .catch(e=>{res.status(400).json({status:400, message:e })});      
});


// view batched on validation queue
router.get('/api/v1.0/batches/validation/:uuid', async (req, res) => {
  const uuid = req.params.uuid;    
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_view_batch_upload_validate_step('${uuid}')`;
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// actions on  batch i.e validation or discard or progress &  post
router.post('/api/v1.0/batches/action', async (req, res) => { 
  const {action,uuid,user} = req.body; 
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_action(${JSON.stringify(uuid)},${action},${user})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
 });

// view batch records based on organization and step. Filters -> org_id, step
router.get('/api/v1.0/batches/view/:type/:org/:step/:user', async (req, res) => {
  const {org,step,user,type} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_view_records(${type},${org},${step},${user})`;   
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


// view deleted batches based on organization and step. 
router.get('/api/v1.0/batches/deleted/:type/:org/:user', async (req, res) => {
  const {org,user,type} = req.params;  
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_view_deleted_records(${type},${org},${user})`;       
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// view POSTED batches based on organization and step. 
router.get('/api/v1.0/batches/posted/:type/:org/:user', async (req, res) => {
  const {org,user,type} = req.params;  
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_view_posted_batches(${type},${org},${user})`;
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// view error details of a batch milk record
router.get('/api/v1.0/batches/errors/:record_id/:batch_type', async (req, res) => {
  const {record_id,batch_type} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_process_view_record_error(${record_id},${batch_type})`;    
 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/batches/template/:type/:org', async (req, res) => {
  const {org,type} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_get_template(${type},${org})`;       
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

/* Weight & Growth Batches*/
router.post('/api/v1.0/batches/weight/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 2;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_weight( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;   
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
});


/* Synchronization Batches*/
router.post('/api/v1.0/batches/sync/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 6;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_sync( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;  
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
});

/* Animal Registration Batches*/
router.post('/api/v1.0/batches/animal/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 8;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_animal( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;  
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
});

/* Calving Batches*/
router.post('/api/v1.0/batches/calving/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 7;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_calving( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;  
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
});



/* pd Batches*/
router.post('/api/v1.0/batches/pd/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 3;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_pd( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;   
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
}); 


/* AI Batches*/
router.post('/api/v1.0/batches/ai/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 5;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_ai( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;   
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
}); 
module.exports = router


/* Exit Batches*/
router.post('/api/v1.0/batches/exit/upload', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const {rows ,cols,created_by,org_id,uuid} = req.body; 
  const batch_type = 4;  
  const rows_clone = rows.slice(1)   
  let i = 0;
  for (i; i<rows_clone.length; i++){
    rows_clone[i].push(uuid);
  }  
  var jString = JSON.stringify(rows_clone);
  jString = jString.substr(1);
  jString = jString.substring(0,jString.length-1);
  jString = jString.replace(/\[/g, "(");
  jString = jString.replace(/\]/g, ")");                  
  const sql = `CALL sp_create_batch_upload_exit( ${batch_type},'${JSON.stringify(rows)}','${JSON.stringify(cols)}',${org_id},${created_by},${JSON.stringify(uuid)},${JSON.stringify(jString)})`;   
  query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})})
  .catch(e=>{res.status(400).json({status:400, message:e })});      
}); 

//get batch record using record id
router.get('/api/v1.0/batches/record/any/:batch_type/:record_id', async (req, res) => {   
  const {batch_type,record_id} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_batch_view_record(${batch_type},${record_id})`;  
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.put('/api/v1.0/batches/milking/modify-and-revalidate', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});      
      const {amount_afternoon,amount_morning,amount_noon,animal_id,milk_date,record_id,user_id,batch_type,remove} = req.body; 
      const sql = `CALL sp_batch_milking_modify_revalidate(${amount_afternoon},${amount_morning},${amount_noon},${animal_id},${JSON.stringify(milk_date)},${record_id},${user_id},${batch_type},${remove})`; 
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }        
});

router.put('/api/v1.0/batches/weight/modify-and-revalidate', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});      
      const {body_length, body_score, body_weight, heart_girth, weight_date, animal_id,remove,record_id,user_id,batch_type} = req.body; 
     
      const sql = `CALL sp_batch_weight_modify_revalidate(${body_length},${body_score},${body_weight},${heart_girth},${JSON.stringify(weight_date)},${animal_id},${remove},${record_id},${user_id},${batch_type})`; 
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});

router.put('/api/v1.0/batches/ai/modify-and-revalidate', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});      
      const {ai_tech,ai_type_id,animal_id,batch_type,body_score,cost,record_id,remove,service_date,straw_id,user_id} = req.body; 
      const sql = `CALL sp_batch_ai_modify_revalidate(${ai_tech},${straw_id},${body_score},${ai_type_id},${cost},${JSON.stringify(service_date)},${animal_id},${remove},${record_id},${user_id},${batch_type})`; 
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});


router.put('/api/v1.0/batches/animal/modify-and-revalidate', async (req, res) => { 
  try{ 
   
      const conn = await connection(dbConfig).catch(e => {return e;});      
      const {record_id,user_id,animal_name,animal_type_id,breed_composition_id,color_id,dam_tag_id,dob,entry_type_id,main_breed_id,remove,sec_breed_id,sex_id,sire_tag_id,sire_type_id,tag_id} = req.body; 
      const sql = `CALL sp_batch_animal_modify_revalidate(${record_id},${user_id},${JSON.stringify(animal_name)},${animal_type_id},${breed_composition_id},${color_id},${JSON.stringify(dam_tag_id)},${JSON.stringify(dob)},${entry_type_id},${main_breed_id},${remove},${sec_breed_id},${sex_id},${JSON.stringify(sire_tag_id)},${sire_type_id},${JSON.stringify(tag_id)})`; 
    
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});

// VIEW BATCH TYPES
router.get('/api/v1.0/batches/types/all', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});  
      const sql = "SELECT id,name FROM interface_batch_types";
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({payload:response}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});

// VIEW BATCH STAGES
router.get('/api/v1.0/batches/stages/all', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});  
      const sql = "SELECT step id,name FROM interface_batch_stages";
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({payload:response}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});

// VIEW BATCH STATUS
router.get('/api/v1.0/batches/status/all', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});  
      const sql = "SELECT id,name FROM interface_batch_status";
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({payload:response}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});

// VIEW BATCH VALIDATION STATUS
router.get('/api/v1.0/batches/validation-status/all', async (req, res) => { 
  try{     
      const conn = await connection(dbConfig).catch(e => {return e;});  
      const sql = "SELECT id,name from interface_batch_records_status";
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({payload:response}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
  }         
});


// VIEW BATCH REPORT ALL
router.get('/api/v1.0/batches/report/all/:org/:type/:stage/:status/:user', async (req, res) => { 
  try{ 
      const {org,type,stage,status,user} = req.params;      
      const conn = await connection(dbConfig).catch(e => {return e;});      
      const sql = `CALL sp_rpt_batch_all(${org},${type},${stage},${status},${user})`;    
      await query(conn, sql)
      .then(
        response => {            
        res.status(200).json({payload:response}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })}); 
      } catch (error) {
        res.send({status:0,message:`system error! ${error.message}`})
      }         
});

module.exports = router
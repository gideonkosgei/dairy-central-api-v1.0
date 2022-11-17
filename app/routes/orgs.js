const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/orgs', async (req, res) => {     
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_org_all_view()`;     
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/orgs/:option/:id', async (req, res) => {  
  const {id,option} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_ViewOrgOrOrgs(${option},${id})`;    
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});


router.post('/api/v1.0/org', async (req, res) => { 
  try {    
  const conn = await connection(dbConfig).catch(e => {return e;}); 
  const { user,org_name,country} = req.body; 
  const option = 0;
  const id = null;

  const sql = `CALL sp_CreateOrUpdateOrgRecord(
    ${option},
    ${id},    
    ${JSON.stringify(org_name)},   
    ${country},   
    ${user}   
    )`;        

  await query(conn, sql).then(
    response => {            
    res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
  })
  .catch(e => {res.status(400).json({status:400, message:e })}); 
  } catch(error) {
    res.send({status:0,message:`system error! ${error.message}`});
  }   
});



router.put('/api/v1.0/org', async (req, res) => { 
  try {    
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const { user,org_name,country,org_id} = req.body; 
  const option = 1;

  const sql = `CALL sp_CreateOrUpdateOrgRecord(
    ${option},
    ${org_id},    
    ${JSON.stringify(org_name)},   
    ${country},   
    ${user}   
    )`;        

  await query(conn, sql).then(
    response => {            
    res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
  })
  .catch(e => {res.status(400).json({status:400, message:e })}); 

  } catch(error) {
    res.send({status:0,message:`system error! ${error.message}`});
  }   
});

router.get('/api/v1.0/org/unit-access/:account/:unit_type/:display_option/:user', async (req, res) => {   
  const {account,unit_type,display_option,user} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_view_unit_access(${account},${unit_type},${display_option},${user})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

router.put('/api/v1.0/orgs/access/:id', async (req, res) => {  
  const {orgs,created_by} = req.body;  
  let org_access = '';
  if (orgs.length>0){
    for (var i = 0; i<orgs.length;i++){
      org_access += `,${orgs[i]}`
    }
  } else {
    org_access = null;
  }

  if(org_access) {
    org_access = org_access.replace(',', '');     
  }
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_org_access_create(${JSON.stringify(org_access)},${user},${created_by})`;
  console.log(sql);
  await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
});




















































router.put('/api/v1.0/unit-add-remove-access', async (req, res) => {   
  try { 
    const {account_id,user_id,unit_type,units,action} = req.body;

    let units_str = '';
    /**
     * Do not do any trasformations if action is add
     * for remove , the units is an array that needs to be exploded
     * for add, the units is an integer value
     */
    if (action === 0) { 
      if (units.length>0){
        for (var i = 0; i<units.length;i++){
          units_str += `,${units[i]}`
        }
      } else {
        units_str = null;
      }
  
      if(units_str) {
        units_str = units_str.replace(',', '');     
      } 
    } else {
     units_str = units;
    }
    
    const output  = 1; 
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const sql = `CALL sp_UnitAddOrRemoveAccess(${JSON.stringify(units_str)},${unit_type},${account_id},${user_id},${action},${output})`;
    await query(conn, sql).then(
      response => {            
      res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
    })
    .catch(e => {res.status(400).json({status:400, message:e })});

} catch(error) {
  res.send({status:0,message:`system error! ${error.message}`});
}  
});


router.put('/api/v1.0/orgs/switch/access', async (req, res) => { 
  try{  
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const {org,user} = req.body;    
  const sql = `CALL sp_org_switch(${org},${user})`; 
  console.log(sql);
  await query(conn, sql).then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })});       
    } catch(error) {
        res.send({status:0,message:`system error! ${error.message}`});
    } 
});


router.put('/api/v1.0/org/farm-allocation', async (req, res) => { 
  try{  
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const {org,farm,user} = req.body;    
  const sql = `CALL sp_org_farm_allocation(${org},${farm},${user})`; 
  await query(conn, sql).then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })});       
    } catch(error) {
        res.send({status:0,message:`system error! ${error.message}`});
    } 
});


// Delink farm unit from org unit
router.put('/api/v1.0/org/delink-farm-unit', async (req, res) => { 
  try{ 
  const conn = await connection(dbConfig).catch(e => {return e;});  
  const {farm_id,user_id,org_id} = req.body;    
  const sql = `CALL sp_delink_farm_from_org(${org_id},${farm_id},${user_id})`;  
  await query(conn, sql).then(
        response => {            
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
      })
      .catch(e => {res.status(400).json({status:400, message:e })});       
    } catch(error) {
        res.send({status:0,message:`system error! ${error.message}`});
    } 
});


module.exports = router
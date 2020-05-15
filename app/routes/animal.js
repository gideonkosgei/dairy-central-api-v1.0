const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/animal', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    
    let sql = `select 
    id,
    animal.tag_id tag, 
    animal.name name,    
    animal.birthdate birt_date,
    animal.reg_date reg_date,
    (select label from core_master_list list where list.list_type_id = 13 and list.value = animal.sire_type ) as sire_type,
    animal.sire_tag_id sire_tag, 
    animal.dam_tag_id dam_tag,
    (select label from core_master_list list where list.list_type_id = 3 and list.value = animal.sex ) as sex,  
    (select label from core_master_list list where list.list_type_id = 8 and list.value = animal.main_breed ) as breed, 
    (select label from core_master_list list where list.list_type_id = 14 and list.value = animal.breed_composition ) as breed_composition     
    from core_animal  animal order by id limit 100`; 

    const payload = await query(conn, sql).catch(e=>{return e;});    
    res.send(payload);
  });

  router.get('/api/v1.0/animalDetails', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const payload = await query(conn, 'select  name,tag_id,farm_id from core_animal limit 10').catch(e=>{return e;});   
    res.json({ payload });
  });

  module.exports = router
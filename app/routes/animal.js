const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/animal', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    
    let sql = `select 
    ID ANIMAL_ID,
    animal.tag_id TAG, 
    animal.name NAME,    
    animal.birthdate BIRTH_DATE,
    animal.reg_date REG_DATE,
    (select label from core_master_list list where list.list_type_id = 13 and list.value = animal.sire_type ) as SIRE_TYPE,
    animal.sire_tag_id SIRE_TAG, 
    animal.dam_tag_id DAM_TAG,
    (select label from core_master_list list where list.list_type_id = 3 and list.value = animal.sex ) as SEX,  
    (select label from core_master_list list where list.list_type_id = 8 and list.value = animal.main_breed ) as BREED, 
    (select label from core_master_list list where list.list_type_id = 14 and list.value = animal.breed_composition ) as BREED_COMPOSITION     
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
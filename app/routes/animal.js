const express = require("express");
var router = express.Router();

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');
router.get('/api/v1.0/animal', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    
    const sql = `select 
    id,
    animal.tag_id tag, 
    animal.name name,    
    DATE_FORMAT(animal.birthdate, '%Y-%m-%d') birt_date,
    DATE_FORMAT(animal.reg_date, '%Y-%m-%d') reg_date,
    (select label from core_master_list list where list.list_type_id = 13 and list.value = animal.sire_type ) as sire_type,
    animal.sire_tag_id sire_tag, 
    animal.dam_tag_id dam_tag,
    (select label from core_master_list list where list.list_type_id = 3 and list.value = animal.sex ) as sex,  
    (select label from core_master_list list where list.list_type_id = 8 and list.value = animal.main_breed ) as breed, 
    (select label from core_master_list list where list.list_type_id = 14 and list.value = animal.breed_composition ) as breed_composition     
    from core_animal  animal   order by id limit 100`; 
    //where animal.country_id=11
    const payload = await query(conn, sql).catch(e=>{return e;});    
    res.send(payload);
  });

  router.get('/api/v1.0/animalDetails', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const payload = await query(conn, 'select  name,tag_id,farm_id from core_animal limit 10').catch(e=>{return e;});   
    res.json({ payload });
  });

  
  router.get('/api/v1.0/animalStats/:id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const id = req.params.id;
    const sql = `select * from v_animal_overview_statistics where org_id = ${id}`;
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

  router.get('/api/v1.0/animals/org/:org_id', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {return e;}); 
    const {org_id} = req.params;
    const sql = `SELECT 
    core_animal.id as animal_id,
    core_animal.name as animal_name,
    core_animal.herd_id,
    herd.name as herd_name,
    core_animal.org_id,
    core_animal.sex as sex_id,
    (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 3) AND (list.value = core_animal.sex))) AS sex,              
    core_animal.tag_id,
    core_animal.farm_id,
    core_animal.sire_type as sire_type_id,
    (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 13) AND (list.value = core_animal.sire_type))) AS sire_type,              
    core_animal.sire_id,
    core_animal.sire_tag_id,
    core_animal.dam_id,
    core_animal.dam_tag_id,
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."91"')),'null','') AS aproximateage, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."225"')),'null','') AS animalGrade, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."226"')),'null','') AS notes, 
    core_animal.animal_photo AS animalPhoto, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."57"')),'null','') AS tagPrefix, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."58"')),'null','') AS tagSequence, 
    ifnull(core_animal.animal_type,0) AS animal_type_id,
    ifnull((SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 62) AND (list.value = core_animal.animal_type))),'Uncategorized') AS animalType, 
    DATE_FORMAT(core_animal.reg_date, '%Y-%m-%d') as registration_date, 
    DATE_FORMAT(core_animal.birthdate, '%Y-%m-%d') as dateofBirth,      
    core_animal.main_breed AS main_breed_id,
    (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 8) AND (list.value = core_animal.main_breed))) AS main_breed, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."147"')),'null','') AS breedCombination, 
    core_animal.breed_composition AS breedComposition_id, 
    (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 14) AND (list.value = core_animal.breed_composition))) AS breedComposition, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."223"')),'null','') AS breedCompositiondetails, 
    JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."254"')) AS color, 
    JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."456"')) AS colorOther, 
    replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."232"')),'null','') AS countryofOrigin 
    FROM core_animal
    left join core_animal_herd herd 
    on core_animal.herd_id = herd.id
    where core_animal.org_id = ${org_id}`;
    
    const payload = await query(conn, sql).catch(e=>{return e;});     
    const payload_code = payload.code 
    const payLoadLength = (payload_code === 'ER_PARSE_ERROR')? 0: JSON.stringify(payload[0].length);
    if(payload_code == 'ER_PARSE_ERROR'){
          res.status(400).json({status:400, payload })
    } else if (payLoadLength<1) {
          res.status(200).json({status:204, payload });
    } else {
          res.status(200).json({status:200, payload });
    } 
  });

  router.get('/api/v1.0/animals/:animal_id', async (req, res) => {
      const conn = await connection(dbConfig).catch(e => {return e;}); 
      const {animal_id} = req.params;
      const sql = `SELECT 
      core_animal.id as animal_id,
      core_animal.name as animal_name,
      core_animal.herd_id,
      herd.name as herd_name,
      core_animal.org_id,
      core_animal.sex as sex_id,
      (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 3) AND (list.value = core_animal.sex))) AS sex,              
      core_animal.tag_id,
      core_animal.farm_id,
      core_animal.sire_type as sire_type_id,
      (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 13) AND (list.value = core_animal.sire_type))) AS sire_type,              
      core_animal.sire_id,
      core_animal.sire_tag_id,
      core_animal.dam_id,
      core_animal.dam_tag_id,
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."91"')),'null','') AS aproximateage, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."225"')),'null','') AS animalGrade, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."226"')),'null','') AS notes, 
      core_animal.animal_photo AS animalPhoto, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."57"')),'null','') AS tagPrefix, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."58"')),'null','') AS tagSequence, 
      ifnull(core_animal.animal_type,0) AS animal_type_id,
      ifnull((SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 62) AND (list.value = core_animal.animal_type))),'Uncategorized') AS animalType, 
      DATE_FORMAT(core_animal.reg_date, '%Y-%m-%d') as registration_date, 
      DATE_FORMAT(core_animal.birthdate, '%Y-%m-%d') as dateofBirth,      
      core_animal.main_breed AS main_breed_id,
      (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 8) AND (list.value = core_animal.main_breed))) AS main_breed, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."147"')),'null','') AS breedCombination, 
      core_animal.breed_composition AS breedComposition_id, 
      (SELECT list.label  FROM  core_master_list list WHERE ((list.list_type_id = 14) AND (list.value = core_animal.breed_composition))) AS breedComposition, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."223"')),'null','') AS breedCompositiondetails, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."254"')),'null','') AS color, 
      JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."456"')) AS colorOther, 
      replace(JSON_UNQUOTE(JSON_EXTRACT(core_animal.additional_attributes, '$."232"')),'null','') AS countryofOrigin 
      FROM core_animal
      left join core_animal_herd herd 
      on core_animal.herd_id = herd.id
      where core_animal.id = ${animal_id}`;
      
      const payload = await query(conn, sql).catch(e=>{return e;});     
      const payload_code = payload.code 
      const payLoadLength = (payload_code === 'ER_PARSE_ERROR')? 0: JSON.stringify(payload[0].length);
      if(payload_code == 'ER_PARSE_ERROR'){
            res.status(400).json({status:400, payload })
      } else if (payLoadLength<1) {
            res.status(200).json({status:204, payload });
      } else {
            res.status(200).json({status:200, payload });
      } 
    });


  //New Animal Registration
  router.post('/api/v1.0/animal', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});       
      const {created_by ,animal_type ,birthdate,name ,breed_composition ,hair_sample_id ,main_breed ,reg_date,sex ,tag_id ,
            breed_combination ,notes ,tag_prefix ,tag_sequence ,breed_composition_details ,color ,color_other ,country_of_origin ,
            deformities ,entry_date,entry_type ,herd_book_number ,main_breed_other ,purchase_cost ,secondary_breed ,secondary_breed_other ,
            sire_type ,sire_id ,dam_id,herd_id,org_id,farm_id} = req.body;      
      const sql = `CALL sp_create_animal(${created_by} ,${animal_type} ,${JSON.stringify(birthdate)},${JSON.stringify(name)} ,${breed_composition} ,${JSON.stringify(hair_sample_id)} ,${main_breed} ,${JSON.stringify(reg_date)},${sex} ,${JSON.stringify(tag_id)} ,
      ${JSON.stringify(breed_combination)} ,${JSON.stringify(notes)} ,${JSON.stringify(tag_prefix)} ,${JSON.stringify(tag_sequence)} ,${JSON.stringify(breed_composition_details)} ,${color} ,${JSON.stringify(color_other)} ,${JSON.stringify(country_of_origin)} ,
      ${deformities} ,${JSON.stringify(entry_date)},${entry_type} ,${JSON.stringify(herd_book_number)} ,${JSON.stringify(main_breed_other)} ,${purchase_cost} ,${secondary_breed} ,${JSON.stringify(secondary_breed_other)} ,
      ${sire_type} ,${sire_id} ,${dam_id},${herd_id},${org_id},${farm_id})`; 
      await query(conn, sql).then(e => {res.status(200).json({status:200, message:"success"})}).catch(e=>{res.status(400).json({status:400, message:e })});      
  });
  module.exports = router
const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

  router.get('/api/v1.0/animalStats/:org/:level/:herd', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const {org,level,herd} = req.params;
    const sql = `CALL sp_animal_overview_statistics_view(${org},${level},${herd})`;         
    await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/animal/:option/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const {id,option} = req.params;
      const sql = `CALL sp_animal_view(${id},${option})`;        
      await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });
      
 //view animals by animal_type
 router.get('/api/v1.0/animal/type/:org/:type', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const {org,type} = req.params;
  const sql = `CALL sp_view_animals_by_animal_type(${org},${type})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

//view animals by herd
router.get('/api/v1.0/animal/herd/:org/:herd', async (req, res) => {      
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const {org,herd} = req.params;
  const sql = `CALL sp_view_animals_by_herd(${org},${herd})`;         
  await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

  // Update animal details
  router.put('/api/v1.0/animal/:animal_id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});   
      const id = req.params.animal_id;         
      const {
            updated_by ,animal_type ,birthdate,name ,breed_composition ,hair_sample_id ,main_breed ,reg_date,sex ,tag_id ,
            breed_combination ,notes ,breed_composition_details ,color ,color_other ,country_of_origin ,
            deformities ,entry_date,entry_type ,herd_book_number ,main_breed_other ,purchase_cost ,secondary_breed ,secondary_breed_other ,
            sire_type ,sire_id ,dam_id,herd_id,org_id,farm_id
      } = req.body;           
      const sql = `CALL sp_update_animal(${id},${JSON.stringify(updated_by)} ,${JSON.stringify(animal_type)} ,${JSON.stringify(birthdate)},${JSON.stringify(name)} ,${JSON.stringify(breed_composition)} ,${JSON.stringify(hair_sample_id)} ,${JSON.stringify(main_breed)} ,${JSON.stringify(reg_date)} ,${JSON.stringify(tag_id)} ,
      ${JSON.stringify(breed_combination)} ,${JSON.stringify(notes)} ,${JSON.stringify(breed_composition_details)} ,${JSON.stringify(color)} ,${JSON.stringify(color_other)} ,${JSON.stringify(country_of_origin)} ,
      ${JSON.stringify(deformities)} ,${JSON.stringify(entry_date)},${JSON.stringify(entry_type)} ,${JSON.stringify(herd_book_number)} ,${JSON.stringify(main_breed_other)} ,${JSON.stringify(purchase_cost)} ,${JSON.stringify(secondary_breed)} ,${JSON.stringify(secondary_breed_other)} ,
      ${JSON.stringify(sire_type)} ,${JSON.stringify(sire_id)} ,${JSON.stringify(dam_id)},${JSON.stringify(herd_id)},${JSON.stringify(org_id)},${JSON.stringify(farm_id)})`; 
      
      await query(conn, sql)
      .then(response => {       
        res.status(200).json({status:response[0][0].status,message:response[0][0].message}) })
        .catch(e=>{res.status(400).json({status:400, message:e })});   
      });

  //New Animal Registration
  router.post('/api/v1.0/animal', async (req, res) => { 
      try {    
      const conn = await connection(dbConfig).catch(e => {return e;});
      const {
            created_by ,animal_type ,birthdate,name ,breed_composition ,hair_sample_id ,main_breed ,tag_id ,
            breed_combination ,notes ,breed_composition_details ,color ,color_other ,country_of_origin ,
            deformities,entry_type ,herd_book_number ,main_breed_other ,purchase_cost ,secondary_breed ,secondary_breed_other ,
            sire_type ,sire_id ,dam_id,herd_id,org_id,farm_id} = req.body;      
      const sql = `CALL sp_create_animal(${JSON.stringify(created_by)} ,${JSON.stringify(animal_type)} ,${JSON.stringify(birthdate)},${JSON.stringify(name)} ,${JSON.stringify(breed_composition)} ,${JSON.stringify(hair_sample_id)} ,${JSON.stringify(main_breed)} ,${JSON.stringify(tag_id)} ,
      ${JSON.stringify(breed_combination)} ,${JSON.stringify(notes)} ,${JSON.stringify(breed_composition_details)} ,${JSON.stringify(color)} ,${JSON.stringify(color_other)} ,${JSON.stringify(country_of_origin)} ,
      ${JSON.stringify(deformities)} ,${JSON.stringify(entry_type)} ,${JSON.stringify(herd_book_number)} ,${JSON.stringify(main_breed_other)} ,${JSON.stringify(purchase_cost)} ,${JSON.stringify(secondary_breed)} ,${JSON.stringify(secondary_breed_other)} ,
      ${JSON.stringify(sire_type)} ,${JSON.stringify(sire_id)} ,${JSON.stringify(dam_id)},${JSON.stringify(herd_id)},${JSON.stringify(org_id)},${JSON.stringify(farm_id)},null)`;        
            
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
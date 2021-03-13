const express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

router.get('/api/v1.0/user/auth', async (req, res) => {  
  const conn = await connection(dbConfig).catch(e => {return e;}); 

  /**
   * The salt value specifies how much time it’s gonna take to hash the password. 
   * The higher the salt value, more secure the password is and more time it will take for calculation. 
   * https://www.npmjs.com/package/bcrypt
   **/ 
  
    /** 
     * The code below is used to encrypt a password
    */
    
    /*const saltRounds = 10;     
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync('password@123', salt);*/    

  /**
   * Need to handle 3 things
   * 1. Wrong password
   * 2. No user found
   * 3. Authenitcated user
   */  

  const sql = `CALL sp_authenticate('${req.query.username}')`;   
  await query(conn, sql)
  .then(
    response => {  

      /**
       * Authentication status
       * false -  authentication failed
       * true - authentication succeeded
       */
      
       /**
        * Check if user is registred in the system
        * If empty object is returned, the user does not exist
        */       

      if (response[0].length > 0){ 
        if (bcrypt.compareSync(req.query.password,response[0][0].password)) {
          res.status(200).json({payload:response,auth_status:true,user_exist:true}) //password correct
        }  else {          
          res.status(200).json({payload:response,auth_status:false,user_exist:true}) // password incorrect
        }     
      } else {
        res.status(200).json({payload:response,auth_status:false,user_exist:false}) // account does not exist
      }    
})
  .catch(e => {res.status(400).json({status:400, message:e })}); 
});

router.get('/api/v1.0/user/:id', async (req, res) => {      
      const conn = await connection(dbConfig).catch(e => {return e;});     
      const id = req.params.id;
      const sql = `CALL sp_view_user_profiles(${id})`;
      await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.get('/api/v1.0/user/account-info/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});     
    const id = req.params.id;
    const sql = `CALL sp_view_user_account(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

  router.get('/api/v1.0/users/list/:option/:org', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});
    const {option,org} = req.params;
    const sql = `CALL sp_user_list_view(${option},${org})`;    
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });

  router.post('/api/v1.0/users/org/create-user-account', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});   
    let password_hash = null;   
    const {
        country,
        district,
        email,
        name,
        phone,
        region,
        timezone,
        username,
        village,
        ward,
        option,
        id,
        org,
        user,
        role,
        status
    } = req.body; 
    
    if (parseInt(option) ===0){
        /**
       * Generate randon string as password
       */
      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      function generateString(length) {
          let result = ' ';
          const charactersLength = characters.length;
          for ( let i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
      }
      let plain_text_password = generateString(10);
      plain_text_password  = 'password@123'; // use this for now till email functions
      const saltRounds = 10;     
      const salt = bcrypt.genSaltSync(saltRounds);
      password_hash = bcrypt.hashSync(plain_text_password, salt);
    } 
    /**
     * some timezone are coming as string values not key values.
     * SP is failing. 
     * Need to handle the strings > convert them to null
     */ 
    const timezone_1 = Number.isInteger(timezone) ? timezone : null;
    const sql = `CALL sp_createOrUpdateUserAccount(${option} ,${id} , ${org} , ${JSON.stringify(name)} ,${JSON.stringify(username)} , ${JSON.stringify(email)} ,${JSON.stringify(password_hash)} , ${JSON.stringify(phone)} ,${country}, ${region} , ${district} , ${village} , ${ward} , ${timezone_1} ,${user},${role},${status})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
    });

  router.get('/api/v1.0/org/:id', async (req, res) => {      
    const conn = await connection(dbConfig).catch(e => {return e;});
    const {id} = req.params;
    const sql = `CALL sp_view_org_details(${id})`;
    await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });


  /** Upload profile Pic */ 
  router.post('/api/v1.0/org/upload/profile-logo', async (req, res) => { 
    
      const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
           cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
        }
      });      
      const upload = multer({
        storage: storage,
        limits:{fileSize: 1000000},
      }).single("myImage");

      console.log(req.files);

      upload(req,res,function(err) { 
        if(err) { 
            res.send(err) 
        } 
        else { 
            // SUCCESS, image successfully uploaded 
            res.send("Success, Image uploaded!") 
        } 
    }) ;
     
 
    //const {org,user_id,image} = req.body;   
    //console.log(req);  
    //const conn = await connection(dbConfig).catch(e => {return e;}); 
    //const sql ='' ; 
    //const sql = `CALL sp_view_org_details(${id})`;
    //await query(conn, sql).then(response => {res.status(200).json({payload:response})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
  });



  module.exports = router
const express = require("express");
var router = express.Router();
const path = require("path");

const multer = require('multer');

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');

/** configs for image uploads */
/*const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb){
     cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
  }
}); */   

const storage = multer.diskStorage({
  destination: (req,file,cb)=> {
    cb(null,"./");
  },
  filename: function(req,file,cb){
    const ext = file.mimetype.split("/")[1];
    cb(null,`public/uploads/${file.originalname}-${Date.now()}.${ext}`);
  }
}); 

const upload = multer({
  storage: storage 
});


/**
 * Generate randon string as password
 */

function generateString(length) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateString(length) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
  router.post('/api/v1.0/org/upload/profile-logo/:org/:user/:type', upload.single('image'), async (req, res) => {  
    try{  
      const {org,user,type} = req.params;
      const conn = await connection(dbConfig).catch(e => {return e;}); 
      const account = (parseInt(type) === 0) ? org : user;
     
      
      if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) { 
        res.send({status:0,message:'Only image files (jpg, jpeg, png) are allowed!'})
      } else {             
     
      const sql = `CALL sp_createOrUpdateUserAccountAvatar(${type},${account},${JSON.stringify(req.file.originalname)},${JSON.stringify(req.file.filename)},${JSON.stringify(req.file.path)},${req.file.size},${user})`;  
    
      await query(conn, sql).then(
          response => {            
          res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
        })
        .catch(e => {res.status(400).json({status:400, message:e })});
      }

      } catch(error) {
        res.send({status:0,message:`system error! ${error.message}`});
    }  
     
   });

  router.put('/api/v1.0/user/account/change-password/self-service', async (req, res) => { 
    try{
        const conn = await connection(dbConfig).catch(e => {return e;}); 
        const {email, current_password, new_password, confirm_password,user,hash } = req.body;              
        const saltRounds = 10;     
        const salt = bcrypt.genSaltSync(saltRounds);
        const new_password_hash = bcrypt.hashSync(new_password, salt);   
        const sql = `CALL sp_change_account_password(${JSON.stringify(email)},${JSON.stringify(new_password_hash)},${user})`; 
       
        if  (new_password === confirm_password){ 
          if (bcrypt.compareSync(current_password,hash)) { 
            await query(conn, sql)
            .then(
              response => {            
              res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
            })
            .catch(e => {res.status(400).json({status:400, message:e })}); 
          } else {
            res.send({status:0,message:'Password Change Failed! The current password is Incorrect'})
          }        
        } else { 
          res.send({status:0,message:'Password Change Failed! The confirm password confirmation did not match'})
        }  
    }catch (error) {
      res.send({status:0,message:`system error! ${error.message}`})
    } 
  });


  
  router.put('/api/v1.0/user/account/reset-password/self-service', async (req, res) => { 
    try{

        let email_settings = {};   
        let email_template = {}; 
        const {email} = req.body;                 
        const conn = await connection(dbConfig).catch(e => {return e;}); 
        
                    
        const saltRounds = 10; 
        let plain_text_password = generateString(10);        
        plain_text_password  = 'password@123'; // use this for now till email functions    
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashed_password = bcrypt.hashSync(plain_text_password, salt);  

        const sql = `CALL sp_view_mail_settings()`;     
        const sql2 = `CALL sp_reset_forgotten_password(${JSON.stringify(email)},${JSON.stringify(hashed_password)})`;    
        const sql3 = `CALL sp_get_mail_template("user_login_details")`; 

        await query(conn, sql)
        .then(response => {   
          email_settings = {
            email_host:response[0][0].email_host,    
            email_port:parseInt(response[0][0].email_port),
            email_username:response[0][0].email_username,
            email_password:response[0][0].email_password,
            email_security:response[0][0].email_security, 
            email_theme:response[0][0].email_theme 
          }         
        })
        .catch(e=>{
          res.status(400).json({
            status:400, message:e 
          })
        });  
        
        await query(conn, sql3)
        .then(response => {  
          email_template = {
            id:response[0][0].id,
            subject:response[0][0].subject,
            body:response[0][0].body,
            sender:response[0][0].sender
          };                 
        })
        .catch(e=>{
          res.status(400).json({
            status:400, message:e 
          })
        }); 

        /*
        
        const transporter = nodemailer.createTransport({
          host: email_settings.email_host,
          port: email_settings.email_host,
          secure: false,
          auth: {
            user: "g.kipkosgei@cgiar.org", 
            pass: "Trump2024", 
          },
        });
       
        const mailOptions = {
          from: "g.kipkosgei@cgiar.org",
          to: 'mr.gkosgei@gmail.com',
          subject: email_template.subject,         
          html: `<b>Hey ${email}! </b><br/> Your new password is ${plain_text_password} <br/>`
        };  
        */
       
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            user: 'g.kipkosgei@cgiar.org', 
            pass: 'Trump2024', 
          }
        });
       
        const mailOptions = {
          from: 'g.kipkosgei@cgiar.org',
          to: 'mr.gkosgei@gmail.com',
          subject: "password change",         
          html: `<b>Hey ${email}! </b><br/> Your new password is ${plain_text_password} <br/>`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log(error);
          } else {            
            console.log('Email sent: ' + info.response);
          }
        });
               
        /*await query(conn, sql2)
        .then(
          response => {            
          res.status(200).json({status:response[0][0].status,message:response[0][0].message}) 
        })
        .catch(e => {res.status(400).json({status:400, message:e })});   
        */     


    } catch (error) {
        res.send({status:0,message:`system error! ${error.message}`})
    } 
          
  });
  module.exports = router
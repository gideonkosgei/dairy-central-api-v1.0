const express = require("express");
var router = express.Router();
const path = require("path");

const multer = require('multer');
const bcrypt = require("bcrypt");

const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const configs = require('../config/configs.js');
const mailer = require('../helpers/mailer');

/** configs for image uploads */
/*const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb){
     cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
  }
}); */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `../${configs.image_dir}/${file.originalname}-${Date.now()}.${ext}`);
    //cb(null,`D:/ADGG-LSF-MSF-v1.0/public/images/uploads/${file.originalname}-${Date.now()}.${ext}`);
  }
});

const upload = multer({
  storage: storage
});


/**
 * Generate randon string as password
 */

function generateString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.get('/api/v1.0/user/auth', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });

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

        if (response[0].length > 0) {
          if (response[0][0].password !== null) {
            if (bcrypt.compareSync(req.query.password, response[0][0].password)) {
              res.status(200).json({ payload: response, auth_status: true, user_exist: true }) //password correct
            } else {
              res.status(200).json({ payload: response, auth_status: false, user_exist: true }) // password incorrect
            }
          } else {
            res.status(200).json({ payload: response, auth_status: false, user_exist: true }) // password not set -> password incorrect
          }
        } else {
          res.status(200).json({ payload: response, auth_status: false, user_exist: false }) // account does not exist
        }
      })
    .catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/user/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_view_user_profiles(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/user/account-info/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const id = req.params.id;
  const sql = `CALL sp_view_user_account(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.get('/api/v1.0/users/list/:option/:user', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { option, user } = req.params;
  const sql = `CALL sp_user_list_view(${option},${user})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.post('/api/v1.0/users/org/create-user-account', async (req, res) => {
  try {
  const conn = await connection(dbConfig).catch(e => { return e; });
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
  
  let message = '';
  let subject = '';
  let salutation = '';
  if (parseInt(option) === 0) {

    let plain_text_password = generateString(10).trim();;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    password_hash = bcrypt.hashSync(plain_text_password, salt);
    subject = 'ADGG User Account Setup';
    salutation =  `Hi ${name},`


    message = `
    Congratulation on joining the ADGG platform. Your account has been setup successfully.<br/>    
    <h3>Account Details</h3>
    <b>username:</b> ${email}<br/>
    <b>password:</b> ${plain_text_password}<br/>    
    `;
  }
  /**
   * some timezone are coming as string values not key values.
   * SP is failing. 
   * Need to handle the strings > convert them to null
   */

  const timezone_1 = Number.isInteger(parseInt(timezone)) ? parseInt(timezone) : null;

  const sql = `CALL sp_createOrUpdateUserAccount(${option} ,${id} , ${org} , ${JSON.stringify(name)} ,${JSON.stringify(username)} , ${JSON.stringify(email)} ,${JSON.stringify(password_hash)} , ${JSON.stringify(phone)} ,${country}, ${region} , ${district} , ${village} , ${ward} , ${timezone_1} ,${user},${role},${status})`;
  await query(conn, sql)
  .then(response => {
    res.status(200).json({ payload: response });
    if (response[0][0].status === 1 && parseInt(option) === 0) {
      mailer.sendMail(email, subject, salutation, message);
    }
  }).catch(e => { 
    res.status(400).json({ status: 400, message: e }) });
} catch (error) {
  res.send({ status: 0, message: `system error! ${error.message}` })
}
});

router.get('/api/v1.0/org/:id', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { id } = req.params;
  const sql = `CALL sp_view_org_details(${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});


/** Upload profile Pic */
router.post('/api/v1.0/org/upload/profile-logo/:org/:user/:type', upload.single('image'), async (req, res) => {
  try {
    const { org, user, type } = req.params;
    const conn = await connection(dbConfig).catch(e => { return e; });
    const account = (parseInt(type) === 0) ? org : user;

    if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      res.send({ status: 0, message: 'Only image files (jpg, jpeg, png) are allowed!' })
    } else {

      const sql = `CALL sp_createOrUpdateUserAccountAvatar(${type},${account},${JSON.stringify(req.file.originalname)},${JSON.stringify(req.file.path)},${req.file.size},${user})`;
      await query(conn, sql).then(
        response => {
          res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
        })
        .catch(e => { res.status(400).json({ status: 400, message: e }) });
    }
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` });
  }

});

router.get('/api/v1.0/org/profile-logo/:id/:type', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => { return e; });
  const { id, type } = req.params;
  const sql = `CALL sp_ViewAccountAvatar(${type},${id})`;
  await query(conn, sql).then(response => { res.status(200).json({ payload: response, dir: __dirname }) }).catch(e => { res.status(400).json({ status: 400, message: e }) });
});

router.put('/api/v1.0/user/account/change-password/self-service', async (req, res) => {
  try {
    const conn = await connection(dbConfig).catch(e => { return e; });
    const { email, current_password, new_password, confirm_password, user, hash } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const new_password_hash = bcrypt.hashSync(new_password, salt);
    const sql = `CALL sp_change_account_password(${JSON.stringify(email)},${JSON.stringify(new_password_hash)},${user})`;

    if (new_password === confirm_password) {
      if (bcrypt.compareSync(current_password, hash)) {
        await query(conn, sql)
          .then(
            response => {
              res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
            })
          .catch(e => { res.status(400).json({ status: 400, message: e }) });
      } else {
        res.send({ status: 0, message: 'Password Change Failed! The current password is Incorrect' })
      }
    } else {
      res.send({ status: 0, message: 'Password Change Failed! The confirm password confirmation did not match' })
    }
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

router.put('/api/v1.0/user/account/reset-password/self-service', async (req, res) => {
  try {
    /*
        user: 'ADGGILRIsupport@cgiar.orgs', 
        pass: 'Summer@123!', 
    */

    const { email } = req.body;
    const conn = await connection(dbConfig).catch(e => { return e; });
    const saltRounds = 10;
    let plain_text_password = generateString(10).trim();
     
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashed_password = bcrypt.hashSync(plain_text_password, salt);

    const sql2 = `CALL sp_reset_forgotten_password(${JSON.stringify(email)},${JSON.stringify(hashed_password)})`;
    const message = ` A request has been received to change the password for your ADGG account.<br/><br/>
      Your new password is <b>${plain_text_password}</b> <br/><br/>
      If you did not initiate this request, Please contact us immediately at g.kipkosgei@cgiar.org <br/>
      <br/>`;

    await query(conn, sql2)
      .then(
        response => {
          res.status(200).json({ status: response[0][0].status, message: response[0][0].message });
          if (response[0][0].status === 1) {
            const salutation  = `Hi ${response[0][0].username}`;
            mailer.sendMail(email, 'ADGG Password Reset Request', salutation, message);
          }
        })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }

});
module.exports = router
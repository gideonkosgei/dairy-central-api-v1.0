const express = require("express");
var router = express.Router();
const dbConfig = require('../config/dbConfig.js');
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const axios = require('axios');
const moment = require('moment');

router.get('/api/v1.0/weather/:farm_id/:option/:date_from/:date_to', async (req, res) => {   
  const {farm_id,option,date_from,date_to} = req.params;   
  const conn = await connection(dbConfig).catch(e => {return e;});     
  const sql = `CALL sp_fetch_weather_data(${farm_id},${option},${JSON.stringify(date_from)},${JSON.stringify(date_to)})`; 
  await query(conn, sql).then(response => {res.status(200).json({payload:response[0]})}).catch(e=>{res.status(400).json({status:400, message:e })}); 
});

// invoke power NASA api
router.get('/api/v1.0/nasa-power/:rec_id/:longitude/:latitude', async (req, res) => {
  try {
    const {rec_id,longitude,latitude} = req.params; 
    const conn = await connection(dbConfig).catch(e => { return e; });
    const start_date = "20160101";
    const end_date =  moment(new Date()).format('YYYYMMDD');
   
    const api_url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2M_MAX,T2M_MIN,RH2M&community=RE&longitude=${longitude}&latitude=${latitude}&start=${start_date}&end=${end_date}`;
    console.log(api_url);
    await axios.get(api_url)
      .then(
        response => {
          console.log(respose);
          let T2M_ARRAY = Object.values(response.data.properties.parameter.T2M);
          let T2M_MAX_ARRAY = Object.values(response.data.properties.parameter.T2M_MAX);
          let T2M_MIN_ARRAY = Object.values(response.data.properties.parameter.T2M_MIN);
          let RH2M_ARRAY = Object.values(response.data.properties.parameter.RH2M);

          let array_length = T2M_ARRAY.length;             
         
          let sql_string = 'INSERT INTO weather_data.geo_point_weather_data(rec_id,YEAR,MO,DY,T2M,T2M_MAX,T2M_MIN,RH2M) VALUES';
          
          let new_date = null;
          let year = null;
          let month = null;
          let day = null;

          let T2M = null;
          let T2M_MAX = null;
          let T2M_MIN = null;
          let RH2M = null;

          for (let i = 0; i < array_length; i++) {
            new_date = moment(start_date, "YYYYMMDD").add(i,'days');
            year = moment(new_date,"YYYYMMDD").format('YYYY');
            month = moment(new_date,"YYYYMMDD").format('MM');
            day = moment(new_date,"YYYYMMDD").format('DD');            
            
            T2M = T2M_ARRAY[i];
            T2M_MAX = T2M_MAX_ARRAY[i];
            T2M_MIN = T2M_MIN_ARRAY[i];
            RH2M = RH2M_ARRAY[i];

            let delim = (i+1 === array_length) ? `;` : ',';
            sql_string += `(${rec_id},${year},${month},${day},${T2M},${T2M_MAX},${T2M_MIN},${RH2M})${delim}`;

            year = null;
            month = null;
            day = null;
          }

          let sql = `call sp_save_geo_points_weather_data(${rec_id},${JSON.stringify(sql_string)})`;  

          query(conn, sql).then(
            response => {
              res.status(200).json({ status: response[0][0].status, message: response[0][0].message })
            })
            .catch(e => { res.status(400).json({ status: 400, message: e }) });
        })
      .catch(e => { res.status(400).json({ status: 400, message: e }) });
      

  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
});

module.exports = router


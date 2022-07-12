const dbConfig = require('../config/dbConfig.js');
const connection = require('./connection');
const query = require('./query1');

async function RunBackgroundProcesses() {
  try {
    console.log('running background processes')
    const conn = await connection(dbConfig).catch(e => { return e; });
    const sql = `CALL sp_background_processor()`;
    await query(conn, sql).then(() => {
      console.log('Routine run successfully');
    })
      .catch(e => {
        console.log(e.message);
      });
    conn.end();
  } catch (error) {
    res.send({ status: 0, message: `system error! ${error.message}` })
  }
}

module.exports.RunBackgroundProcesses = RunBackgroundProcesses;








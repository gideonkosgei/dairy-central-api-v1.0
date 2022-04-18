const moment = require('moment');
const dbConfig = require('../config/dbConfig.js');
const connection = require('./connection');
const query = require('./query1');
const mailer = require('./mailer')


async function sendReport(report_code) {

  try {
    /**
     * REPORT CODE DETAILS
     * 1 - DAILY
     * 2 - WEEKLY
     * 3 - MONTHLY
     */

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';
    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });

    let start = '';
    let end = '';

    let subject = ''
    let title = '';
    let subtitle = '';

    if (report_code === 1) {
      /** daily */

      start = moment().subtract(1, 'days').format('YYYY-MM-DD');
      end = moment().subtract(1, 'days').format('YYYY-MM-DD');

      subject = 'ADGG Daily Data Flow Report';
      title = 'DAILY DATA FLOW REPORT';
      subtitle = `<b>Reporting Date</b> : ${start}`;

    } else if (report_code === 2) {
      /** weekly */

      start = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
      end = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
      subject = 'ADGG Weekly Data Flow Report';
      title = 'WEEKLY DATA FLOW REPORT';
      subtitle = `<b>WEEK ${moment(start).week()}</b>: ${start} to ${end} `;
    } else {
      /** monthly */
      start = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      subject = 'ADGG Monthly Data Flow Report';
      title = 'MONTHLY DATA FLOW REPORT';
      subtitle = `<b>${moment(start).format('MMMM YYYY')}</b> : ${start} to ${end}`;
    }

    let report_0 = `
    <div>
      <h3>${title}</h3>      
      ${subtitle}
      <br/><br/>
      <i>****** This is a system generated report ******</i> 
      <br/>
    </div>
    <br/>
    `;

    let report_99 = "<div> <i>****** End of Report ******</i></div> "

    /** Report codes */
    let code_rpt1 = 1;
    let code_rpt2 = 2;
    let code_rpt3 = 3;
    let code_rpt4 = 4;
    let code_rpt5 = 5;
    let code_rpt6 = 6;
    let code_rpt7 = 7;
    let code_rpt8 = 8;
    let code_rpt9 = 9;
    let code_rpt10 = 10;
    let code_rpt11 = 11;
    let code_rpt12 = 12;
    let code_rpt13 = 13;
    let code_rpt14 = 14;
    let code_rpt15 = 15;
    let code_rpt16 = 16;
    let code_rpt18 = 18;



    /** Report Content */
    let report_1 = '';
    let report_2 = '';
    let report_3 = '';
    let report_4 = '';
    let report_5 = '';
    let report_6 = '';
    let report_7 = '';
    let report_8 = '';
    let report_9 = '';
    let report_10 = '';
    let report_11 = '';
    let report_12 = '';
    let report_13 = '';
    let report_14 = '';
    let report_15 = '';
    let report_16 = '';
    let report_18 = '';


    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */

      /** report 1 > farm and animal registration */

      const sql1 = `CALL sp_rpt_overall_summaries(${code_rpt1},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql1)
        .then(response => {

          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
                <tr>
                  <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
                  <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
                  <td>${!response[0][i].Cow ? 0 : response[0][i].Cow.toLocaleString()}</td>
                  <td>${!response[0][i].Bull ? 0 : response[0][i].Bull.toLocaleString()}</td>
                  <td>${!response[0][i].Female_Calf ? 0 : response[0][i].Female_Calf.toLocaleString()}</td>
                  <td>${!response[0][i].Heifer ? 0 : response[0][i].Heifer.toLocaleString()}</td>
                  <td>${!response[0][i].Male_Calf ? 0 : response[0][i].Male_Calf.toLocaleString()}</td>
                  <td>${!response[0][i].Total_Animals ? 0 : response[0][i].Total_Animals.toLocaleString()}</td>      
                </tr>`;
            }

            report_1 = `     
          <div>
            <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
            <caption>A summary of farmer and animal registration</caption>         
            <thead>
            <tr>
              <th>COUNTRY</th>
              <th>FARMS</th>
              <th>COWS</th>
              <th>BULLS</th>
              <th>FEMALE CALVES</th>
              <th>HEIFERS</th>
              <th>MALE CALVES</th>
              <th>TOTAL ANIMALS</th>
            </tr>
            </thead>
            <tbody>
            ${rpt_rows}
            </tbody>
            </table>  
          </div>  
          <br/>  
          <br/>          
        `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 2 > COW MONITORING - Daily milk yield (Litres)  */
      const sql2 = `CALL sp_rpt_overall_summaries(${code_rpt2},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql2)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
            <tr>
              <td>${!response[0][i].country ? 'N/A' : response[0][i].country}</td>
              <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
              <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
              <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
              <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
              <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
              <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
              <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
            </tr>`;
            }

            report_2 = `     
                <div>
                  <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                  <caption>A summary of cow monitoring - Daily milk yied (Litres)</caption>         
                  <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>FARMS</th>
                    <th>ANIMALS</th>
                    <th>RECORDS</th>
                    <th>MINIMUM</th>
                    <th>MAXIMUM</th>
                    <th>MEAN</th>
                    <th>STD</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${rpt_rows}
                  </tbody>
                  </table>  
                </div> 
                <br/>  
                <br/>           
              `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });



      /** report 3 > COW MONITORING - Milk Quality Parameters - Milk fat  */
      const sql3 = `CALL sp_rpt_overall_summaries(${code_rpt3},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql3)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
              <tr>
                <td>${!response[0][i].country ? 'N/A' : response[0][i].country}</td>
                <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
                <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
                <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
                <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
                <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
                <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
                <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
              </tr>`;
            }

            report_3 = `     
                  <div>
                    <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                    <caption>A summary of cow monitoring - Milk quality parameters(Milk Fat)</caption>         
                    <thead>
                    <tr>
                      <th>COUNTRY</th>
                      <th>FARMS</th>
                      <th>ANIMALS</th>
                      <th>RECORDS</th>
                      <th>MINIMUM</th>
                      <th>MAXIMUM</th>
                      <th>MEAN</th>
                      <th>STD</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${rpt_rows}
                    </tbody>
                    </table>  
                  </div> 
                  <br/>  
                  <br/>           
                `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 4 > COW MONITORING - Milk Quality Parameters - Milk Protein  */
      const sql4 = `CALL sp_rpt_overall_summaries(${code_rpt4},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql4)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
            <tr>
              <td>${!response[0][i].country ? 'N/A' : response[0][i].country}</td>
              <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
              <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
              <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
              <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
              <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
              <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
              <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
            </tr>`;
            }

            report_4 = `     
                <div>
                  <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                  <caption>A summary of cow monitoring - Milk quality parameters(Milk protein)</caption>         
                  <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>FARMS</th>
                    <th>ANIMALS</th>
                    <th>RECORDS</th>
                    <th>MINIMUM</th>
                    <th>MAXIMUM</th>
                    <th>MEAN</th>
                    <th>STD</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${rpt_rows}
                  </tbody>
                  </table>  
                </div> 
                <br/>  
                <br/>           
              `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 5 > COW MONITORING - Milk Quality Parameters - Somatic Cell count  */

      const sql5 = `CALL sp_rpt_overall_summaries(${code_rpt5},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql5)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
            <tr>
              <td>${!response[0][i].country ? 'N/A' : response[0][i].country}</td>
              <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
              <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
              <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
              <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
              <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
              <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
              <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
            </tr>`;
            }

            report_5 = `     
                <div>
                  <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                  <caption>A summary of cow monitoring - Milk quality parameters(Somatic Cell count)</caption>         
                  <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>FARMS</th>
                    <th>ANIMALS</th>
                    <th>RECORDS</th>
                    <th>MINIMUM</th>
                    <th>MAXIMUM</th>
                    <th>MEAN</th>
                    <th>STD</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${rpt_rows}
                  </tbody>
                  </table>  
                </div> 
                <br/>  
                <br/>           
              `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });



      /** report 6 > COW MONITORING - Milk Quality Parameters - Urea  */
      const sql6 = `CALL sp_rpt_overall_summaries(${code_rpt6},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql6)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
            <tr>
              <td>${!response[0][i].country ? "N/A" : response[0][i].country}</td>
              <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
              <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
              <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
              <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
              <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
              <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
              <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
            </tr>`;
            }

            report_6 = `     
                <div>
                  <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                  <caption>A summary of cow monitoring - Milk quality parameters(Urea)</caption>         
                  <thead>
                  <tr>
                    <th>COUNTRY</th>
                    <th>FARMS</th>
                    <th>ANIMALS</th>
                    <th>RECORDS</th>
                    <th>MINIMUM</th>
                    <th>MAXIMUM</th>
                    <th>MEAN</th>
                    <th>STD</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${rpt_rows}
                  </tbody>
                  </table>  
                </div> 
                <br/>  
                <br/>           
              `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });

      /** report 7 > COW MONITORING - Milk Quality Parameters - Lactose  */
      const sql7 = `CALL sp_rpt_overall_summaries(${code_rpt7},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql7)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].country ? 'N/A' : response[0][i].country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
            <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
            <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
            <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
            <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
            <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
          </tr>`;
            }

            report_7 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of cow monitoring - Milk quality parameters(Lactose)</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>ANIMALS</th>
                  <th>RECORDS</th>
                  <th>MINIMUM</th>
                  <th>MAXIMUM</th>
                  <th>MEAN</th>
                  <th>STD</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 8 > COW MONITORING - Weight records (Kgs) */
      const sql8 = `CALL sp_rpt_overall_summaries(${code_rpt8},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql8)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? 'N/A' : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
            <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
            <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
            <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
            <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
            <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>     
          </tr>`;
            }

            report_8 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of cow monitoring - Weight records (Kgs)</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>ANIMALS</th>
                  <th>RECORDS</th>
                  <th>MINIMUM</th>
                  <th>MAXIMUM</th>
                  <th>MEAN</th>
                  <th>STD</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 9 > COW MONITORING - Health records */
      const sql9 = `CALL sp_rpt_overall_summaries(${code_rpt9},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql9)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? 'N/A' : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
            <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Injury.toLocaleString()}</td>
            <td>${!response[0][i].Vaccination ? 0 : response[0][i].Vaccination.toLocaleString()}</td>
            <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>
          </tr>`;
            }

            report_9 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of cow monitoring - Heath records</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>INJURY</th>
                  <th>PARASITE INFECTION</th>
                  <th>VACCINATION</th>
                  <th>TOTAL</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 10 > CALF MONITORING - Weight records (Kgs)*/
      const sql10 = `CALL sp_rpt_overall_summaries(${code_rpt10},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql10)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? 'N/A' : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
            <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
            <td>${!response[0][i].Minimum ? 0 : response[0][i].Minimum.toLocaleString()}</td>
            <td>${!response[0][i].Maximum ? 0 : response[0][i].Maximum.toLocaleString()}</td>
            <td>${!response[0][i].Mean ? 0 : response[0][i].Mean.toLocaleString()}</td>   
            <td>${!response[0][i].Std ? 0 : response[0][i].Std.toLocaleString()}</td>
          </tr>`;
            }

            report_10 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of calf monitoring - Weight records (Kgs)</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>ANIMALS</th>
                  <th>RECORDS</th>
                  <th>MINIMUM</th>
                  <th>MAXIMUM</th>
                  <th>MEAN</th>
                  <th>STD</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 11 > CALF MONITORING - Health records */
      const sql11 = `CALL sp_rpt_overall_summaries(${code_rpt11},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql11)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
              <td>${!response[0][i].Country ? 'N/A' : response[0][i].Country}</td>
              <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
              <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
              <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Injury.toLocaleString()}</td>
              <td>${!response[0][i].Vaccination ? 0 : response[0][i].Vaccination.toLocaleString()}</td>
              <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>
          </tr>`;
            }

            report_11 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of calf monitoring - Heath records</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>INJURY</th>
                  <th>PARASITE INFECTION</th>
                  <th>VACCINATION</th>
                  <th>TOTAL</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      /** report 12 > Exit Records*/

      const sql12 = `CALL sp_rpt_overall_summaries(${code_rpt12},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql12)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';

            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>

          <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
          <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
          <td>${!response[0][i].Bull ? 0 : response[0][i].Bull.toLocaleString()}</td>
          <td>${!response[0][i].Cow ? 0 : response[0][i].Cow.toLocaleString()}</td>
          <td>${!response[0][i].Female_Calf ? 0 : response[0][i].Female_Calf.toLocaleString()}</td>
          <td>${!response[0][i].Heifer ? 0 : response[0][i].Heifer.toLocaleString()}</td>
          <td>${!response[0][i].Male_Calf ? 0 : response[0][i].Male_Calf.toLocaleString()}</td>
          <td>${!response[0][i].Total_Animals ? 0 : response[0][i].Total_Animals.toLocaleString()}</td>  
          </tr>`;
            }

            report_12 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of exit records</caption>         
                <thead>
                <tr>
                    <th>COUNTRY</th>
                    <th>FARMS</th>
                    <th>BULLS</th>
                    <th>COWS</th>
                    <th>FEMALE CALVES</th>
                    <th>HEIFERS</th>
                    <th>MALE CALVES</th>
                    <th>TOTAL ANIMALS</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 13 > Artificial Inseminations*/
      const sql13 = `CALL sp_rpt_overall_summaries(${code_rpt13},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql13)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
                <tr>
                  <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
                  <td>${!response[0][i].Normal_AI ? 0 : response[0][i].Normal_AI.toLocaleString()}</td>
                  <td>${!response[0][i].Synchronized_AI ? 0 : response[0][i].Synchronized_AI.toLocaleString()}</td>
                  <td>${!response[0][i].Total_inseminations ? 0 : response[0][i].Total_inseminations.toLocaleString()}</td>            
                </tr>`;
            }
            report_13 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of artificial insemination</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>NORMAL AI</th>
                  <th>SYNCHRONIZED AI (FTAI)</th>
                  <th>TOTAL</th>                 
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 14 > Pregnancy Diagnosis*/
      const sql14 = `CALL sp_rpt_overall_summaries(${code_rpt14},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql14)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
            <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
          </tr>`;
            }

            report_14 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of pregnancy diagnosis</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>ANIMALS</th>
                  <th>RECORDS</th>                 
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 15 > Synchronization */
      const sql15 = `CALL sp_rpt_overall_summaries(${code_rpt15},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql15)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
            <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
          </tr>`;
            }

            report_15 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of synchronization</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>ANIMALS</th>
                  <th>RECORDS</th>                 
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      /** report 16 > Still Births / Abortions */

      const sql16 = `CALL sp_rpt_overall_summaries(${code_rpt16},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql16)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
            <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
            <td>${!response[0][i].Cow ? 0 : response[0][i].Cow.toLocaleString()}</td>
            <td>${!response[0][i].Total_Animals ? 0 : response[0][i].Total_Animals.toLocaleString()}</td>
          </tr>`;
            }

            report_16 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>A summary of still births/abortions</caption>         
                <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>FARMS</th>
                  <th>COWS</th>
                  <th>RECORDS</th>                 
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }


        })
        .catch(e => { console.log(console.log(e.message)) });



       /** report 18 > Hair Sampling*/
       const sql18 = `CALL sp_rpt_overall_summaries(${code_rpt18},${JSON.stringify(start)},${JSON.stringify(end)})`;
       await query(conn, sql18)
         .then(response => {
           if (response[0].length > 0) {
             let rpt_rows = '';
             for (let i = 0; i < response[0].length; i++) {
               rpt_rows += `
           <tr>
             <td>${!response[0][i].Country ? "N/A" : response[0][i].Country}</td>
             <td>${!response[0][i].Farms ? 0 : response[0][i].Farms.toLocaleString()}</td>
             <td>${!response[0][i].Animals ? 0 : response[0][i].Animals.toLocaleString()}</td>
             <td>${!response[0][i].Records ? 0 : response[0][i].Records.toLocaleString()}</td>
           </tr>`;
             }
 
             report_18 = `     
               <div>
                 <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                 <caption>A summary of Hair Sampling</caption>         
                 <thead>
                 <tr>
                   <th>COUNTRY</th>
                   <th>FARMS</th>
                   <th>ANIMALS</th>
                   <th>RECORDS</th>                 
                 </tr>
                 </thead>
                 <tbody>
                 ${rpt_rows}
                 </tbody>
                 </table>  
               </div> 
               <br/>  
               <br/>           
             `;
           }
         })
         .catch(e => { console.log(console.log(e.message)) });
   

      let reports = report_0 + report_1 + report_2 + report_3 + report_4 + report_5 + report_6 + report_7 + report_8 + report_9 + report_10 + report_11 + report_12 + report_13 + report_14 + report_15 + report_16 + report_18 + report_99;

      if (report_1 === '' && report_2 === '' && report_3 === '' && report_4 === '' && report_5 === '' && report_6 === '' && report_7 === '' && report_8 === '' && report_9 === '' && report_10 === '' && report_11 === '' && report_12 === '' && report_13 === '' && report_14 === '' && report_15 === '' && report_16 === '' && report_18 === '') {
        console.log('Report not sent. No Data');
      } else {
        mailer.sendMail(email_recipients, subject, '', reports);
        console.log('Report Sent');
      }
      conn.end();
    }

  } catch (error) {
    console.log(error.message);
  }
}

async function sendPraPerformanceReport(report_code) {

  try {
    /**
     * REPORT CODE DETAILS
     * 1 - DAILY
     * 2 - WEEKLY
     * 3 - MONTHLY
     */

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';
    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });

    let start = '';
    let end = '';

    let subject = ''
    let title = '';
    let subtitle = '';

    if (report_code === 4) {
      /** daily */

      start = moment().subtract(1, 'days').format('YYYY-MM-DD');
      end = moment().subtract(1, 'days').format('YYYY-MM-DD');

      subject = 'ADGG Daily PRA Performance Report';
      title = 'DAILY PRA PERFORMANCE REPORT';
      subtitle = `<b>Reporting Date</b> : ${start}`;

    } else if (report_code === 5) {
      /** weekly */

      start = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
      end = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
      subject = 'ADGG Weekly PRA Performance Report';
      title = 'WEEKLY PRA PERFORMANCE  REPORT';
      subtitle = `<b>WEEK ${moment(start).week()}</b>: ${start} to ${end} `;
    } else {
      /** monthly */
      start = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      subject = 'ADGG Monthly  PRA Performance Report';
      title = 'MONTHLY PRA PERFORMANCE REPORT';
      subtitle = `<b>${moment(start).format('MMMM YYYY')}</b> : ${start} to ${end}`;
    }

    let report_0 = `
    <div>
      <h3>${title}</h3>      
      ${subtitle}
      <br/><br/>
      <i>****** This is a system generated report ******</i> 
      <br/>
    </div>
    <br/>
    `;

    let report_99 = "<div> <i>****** End of Report ******</i></div> "

    /** Report codes */
    let code_rpt1 = 10; // tanzania
    let code_rpt2 = 11; // kenya
    let code_rpt3 = 12; // Ethiopia

    /** Report Content */
    let report_1 = '';
    let report_2 = '';
    let report_3 = '';


    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */

      /** report 1 > PRA Performance Tanzania */

      const sql1 = `CALL sp_rpt_pra_performance(${code_rpt1},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql1)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `            
              <tr>
                <td>${!response[0][i].PRA ? "N/A" : response[0][i].PRA}</td>
                <td>${!response[0][i].Animal_Registration ? 0 : response[0][i].Animal_Registration.toLocaleString()}</td>
                <td>${!response[0][i].Farmer_Registration ? 0 : response[0][i].Farmer_Registration.toLocaleString()}</td>
                <td>${!response[0][i].Calving ? 0 : response[0][i].Calving.toLocaleString()}</td>
                <td>${!response[0][i].Exits ? 0 : response[0][i].Exits.toLocaleString()}</td>
                <td>${!response[0][i].Feeding ? 0 : response[0][i].Feeding.toLocaleString()}</td>
                <td>${!response[0][i].Hair_Sampling ? 0 : response[0][i].Hair_Sampling.toLocaleString()}</td>
                <td>${!response[0][i].Hoof_Health ? 0 : response[0][i].Hoof_Health.toLocaleString()}</td>
                <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
                <td>${!response[0][i].Insemination ? 0 : response[0][i].Insemination.toLocaleString()}</td>      
                <td>${!response[0][i].Milking ? 0 : response[0][i].Milking.toLocaleString()}</td>      
                <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Parasite_Infection.toLocaleString()}</td>      
                <td>${!response[0][i].Weight ? 0 : response[0][i].Weight.toLocaleString()}</td>   
                <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>          
              </tr>`;
            }

            report_1 = `     
        <div>
          <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
          <caption>Tanzania PRA Performance Report</caption>         
          <thead>
          <tr>
            <th>PRA</th>
            <th>ANIMAL-REGISTRATION</th>
            <th>FARM-REGISTRATION</th>
            <th>CALVING</th>
            <th>EXITS</th>
            <th>FEEDING</th>
            <th>HAIR-SAMPLING</th>
            <th>HOOF-HEALTH</th>
            <th>INJURY</th>
            <th>INSEMINATION</th>
            <th>MILKING</th>
            <th>PARASITE-INFECTION</th>
            <th>WEIGHT</th>
            <th>TOTAL</th>
          </tr>
          </thead>
          <tbody>
          ${rpt_rows}
          </tbody>
          </table>  
        </div>  
        <br/>  
        <br/>          
      `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 2 >  PRA Performance Kenya */
      const sql2 = `CALL sp_rpt_pra_performance(${code_rpt2},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql2)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
          <tr>
            <td>${!response[0][i].PRA ? "N/A" : response[0][i].PRA}</td>
            <td>${!response[0][i].Animal_Registration ? 0 : response[0][i].Animal_Registration.toLocaleString()}</td>
            <td>${!response[0][i].Farmer_Registration ? 0 : response[0][i].Farmer_Registration.toLocaleString()}</td>
            <td>${!response[0][i].Calving ? 0 : response[0][i].Calving.toLocaleString()}</td>
            <td>${!response[0][i].Exits ? 0 : response[0][i].Exits.toLocaleString()}</td>
            <td>${!response[0][i].Feeding ? 0 : response[0][i].Feeding.toLocaleString()}</td>
            <td>${!response[0][i].Hair_Sampling ? 0 : response[0][i].Hair_Sampling.toLocaleString()}</td>
            <td>${!response[0][i].Hoof_Health ? 0 : response[0][i].Hoof_Health.toLocaleString()}</td>
            <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
            <td>${!response[0][i].Insemination ? 0 : response[0][i].Insemination.toLocaleString()}</td>      
            <td>${!response[0][i].Milking ? 0 : response[0][i].Milking.toLocaleString()}</td>      
            <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Parasite_Infection.toLocaleString()}</td>      
            <td>${!response[0][i].Weight ? 0 : response[0][i].Weight.toLocaleString()}</td>   
            <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>  
          </tr>`;
            }
            report_2 = `     
              <div>
                <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                <caption>Kenya PRA Performance Report</caption>         
                <thead>
                <tr>
                  <th>PRA</th>
                  <th>ANIMAL-REGISTRATION</th>
                  <th>FARM-REGISTRATION</th>
                  <th>CALVING</th>
                  <th>EXITS</th>
                  <th>FEEDING</th>
                  <th>HAIR-SAMPLING</th>
                  <th>HOOF-HEALTH</th>
                  <th>INJURY</th>
                  <th>INSEMINATION</th>
                  <th>MILKING</th>
                  <th>PARASITE-INFECTION</th>
                  <th>WEIGHT</th>
                  <th>TOTAL</th>
                </tr>
                </thead>
                <tbody>
                ${rpt_rows}
                </tbody>
                </table>  
              </div> 
              <br/>  
              <br/>           
            `;
          }

        })
        .catch(e => { console.log(console.log(e.message)) });

      /** report 3 > PRA Performance Kenya  */
      const sql3 = `CALL sp_rpt_pra_performance(${code_rpt3},${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql3)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `
            <tr>
              <td>${!response[0][i].PRA ? "N/A" : response[0][i].PRA}</td>
              <td>${!response[0][i].Animal_Registration ? 0 : response[0][i].Animal_Registration.toLocaleString()}</td>
              <td>${!response[0][i].Farmer_Registration ? 0 : response[0][i].Farmer_Registration.toLocaleString()}</td>
              <td>${!response[0][i].Calving ? 0 : response[0][i].Calving.toLocaleString()}</td>
              <td>${!response[0][i].Exits ? 0 : response[0][i].Exits.toLocaleString()}</td>
              <td>${!response[0][i].Feeding ? 0 : response[0][i].Feeding.toLocaleString()}</td>
              <td>${!response[0][i].Hair_Sampling ? 0 : response[0][i].Hair_Sampling.toLocaleString()}</td>
              <td>${!response[0][i].Hoof_Health ? 0 : response[0][i].Hoof_Health.toLocaleString()}</td>
              <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
              <td>${!response[0][i].Insemination ? 0 : response[0][i].Insemination.toLocaleString()}</td>      
              <td>${!response[0][i].Milking ? 0 : response[0][i].Milking.toLocaleString()}</td>      
              <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Parasite_Infection.toLocaleString()}</td>      
              <td>${!response[0][i].Weight ? 0 : response[0][i].Weight.toLocaleString()}</td>   
              <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>   
            </tr>`;
            }

            report_3 = `     
                <div>
                  <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
                  <caption>Ethiopia PRA Performance Report</caption>         
                  <thead>
                  <tr>
                    <th>PRA</th>
                    <th>ANIMAL-REGISTRATION</th>
                    <th>FARM-REGISTRATION</th>
                    <th>CALVING</th>
                    <th>EXITS</th>
                    <th>FEEDING</th>
                    <th>HAIR-SAMPLING</th>
                    <th>HOOF-HEALTH</th>
                    <th>INJURY</th>
                    <th>INSEMINATION</th>
                    <th>MILKING</th>
                    <th>PARASITE-INFECTION</th>
                    <th>WEIGHT</th>
                    <th>TOTAL</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${rpt_rows}
                  </tbody>
                  </table>  
                </div> 
                <br/>  
                <br/>           
              `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });





      let reports = report_0 + report_1 + report_2 + report_3 + report_99;
      mailer.sendMail(email_recipients, subject, '', reports);
      conn.end();
    }
    console.log('success');
  } catch (error) {
    console.log(error.message);
  }
}


async function sendCountyPraPerformanceReport(report_code) {

  try {
    /**
     * REPORT CODE DETAILS     
     * 2 - WEEKLY
     * 3 - MONTHLY
     */

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';
    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });

    let start = '';
    let end = '';

    let subject = ''
    let title = '';
    let subtitle = '';

    if (report_code === 10) {
     /** weekly */

     start = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
     end = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
     subject = 'ADGG Weekly County DFA Performance Report';
     title = 'WEEKLY COUNTY DFA PERFORMANCE  REPORT';
     subtitle = `<b>WEEK ${moment(start).week()}</b>: ${start} to ${end} `;

    } else { // REPORT CODE 11
      /** monthly */
      start = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      subject = 'ADGG Monthly County DFA Performance Report';
      title = 'MONTHLY COUNTY DFA PERFORMANCE REPORT';
      subtitle = `<b>${moment(start).format('MMMM YYYY')}</b> : ${start} to ${end}`;
    }

    let report_0 = `
    <div>
      <h3>${title}</h3>      
      ${subtitle}
      <br/><br/>
      <i>****** This is a system generated report ******</i> 
      <br/>
    </div>
    <br/>
    `;

    let report_99 = "<div> <i>****** End of Report ******</i></div> "    

    /** Report Content */
    let report_1 = '';
   
    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */   

      const sql1 = `CALL sp_rpt_pra_performance_for_county(11,${JSON.stringify(start)},${JSON.stringify(end)})`;
      await query(conn, sql1)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `            
              <tr>
                <td>${!response[0][i].County ? "N/A" : response[0][i].County}</td>
                <td>${!response[0][i].PRA ? "N/A" : response[0][i].PRA}</td>
                <td>${!response[0][i].Animal_Registration ? 0 : response[0][i].Animal_Registration.toLocaleString()}</td>
                <td>${!response[0][i].Farmer_Registration ? 0 : response[0][i].Farmer_Registration.toLocaleString()}</td>
                <td>${!response[0][i].Calving ? 0 : response[0][i].Calving.toLocaleString()}</td>
                <td>${!response[0][i].Exits ? 0 : response[0][i].Exits.toLocaleString()}</td>
                <td>${!response[0][i].Feeding ? 0 : response[0][i].Feeding.toLocaleString()}</td>
                <td>${!response[0][i].Hair_Sampling ? 0 : response[0][i].Hair_Sampling.toLocaleString()}</td>
                <td>${!response[0][i].Hoof_Health ? 0 : response[0][i].Hoof_Health.toLocaleString()}</td>
                <td>${!response[0][i].Injury ? 0 : response[0][i].Injury.toLocaleString()}</td>
                <td>${!response[0][i].Insemination ? 0 : response[0][i].Insemination.toLocaleString()}</td>      
                <td>${!response[0][i].Milking ? 0 : response[0][i].Milking.toLocaleString()}</td>      
                <td>${!response[0][i].Parasite_Infection ? 0 : response[0][i].Parasite_Infection.toLocaleString()}</td>      
                <td>${!response[0][i].Weight ? 0 : response[0][i].Weight.toLocaleString()}</td>   
                <td>${!response[0][i].Total ? 0 : response[0][i].Total.toLocaleString()}</td>          
              </tr>`;
            }

            report_1 = `     
        <div>
          <table  border='1' cellpadding="7" style='border-collapse:collapse;'>
          <caption>Tanzania PRA Performance Report</caption>         
          <thead>
          <tr>
            <th>COUNTY</th>
            <th>PRA</th>
            <th>ANIMAL-REGISTRATION</th>
            <th>FARM-REGISTRATION</th>
            <th>CALVING</th>
            <th>EXITS</th>
            <th>FEEDING</th>
            <th>HAIR-SAMPLING</th>
            <th>HOOF-HEALTH</th>
            <th>INJURY</th>
            <th>INSEMINATION</th>
            <th>MILKING</th>
            <th>PARASITE-INFECTION</th>
            <th>WEIGHT</th>
            <th>TOTAL</th>
          </tr>
          </thead>
          <tbody>
          ${rpt_rows}
          </tbody>
          </table>  
        </div>  
        <br/>  
        <br/>          
      `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      let reports = report_0 + report_1 + report_99;
      mailer.sendMail(email_recipients, subject, '', reports);
      conn.end();
    }
    console.log('success');
  } catch (error) {
    console.log(error.message);
  }
}


async function sendTagIdUnificationReport(report_code) {

  try {

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';
    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });

    let subject = 'Tag ID Unification Report'

    let run_date = moment().subtract(1, 'days').format('YYYY-MM-DD');

    let report_0 = `
    <div>
      Hello,    
      <br/>
    </div>
    <br/>
    `;

    /** Report Content */
    let report_1 = '';

    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */
      const sql1 = `CALL sp_tag_id_unification(${JSON.stringify(run_date)})`;
      await query(conn, sql1)
        .then(response => {
          if (response[0].length > 0) {
            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `            
              <tr>
                <td>${!response[0][i].reg_date ? 0 : moment(response[0][i].reg_date).format('YYYY-MM-DD')}</td>
                <td>${!response[0][i].animal_name ? "" : response[0][i].animal_name.toLocaleString()}</td>
                <td>${!response[0][i].original_tag_id ? 0 : response[0][i].original_tag_id.toLocaleString()}</td>
                <td>${!response[0][i].new_tag_id ? 0 : response[0][i].new_tag_id.toLocaleString()}</td>
              </tr>`;
            }

            report_1 = `     
        <div>
          The table below contains the animals whose Tag IDs were changed
          <br/><br/>
          <table  border='1' cellpadding="7" style='border-collapse:collapse;'>                  
          <thead>
          <tr>
            <th>REG DATE</th>
            <th>ANIMAL NAME</th>
            <th>ORIGINAL TAG ID</th>
            <th>NEW TAG ID</th>            
          </tr>
          </thead>
          <tbody>
          ${rpt_rows}
          </tbody>
          </table>  
        </div>  
        <br/>  
        <br/>          
      `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      if (report_1 === "") {
        report_1 = `
            <div>
             Based on yesteday's data flow, there are no Tag IDs for unification.<br/>
             This might be attributed to:<br/>
              1. No animal registration records were received <br/>
              2. Tag IDs for all animals registered were in conformity <br/>            
            </div>
        `;
      }

      let reports = report_0 + report_1;
      mailer.sendMail(email_recipients, subject, '', reports);
      conn.end();
    }
    console.log('success');
  } catch (error) {
    console.log(error.message);
  }
}



async function sendDataQualityReport(report_code) {

  try {

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';

    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });


    let last_month_start_date = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    let subject = `ADGG Monthly Data Quality Report For ${moment(last_month_start_date).format('MMMM YYYY')}`;

    let title_1 = `
    <div>
      <h3>MONTHLY DATA QUALITY REPORT : ${moment(last_month_start_date).format('MMMM YYYY').toUpperCase()}</h3>   
      <br/><br/>
      <i>****** This is a system generated report ******</i> 
      <br/>
    </div>
    <br/>
    
    `;

    let title_2 = `
    <div>
      <h3>1. Consolidated Data Quality Report: All countries Combined</h3> 
      <br/>
    </div>
    <br/>    
    `;


    let title_3 = `
    <div>
      <h3>2. Data Quality Report: Grouped By Country</h3> 
      <br/>
    </div>
    <br/>
    
    `;

    let title_4 = "<div> <i>****** End of Report ******</i></div> "


    /** Report Content */
    let report_1 = '';
    let report_3 = '';
    let report_3_temp = '';


    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */

      /** report 1 : Global Report */
      const sql1 = `CALL sp_rpt_data_quality(0,0,0)`;
      await query(conn, sql1)
        .then(response => {
          if (response[0].length > 0) {

            let rpt_rows = '';
            for (let i = 0; i < response[0].length; i++) {
              rpt_rows += `            
                <tr>                 
                  <td>${!response[0][i].quality_check ? 0 : response[0][i].quality_check.toLocaleString()}</td>
                  <td>${!response[0][i].total_records ? 0 : response[0][i].total_records.toLocaleString()}</td>
                  <td>${!response[0][i].total_error_records ? 0 : response[0][i].total_error_records.toLocaleString()}</td>
                  <td>${!response[0][i].error_rate ? 0 : response[0][i].error_rate.toLocaleString()}</td>                          
                </tr>`;
            }

            report_1 = `     
                        <div>
                          <table  border='1' cellpadding="7" style='border-collapse:collapse;'>                                
                          <thead>
                          <tr>
                            <th>QUALITY CHECK</th>
                            <th>TOTAL RECORDS</th>
                            <th>RECORDS WITH ERRORS</th>
                            <th>ERROR RATE(%)</th>              
                          </tr>
                          </thead>
                          <tbody>
                          ${rpt_rows}
                          </tbody>
                          </table>  
                        </div>  
                        <br/>  
                        <br/>          
                      `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      /** report 3 : Country Report */
      const sql2 = `CALL sp_rpt_data_quality(0,1,0)`;
      await query(conn, sql2)
        .then(response => {
          if (response[0].length > 0) {
            /** get distinct countries */
            const unique_country_ids = [...new Set(response[0].map(item => item.country_id))];

            let temp_rows = '';

            //unique_country_ids.length
            for (let i = 0; i < unique_country_ids.length; i++) {

              temp_rows = '';
              for (let r = 0; r < response[0].length; r++) {
                if (response[0][r].country_id === unique_country_ids[i]) {
                  temp_rows += `            
                      <tr> 
                        <td>${!response[0][r].country ? 0 : response[0][r].country.toLocaleString()}</td>                
                        <td>${!response[0][r].quality_check ? 0 : response[0][r].quality_check.toLocaleString()}</td>
                        <td>${!response[0][r].total_records ? 0 : response[0][r].total_records.toLocaleString()}</td>
                        <td>${!response[0][r].total_error_records ? 0 : response[0][r].total_error_records.toLocaleString()}</td>
                        <td>${!response[0][r].error_rate ? 0 : response[0][r].error_rate.toLocaleString()}</td>                          
                      </tr>`;

                }

                report_3_temp = `     
                          <div>
                            <table  border='1' cellpadding="7" style='border-collapse:collapse;'>                                   
                            <thead>
                            <tr>
                              <th>COUNTRY</th>
                              <th>QUALITY CHECK</th>
                              <th>TOTAL RECORDS</th>
                              <th>RECORDS WITH ERRORS</th>
                              <th>ERROR RATE(%)</th>              
                            </tr>
                            </thead>
                            <tbody>
                            ${temp_rows}
                            </tbody>
                            </table>  
                          </div>  
                          <br/>  
                          <br/>          
                        `;
              }
              report_3 += report_3_temp;

            }

          }
        })
        .catch(e => { console.log(console.log(e.message)) });

      //console.log(report_3);
      let reports = title_1 + title_2 + report_1 + title_3 + report_3 + title_4;
      mailer.sendMail(email_recipients, subject, '', reports);
      conn.end();
    }
    console.log('success');
  } catch (error) {
    console.log(error.message);

  }
}


async function sendComparativeDataQualityReport(report_code) {

  try {

    const conn = await connection(dbConfig).catch(e => { return e; });

    /** Get recipients */
    let email_recipients = '';

    const sql_0 = `CALL sp_system_reports_recipients(${report_code})`;
    await query(conn, sql_0).then(response => {
      for (let i = 0; i < response[0].length; i++) {
        email_recipients += `${response[0][i].recipient};`
      }
    })
      .catch(e => { console.log(console.log(e.message)) });


    let year = moment().format('YYYY');
    let subject = `ADGG Comparative Data Quality Report For ${year}`;

    let title_1 = `
    <div>
      <h3>COMPARATIVE DATA QUALITY REPORT : ${year}</h3>   
      <br/><br/>
      <i>****** This is a system generated report ******</i> 
      <br/>
    </div>
    <br/>
    
    `;

    let title_2 = `
    <div>
      <h3>1. Consolidated Comparative Data Quality Report: All countries Combined</h3> 
      <br/>
    </div>
    <br/>    
    `;


    let title_3 = `
    <div>
      <h3>2. Comparative Data Quality Report: Grouped By Country</h3> 
      <br/>
    </div>
    <br/>    
    `;

    let title_4 = "<div> <i>****** End of Report ******</i></div> "

    let report_description = `
    <div> 
      The report tracks the monthly progression of data quality error rate  
      <br/><br/>
    </div>
    <br/>
    
    `;


    /** Report Content */
    let report_1 = '';
    let report_2 = '';
    let report_2_temp = '';


    /** check if there are any recipients to the email */
    if (email_recipients.length > 0) {
      /** Report Content */

      /** report 1 : Global Report */

      const sql1 = `CALL sp_rpt_comparative_data_quality(${year},0)`;
      await query(conn, sql1)
        .then(response => {
          if (response[0].length > 0) {
            // extract the object keys. The keys will be the column headers on the report
            let object_keys = Object.keys(response[0][0]);
            let column_headers = '';

            if (object_keys.length > 0) {
              for (let i = 0; i < object_keys.length; i++) {
                // concatenate '(%)' for all column headers except the header at index 0 
                // Get the 1st 3 letters all column headers except the header at index 0  
                if (i === 0) {
                  column_headers += `<th>${object_keys[i].replace("_", " ").toUpperCase()}</th>`;
                } else {
                  column_headers += `<th>${object_keys[i].substring(0, 3)}(%)</th>`;
                }

              }
            }

            let rows = '';

            for (let i = 0; i < response[0].length; i++) {
              // check if object is empty
              if (object_keys.length > 0) {
                let cells = '';
                // iterate through the object assigning values dynamically
                for (let r = 0; r < object_keys.length; r++) {
                  let object_attribute = object_keys[r];  // fetch the object key         
                  cells += `<td>${!response[0][i][object_attribute] ? 0 : response[0][i][object_attribute].toLocaleString()}</td>`;
                }
                rows += `<tr> ${cells}</tr>`;
              }
            }


            report_1 = `     
                        <div>
                          <table  border='1' cellpadding="7" style='border-collapse:collapse;'>                                
                          <thead>
                          <tr>
                            ${column_headers}             
                          </tr>
                          </thead>
                          <tbody>
                            ${rows}
                          </tbody>
                          </table>  
                        </div>  
                        <br/>  
                        <br/>          
                      `;
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      /** report 2 : Country Report */
      const sql2 = `CALL sp_rpt_comparative_data_quality(${year},1)`;
      await query(conn, sql2)
        .then(response => {
          if (response[0].length > 0) {

            // extract the object keys. The keys will be the column headers on the report
            let object_keys = Object.keys(response[0][0]);
            let column_headers = '';

            if (object_keys.length > 0) {
              for (let i = 0; i < object_keys.length; i++) {
                //  skip country_id (should not appear as header) -> located at index 0
                if (i !== 0) {
                  // concatenate '(%)' for all column headers except the header at index 1  
                  // Get the 1st 3 letters all column headers except the header at index 0
                  if (i !== 0 && i === 1 || i === 2) {
                    column_headers += `<th>${object_keys[i].replace("_", " ").toUpperCase()}</th>`;
                  } else {
                    column_headers += `<th>${object_keys[i].substring(0, 3)}(%)</th>`;
                  }
                }
              }
            }

            /** get distinct countries */
            const unique_country_ids = [...new Set(response[0].map(item => item.country_id))];

            //unique_country_ids.length
            for (let x = 0; x < unique_country_ids.length; x++) {
              let rows = '';
              for (let i = 0; i < response[0].length; i++) {
                if (response[0][i].country_id === unique_country_ids[x]) {
                  // check if object is empty
                  if (object_keys.length > 0) {
                    let cells = '';
                    // iterate through the object assigning values dynamically
                    for (let r = 0; r < object_keys.length; r++) {
                      let object_attribute = object_keys[r];  // fetch the object key 
                      //skip cell 0 . It holds the country_id which should not be included        
                      if (r !== 0) {
                        cells += `<td>${!response[0][i][object_attribute] ? 0 : response[0][i][object_attribute].toLocaleString()}</td>`;
                      }
                    }
                    rows += `<tr> ${cells}</tr>`;
                  }
                }
                report_2_temp = `<div> <table  border='1' cellpadding="7" style='border-collapse:collapse;'> <thead><tr>${column_headers}</tr> </thead> <tbody>${rows}</tbody> </table> </div> <br/> <br/> `;
              }
              report_2 += report_2_temp;
            }
          }
        })
        .catch(e => { console.log(console.log(e.message)) });


      let reports = title_1 + title_2 + report_description + report_1 + title_3 + report_2 + title_4;
      mailer.sendMail(email_recipients, subject, '', reports);
      conn.end();
    }
    console.log('success');
  } catch (error) {
    console.log(error.message);

  }
}

module.exports.sendReport = sendReport;
module.exports.sendPraPerformanceReport = sendPraPerformanceReport;
module.exports.sendCountyPraPerformanceReport = sendCountyPraPerformanceReport;
module.exports.sendTagIdUnificationReport = sendTagIdUnificationReport;
module.exports.sendDataQualityReport = sendDataQualityReport;
module.exports.sendComparativeDataQualityReport = sendComparativeDataQualityReport;





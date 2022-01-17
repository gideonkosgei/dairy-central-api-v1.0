// Get the DB Connection Params from Environment Variables 

/*
const host = process.env.DB_HOST_AWS;
const user = process.env.DB_USER_AWS;
const password = process.env.DB_PASS_AWS;
const database = process.env.DB_DATABASE_AWS;
module.exports = {user, password, host, database};*/

//module.exports = {user, password, host, database,port}; // this is for local db connections
//module.exports = {user, password, host, database,port};


const host = 'localhost';
const user = 'root';
const password = 'G1d30nk0sg3189'
const database = "adgg_uat";
const port = '3306';
module.exports = {user, password, host, database, port}; 


/*
const host = "ec2-18-222-108-130.us-east-2.compute.amazonaws.com";
const user = "lsf_system_account"    
const password = "qwertyuiop2020"
const database = "adgg_uat";
module.exports = {user, password, host, database};
*/
 
//

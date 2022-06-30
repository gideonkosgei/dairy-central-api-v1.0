const dotenv = require('dotenv');
dotenv.config();


const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD
const database = process.env.DATABASE_NAME;
const port = process.env.DB_PORT;


if (process.env.NODE_ENV.trim() === 'dev') { 
    module.exports = {user, password, host, database, port}; // development
} else { 
    module.exports = {user, password, host, database};  // production
}


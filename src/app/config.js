const dotenv = require('dotenv');

dotenv.config();

module.exports = { 
    APP_PORT,
    MYSQL_HOST,
    mYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB
} = process.env;

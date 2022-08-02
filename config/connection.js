require('dotenv').config();

const Sequelize = require('sequelize');


//coulnd't figure out for the longest time why I was haven't a root access error. Finally discovered it was the DB_PASSWORD not matching .env file. 
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;

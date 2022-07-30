//TODO: Important requirements, download packages, seed

//Must require dotenv to avoid sensitive login being posted to github in plain sight 
require('dotenv').config;
const express = require('express');
const routes = require('./routes');

//TODO: import the sequelize connection from connection.js. This will be through the config folder 
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);


//Need to alter our listen method to make sure that we connect to our DB BEFORE booting up express server, or else we're going to have query issues
sequelize.sync({force:false}).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

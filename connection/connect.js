const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DEFAULT_DATABASE, process.env.USER, process.env.PASSWORD, {
    dialect: process.env.DIALECT,
    host: 'localhost',
    port: 3306
});

module.exports = sequelize;

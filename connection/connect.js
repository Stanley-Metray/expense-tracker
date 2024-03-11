const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expense_tracker', 'root', 'a9591303870A', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});

module.exports = sequelize;

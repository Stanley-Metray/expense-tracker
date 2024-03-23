const sequelize = require('../connection/connect');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    tokens : {
        type : DataTypes.JSON,
        defaultValue : []
    },
    total_expense : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    total_income : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
});

module.exports = User;
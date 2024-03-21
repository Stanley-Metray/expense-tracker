const sequelize = require('../connection/connect');
const {DataTypes} = require('sequelize');

const Income = sequelize.define('Income', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
    income_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    income_amount : {
        type : DataTypes.DOUBLE,
        allowNull : false
    },
    income_description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    income_category : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = Income;
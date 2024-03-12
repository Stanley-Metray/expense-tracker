const sequelize = require('../connection/connect');
const {DataTypes} = require('sequelize');

const Expense = sequelize.define('Expense', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
    expense_name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    expense_amount : {
        type : DataTypes.DOUBLE,
        allowNull : false
    },
    expense_category : {
        type : DataTypes.STRING,
        allowNull : false
    },
    expense_description : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = Expense;
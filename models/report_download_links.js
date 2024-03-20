const sequelize  = require("../connection/connect");
const {DataTypes} = require('sequelize');

const ReportLinks = sequelize.define('report_link', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    link : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = ReportLinks;
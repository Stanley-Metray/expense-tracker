const sequelize  = require("../connection/connect");
const {DataTypes} = require('sequelize');


const Order = sequelize.define('Order', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    order_id : { 
        type : DataTypes.STRING,
        allowNull : false
    },
    premium : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
});

module.exports = Order;
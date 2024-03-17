const sequelize = require('../connection/connect');
const {DataTypes} = require('sequelize');
const uuid = require('uuid');

const ForgotPasswordRequests = sequelize.define('forgot_password_requests', {
    id : {
        type : DataTypes.STRING,
        defaultValue : () => uuid.v4(),
        primaryKey : true
    },

    UserId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },

    isActive : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
});

module.exports = ForgotPasswordRequests;
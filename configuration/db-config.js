const User = require('../models/user');
const Expense = require('../models/expense');
const Income = require('../models/income');
const Order = require('../models/order');
const ReportLinks = require('../models/report_download_links');
const ForgotPasswordRequests = require('../models/forgot_password_requests');

module.exports.config = () => {
    User.hasMany(Expense, { onDelete: 'CASCADE' });
    Expense.belongsTo(User);

    User.hasMany(Income, { onDelete: 'CASCADE' });
    Income.belongsTo(User);

    User.hasMany(Order, { onDelete: 'CASCADE' });
    Order.belongsTo(User);

    User.hasMany(ForgotPasswordRequests, { onDelete: 'CASCADE' });
    ForgotPasswordRequests.belongsTo(User);

    User.hasMany(ReportLinks, { onDelete: 'CASCADE' });
    ReportLinks.belongsTo(User);
}
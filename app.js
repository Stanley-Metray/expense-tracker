require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const sequelize = require('./connection/connect');
const appRouter = require('./routes/appRouter');
const expenseRouter = require('./routes/expenseRouter');
const userRouter = require('./routes/userRouter');
const incomeRouter = require('./routes/incomeRouter');
const paymentRouter = require('./routes/paymentRouter');
const User = require('./models/user');
const Expense = require('./models/expense');
const Income = require('./models/income');
const Order = require('./models/order');
const ReportLinks = require('./models/report_download_links');
const ForgotPasswordRequests = require('./models/forgot_password_requests')
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/css', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));


app.use('/js', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
app.use('/fonts', express.static(path.join(__dirname, "/node_modules/bootstrap-icons/font")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(upload.none());
app.use(appRouter);
app.use(userRouter);
app.use(expenseRouter);
app.use(incomeRouter);
app.use(paymentRouter);

User.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(User);

User.hasMany(Income, { onDelete: 'CASCADE' });
Income.belongsTo(User);

User.hasMany(Order, {onDelete : 'CASCADE'});
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests, {onDelete : 'CASCADE'});
ForgotPasswordRequests.belongsTo(User);

User.hasMany(ReportLinks, {onDelete : 'CASCADE'});
ReportLinks.belongsTo(User);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    } catch (error) {
        console.log(error);
    }
})();

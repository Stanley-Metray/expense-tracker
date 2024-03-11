const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./connection/connect');
const appRouter = require('./routes/appRouter');
const expenseRouter = require('./routes/expenseRouter');
const userRouter = require('./routes/userRouter');
const incomeRouter = require('./routes/incomeRouter');
const User = require('./models/user');
const Expense = require('./models/expense');
const Income = require('./models/income');
const favicon = require('serve-favicon');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
app.use('/fonts', express.static(path.join(__dirname, "/node_modules/bootstrap-icons/font")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(appRouter);
app.use(userRouter);
app.use(expenseRouter);
app.use(incomeRouter);
User.hasMany(Expense, {onDelete : 'CASCADE'});
Expense.belongsTo(User);
User.hasMany(Income, {onDelete : 'CASCADE'});
Income.belongsTo(User);



(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    } catch (error) {
        console.log(error);
    }
})();


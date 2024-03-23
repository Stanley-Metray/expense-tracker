const appRouter = require('../routes/appRouter');
const expenseRouter = require('../routes/expenseRouter');
const userRouter = require('../routes/userRouter');
const incomeRouter = require('../routes/incomeRouter');
const paymentRouter = require('../routes/paymentRouter');

module.exports.config = (app) => {
    app.use(appRouter);
    app.use(userRouter);
    app.use(expenseRouter);
    app.use(incomeRouter);
    app.use(paymentRouter);
}
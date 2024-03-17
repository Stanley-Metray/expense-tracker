const path = require('path');
const Expense = require('../models/expense');
const sequelize = require('../connection/connect');
const User = require('../models/user');

module.exports.getExpensePage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "expense.html"));
}

module.exports.postAddExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const createdExpense = await Expense.create(req.body, { transaction });

        if (createdExpense) {
            const user = await User.findOne({
                where: { id: req.body.UserId },
                transaction,
                attributes: ['id', 'total_expense']
            });

            user.total_expense = Number(user.total_expense) + Number(createdExpense.expense_amount);
            user.save();
            await transaction.commit();
            res.status(200).send(true);
        }
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.getAllExpenses = async (req, res) => {
    try {

        const expenses = await Expense.findAll({
            where: { UserId: req.body.UserId },
            attributes: ['id', 'expense_name', 'expense_category', 'expense_description', 'expense_amount', 'updatedAt']
        });

        if (expenses.length === 0)
            res.status(404).send("No Expenses Found");
        else
            res.status(200).send(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.updateExpense = async (req, res) => {
    try {
        let id = req.body.id;
        let UserId = req.body.UserId;

        delete req.body.id;
        delete req.body.UserId;
        const result = await Expense.update(req.body, {
            where: {
                id: id,
                UserId: UserId
            },
            returning: true
        });

        if (result[1] === 0)
            res.status(404).send('Missing Expense, Something Went Wrong');
        else
            res.status(200).send(await Expense.findOne({ where: { id: id, UserId: UserId } }));
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteExpense = async (req, res) => {
    try {
        const id = req.query.id;

        const expense = await Expense.findOne({ where: { id } });
        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        const destroyed = await Expense.destroy({ where: { id } });
        
        if(destroyed)
        {
            const user = await User.findOne({
                where: { id: expense.UserId },
                attributes: ['id','total_expense']
            });
    
            user.total_expense = Number(user.total_expense) - Number(expense.expense_amount);
            user.save();
            
            res.status(200).send(true);
        }

    } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
    }
};
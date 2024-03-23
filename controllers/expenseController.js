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

        const { id, UserId, dif, increase, ...updateData } = req.body;

        const updateResult = await Expense.update(updateData, {
            where: { id: id },
            returning: true
        });

        if (updateResult === 0) {
            return res.status(404).send('Missing Expense, Something Went Wrong');
        }

        const user = await User.findOne({
            where: { id: UserId },
            attributes: ['id', 'total_expense']
        });

        if (increase === 'true')
            user.total_expense = Number(user.total_expense) + Number(dif);
        else
            user.total_expense = Number(user.total_expense) - Number(dif);

        await user.save();
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


module.exports.deleteExpense = async (req, res) => {
    try {
        const id = req.query.id;

        const expense = await Expense.findOne({ where: { id } });
        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        const destroyed = await Expense.destroy({ where: { id } });

        if (destroyed) {
            const user = await User.findOne({
                where: { id: expense.UserId },
                attributes: ['id', 'total_expense']
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


module.exports.getExpensesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const UserId = req.body.UserId;
        const offset = (page - 1) * limit;
        const expenses = await Expense.findAll({
            where: {
                UserId: UserId
            },
            offset: offset,
            limit: limit
        });

        const count = await Expense.count({
            where: {
                UserId: UserId
            }
        });
        
        let pagination;

        if (expenses.length === 0) {
            pagination = {isPagination : false}
        }
        else {
            if (count < 10) {
                pagination = {
                    isPagination: false,
                    currentPage: 1,
                    next: 1,
                    prev: 1
                }
            }
            else {
                pagination = {
                    isPagination: true,
                    currentPage: page,
                    next: page + 1,
                    prev: page > 1 ? page - 1 : 1
                };
            }
        }

        res.status(200).json({ expenses, pagination });
    } catch (error) {
        console.log(error);
    }
}


module.exports.getNetExpense = async (req, res)=>{
    try {
        const total_expense = await User.findOne({
            where : {
                id : req.body.UserId
            },
            attributes : ['total_expense']
        });

        if(total_expense)
            res.status(200).send(total_expense);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
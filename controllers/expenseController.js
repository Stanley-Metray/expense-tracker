const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/user');

module.exports.getExpensePage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "expense.html"));
}

module.exports.postAddExpense = async (req, res) => {
    try {
        const createdExpense = await Expense.create(req.body);

        if (createdExpense) {

            const user = await User.findById(req.body.userId)
                .select('id totalExpense');

            user.totalExpense = user.totalExpense + createdExpense.expenseAmount;
            await user.save();
            res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.body.userId })
            .select('expenseName expenseCategory expenseDescription expenseAmount createdAt updatedAt _id');
        if (expenses.length === 0)
            res.status(404).send("No Expenses Found");
        else
            res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.updateExpense = async (req, res) => {
    try {

        const { id, userId, dif, increase, ...updateData } = req.body;

        const updateResult = await Expense.findByIdAndUpdate({ _id: id }, updateData, { new: true });

        if (!updateResult) {
            return res.status(404).send('Missing Expense, Something Went Wrong');
        }


        const user = await User.findById({ _id: userId }).select('_id totalExpense');

        if (increase === true)
            user.totalExpense = user.totalExpense + parseInt(dif);
        else
            user.totalExpense = user.totalExpense - parseInt(dif);

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

        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).send('Expense not found');
        }
        else {
            const user = await User.findById(req.body.userId).select('_id totalExpense');
            user.totalExpense = user.totalExpense - expense.expenseAmount;
            await user.save();

            res.status(200).send(true);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.getExpensesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const userId = req.body.userId;
        const offset = (page - 1) * limit;
        const expenses = await Expense.find({ userId: userId })
            .skip(offset)
            .limit(limit);

        const count = await Expense.countDocuments({ userId: userId });

        let pagination;

        if (expenses.length === 0) {
            pagination = { isPagination: false };
        } else {
            if (count <= limit) {
                pagination = {
                    isPagination: false,
                    currentPage: 1,
                    next: 1,
                    prev: 1
                };
            } else {
                pagination = {
                    isPagination: true,
                    currentPage: page,
                    next: page * limit < count ? page + 1 : page,
                    prev: page > 1 ? page - 1 : 1
                };
            }
        }

        res.status(200).json({ expenses, pagination });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



module.exports.getNetExpense = async (req, res) => {
    try {
        const totalExpense = await User.findById(req.body.userId).select('totalExpense');

        if (totalExpense)
            res.status(200).send(totalExpense);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
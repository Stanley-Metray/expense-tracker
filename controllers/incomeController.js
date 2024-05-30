const path = require('path');
const User = require('../models/user');
const Income = require('../models/income');

module.exports.getIncomePage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "income.html"));
}

module.exports.postAddIncome = async (req, res) => {
    try {
        const createdIncome = await Income.create(req.body);

        if (createdIncome) {
            const user = await User.findById(req.body.userId)
                .select('id totalIncome');

            user.totalIncome = user.totalIncome + createdIncome.incomeAmount;
            await user.save();
            res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.body.userId })
            .select('incomeName incomeCategory incomeDescription incomeAmount createdAt updatedAt _id');
        if (incomes.length === 0)
            res.status(404).send("No Incomes Found");
        else
            res.status(200).json(incomes);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.updateIncome = async (req, res) => {
    try {
        const { id, userId, dif, increase, ...updateData } = req.body;

        const updateResult = await Income.findByIdAndUpdate({ _id: id }, updateData, { new: true });

        if (!updateResult) {
            return res.status(404).send('Missing Income, Something Went Wrong');
        }

        const user = await User.findById({ _id: userId }).select('_id totalIncome');
        
        if (increase === true)
            user.totalIncome = user.totalIncome + parseInt(dif);
        else
            user.totalIncome = user.totalIncome - parseInt(dif);

        await user.save();
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports.deleteIncome = async (req, res) => {
    try {
        const id = req.query.id;

        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).send('Income not found');
        } else {
            const user = await User.findById(req.body.userId).select('_id totalIncome');
            user.totalIncome = user.totalIncome - income.incomeAmount;
            await user.save();

            res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.getIncomesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const userId = req.body.userId;
        const offset = (page - 1) * limit;
        const incomes = await Income.find({ userId: userId })
            .skip(offset)
            .limit(limit);

        const count = await Income.countDocuments({ userId: userId });

        let pagination;

        if (incomes.length === 0) {
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

        res.status(200).json({ incomes, pagination });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

module.exports.getNetIncome = async (req, res) => {
    try {
        const totalIncome = await User.findById(req.body.userId).select('totalIncome');

        if (totalIncome)
            res.status(200).send(totalIncome);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

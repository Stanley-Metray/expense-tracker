const path = require('path');
const sequelize = require('../connection/connect');
const Income = require('../models/income');
const User = require('../models/user');

module.exports.getIncomePage = async (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "income.html"));
}

module.exports.postAddIncome = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const createdIncome = await Income.create(req.body, { transaction });
        if (createdIncome) {
            const user = await User.findOne({
                where: { id: req.body.UserId },
                transaction,
                attributes: ['id', 'total_income']
            });

            user.total_income = Number(user.total_income) + Number(createdIncome.income_amount);
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

module.exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.findAll({
            where: { UserId: req.body.UserId }
        });

        if (incomes.length === 0)
            res.status(404).send("No incomes Found");
        else
            res.status(200).send(incomes);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.updateIncome = async (req, res) => {
    try {

        const { id, UserId, dif, increase, ...updateData } = req.body;

        const updateResult = await Income.update(updateData, {
            where: { id: id },
            returning: true
        });

        if (updateResult === 0) {
            return res.status(404).send('Missing Income, Something Went Wrong');
        }

        const user = await User.findOne({
            where: { id: UserId },
            attributes: ['id', 'total_income']
        });

        if (increase === 'true')
            user.total_income = Number(user.total_income) + Number(dif);
        else
            user.total_income = Number(user.total_income) - Number(dif);

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
        
        const income = await Income.findOne({ where: { id } });
        if (!income) {
            return res.status(404).send('Income not found');
        }

        const destroyed = await Income.destroy({ where: { id } });

        if (destroyed) {
            const user = await User.findOne({
                where: { id: income.UserId },
                attributes: ['id', 'total_income']
            });

            user.total_income = Number(user.total_income) - Number(income.income_amount);
            user.save();

            res.status(200).send(true);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.getIncomesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const UserId = req.body.UserId;
        const offset = (page - 1) * limit;
        const incomes = await Income.findAll({
            where: {
                UserId: UserId
            },
            offset: offset,
            limit: limit
        });

        const count = await Income.count({
            where: {
                UserId: UserId
            }
        });
        
        let pagination;

        if (incomes.length === 0) {
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

        res.status(200).json({ incomes, pagination });
    } catch (error) {
        console.log(error);
    }
}


module.exports.getNetIncome = async (req, res)=>{
    try {
        const total_income = await User.findOne({
            where : {
                id : req.body.UserId
            },
            attributes : ['total_income']
        });

        if(total_income)
            res.status(200).send(total_income);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
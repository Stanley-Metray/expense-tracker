const path = require('path');
const Income = require('../models/income');


module.exports.postAddIncome = async (req, res) => {
    try {
        const createdIncome = await Income.create(req.body);
        if (createdIncome)
            res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error.errors[0].message);
    }
}

module.exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.findAll({
            where: { UserId: req.query.UserId }
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
        const result = await Income.update(req.body, {
            where: {
                id: req.body.id,
                UserId: req.body.UserId
            },
            returning: true
        });

        if (result[1] === 0)
            res.status(404).send('Missing Income, Something Went Wrong');
        else
            res.status(200).send(await Income.findOne({ where: { id: req.body.id, UserId: req.body.UserId } }));
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteIncome = async (req, res) => {
    try {
        const id = req.query.id;

        const income = await Income.findOne({ where: { id } });
        if (!income) {
            return res.status(404).send('Income not found');
        }

        await Income.destroy({ where: { id } });

        res.status(200).send("Income Deleted");

    } catch (error) {
        const income = await Income.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send('Income Deleted');
        }
        else
            res.status(500).send('Internal Server Error');
    }
};
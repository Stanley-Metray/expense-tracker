const path = require('path');
const User = require('../models/user');
const Expense = require('../models/expense');
const Income = require('../models/income');
const { Sequelize, Op } = require('sequelize');

module.exports.getHome = (req,res)=>{
    res.sendFile(path.join(__dirname, "../views", "index.html"));
}


module.exports.getDailyReport = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.UserId);
    const expenses = await Expense.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lt]: new Date().setHours(24, 0, 0, 0),
        },
      },
    });
    const incomes = await Income.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lt]: new Date().setHours(24, 0, 0, 0),
        },
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expense_amount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.income_amount, 0);

    const dailyReport = {
      total_expense: user.total_expense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      total_expenses: totalExpenses,
      total_income: totalIncome,
      expenses: expenses,
      incomes: incomes,
    };

    res.status(200).send(dailyReport);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getWeeklyReport = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.UserId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of current week
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // End of current week

    const expenses = await Expense.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });
    const incomes = await Income.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expense_amount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.income_amount, 0);

    const weeklyReport = {
      total_expense: user.total_expense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      total_expenses: totalExpenses,
      total_income: totalIncome,
      expenses: expenses,
      incomes: incomes,
    };

    res.status(200).send(weeklyReport);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getMonthlyReport = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.UserId);
    const startDate = new Date();
    startDate.setDate(1); // Start of current month
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // End of current month

    const expenses = await Expense.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });
    const incomes = await Income.findAll({
      where: {
        UserId: req.body.UserId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expense_amount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.income_amount, 0);

    const monthlyReport = {
      total_expense: user.total_expense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      total_expenses: totalExpenses,
      total_income: totalIncome,
      expenses: expenses,
      incomes: incomes,
    };

    res.status(200).send(monthlyReport);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

  
  
  
  
  
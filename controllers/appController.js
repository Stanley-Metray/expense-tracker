const path = require('path');
const User = require('../models/user');
const Expense = require('../models/expense');
const Income = require('../models/income');
const ReportLinks = require('../models/report_download_links');
const s3CloudService = require('../services/s3CloudService');

module.exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
};

module.exports.getDailyReport = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(24, 0, 0, 0);

    const expenses = await Expense.find({
      userId: userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const incomes = await Income.find({
      userId: userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expenseAmount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.incomeAmount, 0);
    
    const dailyReport = {
      totalExpense: user.totalExpense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalExpenses: totalExpenses,
      totalIncome: totalIncome,
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
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of current week
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // End of current week

    const expenses = await Expense.find({
      userId: userId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const incomes = await Income.find({
      userId: userId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expenseAmount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.incomeAmount, 0);

    const weeklyReport = {
      totalExpense: user.totalExpense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalExpenses: totalExpenses,
      totalIncome: totalIncome,
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
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const startDate = new Date();
    startDate.setDate(1); // Start of current month
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // End of current month

    const expenses = await Expense.find({
      userId: userId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const incomes = await Income.find({
      userId: userId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.expenseAmount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.incomeAmount, 0);

    const monthlyReport = {
      totalExpense: user.totalExpense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalExpenses: totalExpenses,
      totalIncome: totalIncome,
      expenses: expenses,
      incomes: incomes,
    };

    res.status(200).send(monthlyReport);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getDownloadReport = async (req, res) => {
  try {
    const userId = req.body.userId;
    let expenses = await Expense.find({ userId: userId }).lean();
    expenses = JSON.stringify(expenses);

    const fileURL = await s3CloudService.uploadToS3(expenses, `expenses-${userId}-${new Date().toTimeString()}.txt`, res);
    await ReportLinks.create({ link: fileURL, userId: userId });
    res.status(200).json({ fileURL: fileURL, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getDownloadLinks = async (req, res) => {
  try {
    const downloadLinks = await ReportLinks.find({ userId: req.body.userId }).sort({ createdAt: -1 }).limit(10);
    if (downloadLinks) {
      res.status(200).json(downloadLinks.reverse());
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

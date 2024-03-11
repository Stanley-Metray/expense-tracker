const router = require('express').Router();
const ExpenseController = require('../controllers/expenseController');

router.get('/expense', ExpenseController.getExpensePage);

router.post('/add-expense', ExpenseController.postAddExpense);

router.get('/get-all-expenses', ExpenseController.getAllExpenses);

router.put('/update-expense', ExpenseController.updateExpense);

router.delete('/delete-expense', ExpenseController.deleteExpense);

module.exports = router;
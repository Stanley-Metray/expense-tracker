const router = require('express').Router();
const ExpenseController = require('../controllers/expenseController');
const auth = require('../controllers/authorization');

router.get('/expense', auth.getVerifyToken, ExpenseController.getExpensePage);

router.post('/add-expense', auth.postVerifyToken, ExpenseController.postAddExpense);

router.get('/get-all-expenses', auth.getVerifyToken, ExpenseController.getAllExpenses);

router.put('/update-expense', ExpenseController.updateExpense);

router.delete('/delete-expense', ExpenseController.deleteExpense);

module.exports = router;
const router = require('express').Router();
const ExpenseController = require('../controllers/expenseController');
const authController = require('../controllers/authController');

router.get('/expense', authController.verifyToken, ExpenseController.getExpensePage);

router.post('/add-expense', authController.verifyToken, ExpenseController.postAddExpense);

router.get('/get-all-expenses', authController.verifyToken, ExpenseController.getAllExpenses);

router.put('/update-expense',authController.verifyToken, ExpenseController.updateExpense);

router.delete('/delete-expense', ExpenseController.deleteExpense);

router.get('/get-expenses-pagination', authController.verifyToken ,ExpenseController.getExpensesPagination);

router.get('/get-net-expense', authController.verifyToken, ExpenseController.getNetExpense);

module.exports = router;
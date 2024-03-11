const router = require('express').Router();
const IncomeController = require('../controllers/incomeController');

// router.get('/expense', IncomeController.getExpensePage);

router.post('/add-income', IncomeController.postAddIncome);

router.get('/get-all-incomes', IncomeController.getAllIncomes);

router.put('/update-income', IncomeController.updateIncome);

router.delete('/delete-income', IncomeController.deleteIncome);

module.exports = router;
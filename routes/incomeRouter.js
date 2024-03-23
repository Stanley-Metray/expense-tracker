const router = require('express').Router();
const IncomeController = require('../controllers/incomeController');
const authController = require('../controllers/authController');

router.get('/income', authController.verifyToken ,IncomeController.getIncomePage);

router.post('/add-income', authController.verifyToken, IncomeController.postAddIncome);

router.get('/get-all-incomes', authController.verifyToken, IncomeController.getAllIncomes);

router.put('/update-income', authController.verifyToken, IncomeController.updateIncome);

router.delete('/delete-income', authController.verifyToken, IncomeController.deleteIncome);

router.get('/get-incomes-pagination', authController.verifyToken, IncomeController.getIncomesPagination);

router.get('/get-net-income', authController.verifyToken, IncomeController.getNetIncome);

module.exports = router;
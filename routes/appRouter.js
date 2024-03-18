const router = require('express').Router();
const AppController = require('../controllers/appController');
const authController = require('../controllers/authController');

router.get('/', authController.verifyToken ,AppController.getHome);

router.get('/get-daliy-report', authController.verifyToken, AppController.getDailyReport);

router.get('/get-weekly-report', authController.verifyToken, AppController.getWeeklyReport);

router.get('/get-monthly-report', authController.verifyToken, AppController.getMonthlyReport);

module.exports = router;
const router = require('express').Router();
const UserController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/register', UserController.register);

router.post('/register', UserController.postRegisterUser);

router.get('/login', UserController.getLogin);

router.post('/login', UserController.postLogin);

router.get('/password/forgot-password', UserController.getForgotPassword);

router.post('/password/forgot-password', UserController.postForgotPassword);

router.get('/password/reset-password/:id', UserController.getResetPassword);

router.post('/password/reset-password', UserController.postResetPassword);

router.get('/get-balance-sheet', authController.verifyToken, UserController.getBalanceSheet);

module.exports = router;
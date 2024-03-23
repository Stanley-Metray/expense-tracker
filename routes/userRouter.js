const router = require('express').Router();
const UserController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/register', UserController.register);

router.post('/register', UserController.postAddUser);

router.get('/login', UserController.login);

router.post('/login', UserController.postGetUser);

router.post('/get-user', UserController.postGetUser);

router.put('/update-user', UserController.updateUser);

router.delete('/delete-user', UserController.deleteUser);

router.get('/password/forgot-password', UserController.getForgotPassword);

router.post('/password/forgot-password', UserController.postForgotPassword);

router.get('/password/reset-password/:id', UserController.getResetPassword);

router.post('/password/reset-password', UserController.postResetPassword);

router.get('/get-balance-sheet', authController.verifyToken, UserController.getBalanceSheet);

module.exports = router;
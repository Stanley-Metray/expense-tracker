const router = require('express').Router();
const UserController = require('../controllers/userController');

router.get('/register', UserController.register);

router.post('/register', UserController.postAddUser);

router.get('/login', UserController.login);

router.post('/login', UserController.postGetUser);

router.post('/get-user', UserController.postGetUser);

router.put('/update-user', UserController.updateUser);

router.delete('/delete-user', UserController.deleteUser);

router.get('/password/forgotpassword', UserController.getForgotPassword);

module.exports = router;
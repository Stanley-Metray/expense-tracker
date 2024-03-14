const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');


router.post('/create-order', paymentController.makePayment);

router.post('/upgarde-user', authController.verifyToken, paymentController.upgardeUser);

router.get('/premium-status', authController.verifyToken, paymentController.premiumStatus); 

module.exports = router;
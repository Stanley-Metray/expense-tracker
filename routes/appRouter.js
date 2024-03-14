const router = require('express').Router();
const AppController = require('../controllers/appController');
const authController = require('../controllers/authController');

router.get('/', authController.verifyToken ,AppController.getHome);

module.exports = router;
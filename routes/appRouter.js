const router = require('express').Router();
const AppController = require('../controllers/appController');
const auth = require('../controllers/authorization');

router.get('/', auth.getVerifyToken ,AppController.getHome);

module.exports = router;
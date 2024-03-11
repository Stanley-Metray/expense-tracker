const router = require('express').Router();
const AppController = require('../controllers/appController');

router.get('/', AppController.getHome);

module.exports = router;
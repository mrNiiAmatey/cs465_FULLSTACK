var express = require('express');
var router = express.Router();
var controllers = require('../controllers/travel');

/* GET travel page. */
router.get('/', controllers.travel);

module.exports = router;
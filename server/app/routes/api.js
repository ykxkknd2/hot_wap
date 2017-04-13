var express = require('express');
var apis = require('../controllers/api');
var router = express.Router();

/* GET home page. */
router.get('/name', apis.getName);

module.exports = router;

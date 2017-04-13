var express = require('express');
var router = express.Router();
var mergeAssets = require('../public/util').mergeAssets;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',mergeAssets('index'));
});

module.exports = router;

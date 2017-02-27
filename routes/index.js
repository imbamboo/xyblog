var express = require('express');
var router = express.Router();
var globalConfig = require(__dirname+"\\lib\\global_config.js");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
  //  globalConfig,
    title: 'Express',
    data: [
      { name: "tonyday" },
      { name: "awing wen" },
    ]
  }
  );
});

module.exports = router;

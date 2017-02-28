var express = require('express');
var router = express.Router();
var globalConfig = require("../lib/global_config");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    //  globalConfig,
    title: 'Express',
    data: [
      { name: "tonyday" },
      { name: "awing wen" },
    ],
    test: "abc",
    partials: {
      footer: 'footer',
      header: "header",
      blog_summary: "blog_summary"
    },
  }
  );
});

module.exports = router;

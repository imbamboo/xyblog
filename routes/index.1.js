var express = require('express');
var router = express.Router();
var globalConfig = require("../lib/global_config");
const categoryDb = require("../lib/categoryDb");
const flow = require("nimble");

function findCates(callback, fillResult) {
  categoryDb.findAll(function (items) {
    //cates = items;
    console.log(items.length);
    fillResult(items);
    callback();
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let cates;
  let render = function () {
    console.log("index rendering....");

    res.render('index', {
      globalConfig,
      cates,
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
    });
  };

  flow.series([function (callback) {
    findCates(callback, function (items) {
      cates = items;
    });
  }, function (callback) {
    render();
    callback();
  }]);
});

module.exports = router;

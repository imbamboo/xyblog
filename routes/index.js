var express = require('express');
var router = express.Router();
var globalConfig = require("../lib/global_config");
const categoryDb = require("../lib/categoryDb");
const flow = require("nimble");

function findCates() {
  return new Promise(function (resolve, reject) {
    var cateDb = new categoryDb();
    cateDb.findAll(function (items) {
    //categoryDb.findAll(function (items) {
      //cates = items;
      console.log("cate count:" + items.length);
      resolve(items);
    });
  });

}

function createArticle(){
  var model = {
     createdTime: Date,
            title: String,
            cateId: String,
            urlName: String,
            brief: String,
            content: String,
            views: Number, // 点击（查看）次数
            reviews: Number, // 评论数量
            author: String,
            reviewable: Boolean, // 可评论
            list: Boolean, // 是否显示在列表
            orderId: Number, // 排序ID，数字越大越靠前
  };
  
}

/* GET home page. */
router.get('/', function (req, res, next) {



  let p1 = findCates();
  p1.then(function (items) {
    console.log("index rendering...");

    res.render('index', {
      globalConfig,
      cates: items,
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
  }).catch(function (err) {
    throw err;
  });
});

module.exports = router;

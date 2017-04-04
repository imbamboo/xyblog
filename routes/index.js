var _ = require("lodash");
var express = require('express');
var router = express.Router();
const helper = require("../lib/helper");
const Category = require("../models/categories");
const Article = require("../models/articles");
const viewHelper = require("../lib/viewHelper");


var cateDb = new Category();
var articleDb = new Article();
var topArticleCount = 2;



function findCates() {
  return new Promise(function (resolve, reject) {
    cateDb.findAll(function (items) {
      console.log("cate count:" + items.length);
      resolve(items);
    });
  });
}

function findArticles() {
  return new Promise(function (resolve, reject) {
    articleDb.findTop(2, function (results) {
      resolve(results);
    });
  });
}

/**
 * 最近文章
 */
function findNewArticles(excludeIDs) {
  return new Promise(function (resolve, reject) {
    articleDb.find({ size: 3 + topArticleCount, index: 1 }, function (docs) {
      _.remove(docs, item => {
        return excludeIDs.includes(item._id.toString());
      });
      resolve(docs);
    });
  });
}

function getArticleCount() {
  return new Promise(function (resolve, reject) {
    var tmp = articleDb.count(function (count) {
      resolve(count);
    });
  });
}
// function createArticle() {
//   var model = {
//     createdTime: new Date(),
//     title: "程序员小测试：保守派 vs 自由派-5",
//     cateId: "58b67eb202b98105f00dc41a",
//     urlName: "tiny-test-5",
//     brief: "这是一本非常有趣的书，里面甚至包含了一个小测试（原文），区分一个程序员到底是保守派还是自由派。下面一共有十个问题，每个问题都有 A 和 B 两个选项，请选择你的答案。",
//     content: `问题二：容易出错的特性，是否应该用在程序中？
// （A）很多语言的高级特性都是很容易出错和危险的，应该禁止用在代码里。没有这些特性我们一样可以进行开发，代码也会因此变得更安全。
// （B）聪明的程序员有学习动力，知道怎么可以解决问题。为了避免出错，就立下一堆规矩，完全不可取。`,
//     views: 0, // 点击（查看）次数
//     reviews: 0, // 评论数量
//     author: "竹子",
//     reviewable: true, // 可评论
//     list: true, // 是否显示在列表
//     orderId: 50, // 排序ID，数字越大越靠前
//   };

//   article.add(model);
// }

/* GET home page. */
router.get('/', function (req, res, next) {
  let cates, articles; // 目录，首要文章
  let newArticles; // 叫近文章
  let articleCount;
  let p1 = findCates();
  let p2 = findArticles();
  let p3 = getArticleCount();
  let promise = Promise.all([p1, p2, p3]);
  promise.then(function (items) {
    // 以下两行代码其丑无比，不能直观的知道 items[0], items[1]是什么东西
    cates = items[0];
    articles = items[1];
    articleCount = items[2];

    //  获取最近文件列表
    let excludeIDs = articles.map(item => item._id.toString());
    findNewArticles(excludeIDs).then(function (result) {
      newArticles = result;
      render();
    }).catch(function (err) {
      throw err;
    });
  }).catch(function (err) {
    throw err;
  });

  let render = function () {
    console.log("index rendering...");

    helper.formatDateTime(articles, { "createdTime": "YYYY/MM-DD" });
    helper.formatDateTime(newArticles, { "createdTime": "YYYY/MM-DD" });
    viewHelper.registerByName("_blog_summary")
    viewHelper.registerByName("_article_item");
    res.renderX('index', {
      cates,
      articles,
      newArticles,
      articleCount,
      title: 'Express',
    });
  };



});

module.exports = router;

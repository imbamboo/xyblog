var _ = require("lodash");
var express = require('express');
var router = express.Router();
const helper = require("../lib/helper");
const Category = require("../models/categories");
const Article = require("../models/articles");
const viewHelper = require("../lib/viewHelper");

var cateDb = new Category();
var articleDb = new Article();

function queryList(cateId, pageSize, pageIndex) {
    return new Promise(function (resolve, reject) {
        articleDb.findListByCateId(cateId, {
            pageSize,
            pageIndex,
        }, function (docs) {
            resolve(docs);
        });
    });
}

function loadArticleList(req, res, cate) {
    var pms_queryList = queryList(cate._id.toString(), 10, 1);
    pms_queryList.then(function (docs) {
        helper.formatDateTime(docs, { "createdTime": "YYYY/MM-DD" });
        res.renderX("article_list", {
            cate,
            articles: docs
        });
    });
}

function articleDetail(req, res) {
    
}

/**
 * 按文章目录设置访问路由
 */
module.exports = function (app) {
    return new Promise(function (resolve, reject) {
        cateDb.findAll(function (cates) {
            cates.forEach(function (cate) {
                if (!cate.urlName) {
                    return;
                }

                // view article
                app.use("/" + cate.urlName + "/[a-zA-Z0-9-]+", function (req, res, next) {
                    articleDetail(req, res);
                });

                // list article items by category
                app.use("/" + cate.urlName, function (req, res, next) {
                    // loadArticleList(req, res, cate);
                    (function (req, res, cate) {
                        loadArticleList(req, res, cate);
                    })(req, res, cate);
                });


            }); // end foreach

            resolve();
        }); // end findAll
    }); // end promise
};


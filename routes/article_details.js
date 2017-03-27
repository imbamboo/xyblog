var _ = require("lodash");
var express = require('express');
var router = express.Router();
const helper = require("../lib/helper");
const Category = require("../models/categories");
const Article = require("../models/articles");
const viewHelper = require("../lib/viewHelper");

var cateDb = new Category();
var articleDb = new Article();

function pms_getCate(cateId) {
    return new Promise(function (resolve, reject) {
        cateDb.findOneById(cateId, function (doc) {
            resolve(doc);
        });
    });
}


function articleDetail(req, res, next) {
    let articleName = req.params.articleName;
    let promise;

    let pms_findArticle = function (id, urlName) {
        return new Promise(function (resolve, reject) {
            if (id) {
                articleDb.findOne({ _id: id }, function (doc) {
                    resolve(doc);
                });
            } else {
                articleDb.findOne({ urlName }, function (doc) {
                    resolve(doc);
                });
            }
        });
    };

    let fn_render = function (article, cate) {
        console.log(article);

        viewHelper.registerByName("_review_form");
        helper.formatDateTime([article], { "createdTime": "YYYY/MM-DD" });

        res.renderX("article_details", {
            article,
            cate,
        });
    };

    // 如果路径是以下线线开头，则是文章ID，否则就是文章的 urlName
    if (articleName.indexOf("_") === 0) {
        promise = pms_findArticle(articleName);
    } else {
        promise = pms_findArticle(null, articleName);
    }

    promise.then(function (article) {
        pms_getCate(article.cateId).then(cate => {
            fn_render(article, cate);
        });
    });
}

module.exports = articleDetail;
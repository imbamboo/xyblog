var _ = require("lodash");
var express = require('express');
var router = express.Router();
const helper = require("../lib/helper");
const Category = require("../models/categories");
const Article = require("../models/articles");
const viewHelper = require("../lib/viewHelper");

var cateDb = new Category();
var articleDb = new Article();

function queryList (cateId, pageSize, pageIndex){
    return new Promise(function(resolve, reject){

    });
}

function loadArticleList(req, res, cate) {


    res.renderX("article_list", {
        cate,
    });
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


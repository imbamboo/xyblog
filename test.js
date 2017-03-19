const Category = require("./models/categories");
const Article = require("./models/articles");

function createCates() {
    let cates = [
        {
            title: "node.js",
            urlName: "nodejs",
        },
        {
            title: "c#",
            urlName: "csharp",
        },
        {
            title: "javascript",
            urlName: "javascript",
        },
        {
            title: "读书",
            urlName: "books",
        },
    ];

    let index = 0;
    cates.forEach(item => {
        var nowTime = new Date();
        nowTime = nowTime.setDate(nowTime.getDate() - index);
        var cate = new Category({
            title: item.title,
            articleCount: 0,
            createdTime: nowTime,
            urlName: item.urlName,
        });
        cate.save(function (err, doc) {
            if (err) {
                throw err;
            }

            console.log("cate " + item.title + " >>> saved");
        });
    });
}

function createArticles() {
    let pms_queryCates = new Promise(function (resolve, reject) {
        var cateDb = new Category();
        cateDb.findAll(function (docs) {
            resolve(docs);
        });
    });

    let pms_create = function (cates) {
        let count = 100;

        for (let i = 0; i < count; ++i) {

            let nowTime = new Date();
            nowTime = nowTime.setDate(nowTime.getDate() - i);
            let random = Math.floor(Math.random() * cates.length);
            let cate = cates[random];
            let model = new Article({
                createdTime: nowTime,
                title: i + " IntersectionObserver API 使用教程",
                cateId: cate._id.toString(),
                urlName: i + "_article",
                brief: "内容简短描述",
                content: "内容",
                views: 0, // 点击（查看）次数
                reviews: 0, // 评论数量
                author: "bamboo",
                reviewable: true, // 可评论
                list: true, // 是否显示在列表
                orderId: 50, // 排序ID，数字越大越靠前
            });
            model.save();
        }


    };

    pms_queryCates.then(function (docs) {
        pms_create(docs);

    });
}

function updateCategory() {
    console.log("test: updateCategory");

    let cateDb = new Category();
    let articleDb = new Article();

    let pms_queryCates = new Promise(function (resolve, reject) {
        cateDb.rawModel.findAll(function (docs) {
            resolve(docs);
        });
    });

    let pms_getArticleCount = function (cateId) {
        return new Promise(function (resolve, reject) {
            articleDb.getCountBy({ cateId }, function (count) {
                resolve(count);
            });
        });
    };

    pms_queryCates.then(function (cates) {
        cates.forEach(item => {
            pms_getArticleCount(item._id.toString()).then(function (count) {
                item.articleCount = count;
                item.save();

                console.log("cate " + item.title + " saved.");
            });
        }); // end forEach
    });
};

module.exports = function () {
    updateCategory();
}
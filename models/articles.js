const modelName = "Article";
const { mongoose, connection } = require("./db");
const schemaExtends = require("./extends");
const Category = require("./categories");

var schema = new mongoose.Schema({
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
});

schemaExtends(schema, modelName);

function fillCategoryInfo(next, articles) {
    (new Category()).findAll(function (cates) {
        articles.forEach(function (item) {
            item._cate = cates.find(cate => cate._id.toString() === item.cateId);
        });

        next();
    });
}

function fillUrl(articles) {
    articles.forEach(item => {
        if (item.urlName) {
            item._url = `/${item._cate.urlName}/${item.urlName}`;
        } else {
            item._url = `/${item._cate.urlName}/_${item._id.toString()}`;
        }
    });
}

/**
 * 获取最佳展示的N篇文章
 * @param {Number} top 获取文章数量
 * @param {Function} callback 
 */
schema.methods.findTop = function (top, callback) {
    this.model(modelName).find()
        .limit(top)
        .sort({ orderId: -1, createdTime: -1 })
        .exec(function (err, docs) {
            if (err) {
                throw err;
            }

            let items = docs.map(item => item.toObject());
            fillCategoryInfo(function () {
                fillUrl(items);
                callback(items);
            }, items);
        });
};

schema.methods.find = function (options, callback) {
    let start = (options.index - 1) * options.size;

    this.model(modelName)
        .find()
        .sort("-createdTime")
        .skip(start)
        .limit(options.size)
        .exec(function (err, docs) {
            if (err) {
                throw err;
            }

            let items = docs.map(item => item.toObject());
            fillCategoryInfo(function () {
                fillUrl(items);
                callback(items);
            }, items);
        });
};

/**
 * 
 */
schema.methods.findListByCateId = function (cateId, options, callback) {
    let start = (options.index - 1) * options.size;

    this.model(modelName)
        .find({ cateId: cateId })
        .sort("-createdTime")
        .skip(start)
        .limit(options.size)
        .exec(function (err, docs) {
            if (err) {
                throw err;
            }

            let items = docs.map(item => item.toObject());
            fillCategoryInfo(function () {
                fillUrl(items);
                callback(items);
            }, items);
        });
};

schema.methods.getCountBy = function (options, callback) {
    this.model(modelName)
        .count(options, function (err, count) {
            if (err) {
                throw err;
            }

            callback(count);
        });
};

var model = connection.model(modelName, schema);
module.exports = model;

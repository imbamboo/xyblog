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
            if (!item) {
                return;
            }

            item._cate = cates.find(cate => cate._id.toString() === item.cateId);
        });

        next();
    });
}

function fillUrl(articles) {
    articles.forEach(item => {
        if (!item) {
            return;
        }

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

schema.methods.findListByCateIdInRandom = function (excludedId, cateId, top, callback) {
    this.model(modelName).find({ cateId, _id: { "$ne": mongoose.Types.ObjectId(excludedId) } })
        .limit(top)
        .sort("-createdTime")
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
    // new Promise(function (resolve, reject) {
    //     this.count(function (count) {
    //         resolve(count);
    //     });
    // }).then(function (count) {
    //     if (count <= top) {
    //         this.findAll(function (doc) {
    //             callback(doc);
    //         });
    //         return;
    //     }


    // });
};

/**
 * options: {
 *  {Number}pageIndex
 *  {Number}pageSize
 *  {Boolean}random
 * }
 */
schema.methods.findListByCateId = function (cateId, options, callback) {
    if (options.random) {
        this.findListByCateIdInRandom(cateId, callback);
        return;
    }

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

schema.methods.countByCateId = function (cateId, callback) {
    this.countBy({
        cateId
    }, function (count) {
        callback(count);
    });
};

/**
 * 获取相邻的文章
 */
schema.methods.getAdjacent = function (id, createdTime, callback) {
    let adjacent = {};

    let fn_get = function (prev, next) {
        return new Promise((resolve, reject) => {
            let query = this.model(modelName).findOne()
                .where("_id").ne(mongoose.Types.ObjectId(id));

            if (next) {
                query.where("createdTime").gte(createdTime);
            } else {
                query.where("createdTime").lte(createdTime);
            }

            query.exec((err, doc) => {
                resolve(doc);
            });
        }); // end promise
    }.bind(this); // end fn_get

    var pms_all = Promise.all([fn_get(true, false), fn_get(false, true)]);
    pms_all.then(pmsReturns => {

        let items = this.$.getObjects([pmsReturns[0], pmsReturns[1]]);
        fillCategoryInfo(function () {
            fillUrl(items);
            callback(adjacent);
        }, items);

        adjacent.prev = items[0];
        adjacent.next = items[1];
        callback(adjacent)
    });
};

var model = connection.model(modelName, schema);
module.exports = model;

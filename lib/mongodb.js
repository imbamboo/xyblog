const mongoose = require("mongoose");
const mongodb = require("mongodb");
const connectionString = "mongodb://localhost/xyblog";
const db = mongoose.connect(connectionString);
const Schema = mongoose.Schema;

const AllSchemas = [
    {
        Key: "Category",
        Name: "Categories",
        Schema: new Schema({
            title: String,
            articleCount: Number,
            createdTime: Date,
            urlName: String,
        })
    },
    {
        Key: "Article",
        Name: "Articles",
        Schema: new Schema({
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
        })
    },
];

// module.exports.Category = function () {
//     const sc = mongoose.model("Categories");
//     return new sc();
// };



module.exports.init = function () {
    AllSchemas.map(function (item) {
        mongoose.model(item.Name, item.Schema);
        module.exports[item.Key] = mongoose.model(item.Name);
    });

    // module.exports.Category = mongoose.model("Categories");
    // module.exports.Article = mongoose.model("Articles");
};
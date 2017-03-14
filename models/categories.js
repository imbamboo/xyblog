const modelName = "Category";
const { mongoose, connection } = require("./db");
const schemaExtends = require("./extends");

var schema = new mongoose.Schema({
    title: String,
    articleCount: Number,
    createdTime: Date,
    urlName: String,
});

//schema.set("toObject", { getter: true });

// instance methods
// schema.methods.findAll = function (callback) {
//     return this.model("Category").find(callback);
// };

// schema.methods.findById = function (id, callback) {
//     console.log("Category.findById");
//     this.model("Category").findById(id, function (err, doc) {
//         if (err) {
//             console.log(err);
//             return;
//         }

//         callback(doc);
//     });
// };

schemaExtends(schema, modelName);
var model = connection.model(modelName, schema);


// // static methods
// model.findS = function (callback) {

//     console.log("model.findS()--->");
//     model.find(function (err, docs) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         callback(docs);
//     });
//     //return this.model("Category").find(callback);
// };

module.exports = model;

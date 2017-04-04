const modelName = "Review";
const { mongoose, connection } = require("./db");
const schemaExtends = require("./extends");

var schema = new mongoose.Schema({
    masterId:String,
    author: String,
    email: String,
    emailHidden: Boolean,
    replyToEmail: Boolean,
    ip: String,
    createdTime: Date,
    content: String,
});


schemaExtends(schema, modelName);
var model = connection.model(modelName, schema);
module.exports = model;

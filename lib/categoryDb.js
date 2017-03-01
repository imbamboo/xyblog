//const Entity = require("../lib/mongodb").Article;
const baseDb = require("./baseDb");
class db extends baseDb {
    constructor() {
        super("Category");
    }
}

//module.exports = exports = new db();
module.exports = exports = db;
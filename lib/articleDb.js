const baseDb = require("./baseDb");
class db extends baseDb {
    constructor() {
        super("Article");
    }
}

module.exports = exports = db;
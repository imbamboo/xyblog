const mongoose = require("mongoose");
const crential = require("../lib/db_credential");
var connection = mongoose.connect(crential.connection);

module.exports = {
    mongoose, connection,
};
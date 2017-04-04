const moment = require("moment");

Date.prototype.format = function (format) {
    console.log("format");
    return moment(this).format(format);
};


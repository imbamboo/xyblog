const moment = require("moment");

module.exports = exports = {
    getArticleUrl(cate, article) {

    },

    /*
    fields: {key:format}, e.g. {"createdTime": "YYYY-MM-dd"} . {"createdTime/LastUpdated": "YYYY-MM-dd"} 
     */
    formatDateTime(items, fields) {
        items.forEach(item => {
            for (let keys in fields) {
                let arrKey = keys.split("/");
                let format = fields[keys];

                arrKey.forEach(key => {
                    let val = item[key];
                    item[key] = moment(val).format(format);
                });
            }
        });
    },

    pick(mongooseResult) {
        var items = [];
        mongooseResult.forEach(item => {
            items.push(item._doc);
        });

        return items;
    }
};
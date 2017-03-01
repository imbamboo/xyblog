const db = require("../lib/mongodb");

exports.add = function (model, next) {
    let entity = new db.Category();
    Object.assign(entity, model);
    entity.save(function (err) {
        if (err) {
            throw err;
        }

        console.log(entity);
        if (next) {
            next(entity);
        }
    });
};

exports.findAll = function (next) {
    db.Category.find(function (err, items) {
        if (err) {
            throw err;
        }

        if (next) {
            next(items);
        }
    });
};
const mongoose = require("mongoose");
const _ = require("lodash");

module.exports = function (schema, modelName) {
    schema.methods.$ = {
        getObjects(items) {
            let objects = items.map(item => {
                if (item === null) {
                    return null;
                }

                return item.toObject();
            });
            //return _.compact(objects);
            return objects;
        }
    };

    schema.methods.findAll = function (callback) {
        console.log("extends findAll()");

        this.model(modelName).find(function (err, docs) {
            if (err) {
                throw err;
            }

            callback(docs.map(item => item.toObject()));
        });
    };

    schema.methods.findById = function (id, callback) {
        console.log("extends findById()");

        this.model(modelName).findById(id, function (err, doc) {
            if (err) {
                throw err;
            }

            callback(doc.toObject());
        });
    };

    schema.methods.count = function (callback) {
        return this.model(modelName).count(function (err, count) {
            callback(count);
        });
    };

    schema.methods.findOne = function (options, callback) {
        return this.rawModel.findOne(options, function (doc) {
            callback(doc.toObject());
        });
    };

    schema.methods.findOneById = function (id, callback) {
        return this.findOne({ _id: mongoose.Types.ObjectId(id) }, callback);
    };

    schema.methods.countBy = function (options, callback) {
        this.model(modelName)
            .count(options, function (err, count) {
                if (err) {
                    throw err;
                }

                callback(count);
            });
    };

    /**
     * mongoose 原始模型操作
     */
    schema.methods.rawModel = {
        findById(id, callback) {
            this.model(modelName).findById(id, function (err, doc) {
                if (err) {
                    throw err;
                }

                callback(doc);
            });
        }, // end findById()

        findAll(callback) {
            this.model(modelName).find(function (err, docs) {
                if (err) {
                    throw err;
                }

                callback(docs);
            });
        }, // end findAll()

        findOne(options, callback) {
            this.model(modelName).findOne(options, function (err, doc) {
                if (err) {
                    throw err;
                }

                callback(doc);
            });
        }, // end findOne()
    }; // end model
};
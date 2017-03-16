module.exports = function (schema, modelName) {
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
};
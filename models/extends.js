module.exports = function (schema, modelName) {
    schema.methods.findAll = function (callback) {
        console.log("extends findAll()");

        return this.model(modelName).find(function (err, docs) {
            if (err) {
                throw err;
            }

            callback(docs.map(item => item.toObject()));
        });
    };

    schema.methods.findById = function (id, callback) {
        console.log("extends findById()");

        return this.model(modelName).findById(id, function (err, doc) {
            if (err) {
                throw err;
            }

            callback(doc.toObject());
        });
    }
};
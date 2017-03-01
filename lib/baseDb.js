const Entities = require("../lib/mongodb");

class baseDb {
    constructor(entityName) {
        this.Entity = Entities[entityName];
    }

    add(model, next) {
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
    }

    findAll(next) {
        this.Entity.find(function (err, items) {
            if (err) {
                throw err;
            }

            if (next) {
                next(items);
            }
        });
    }
}

module.exports = exports = baseDb;
const Category = require("./models/categories");

module.exports = {
    add() {
        console.log("begin to add a Category.");

        var cate = new Category({
            title: "milk powder",
            articleCount: 10,
            createdTime: new Date(),
            urlName: "milk-powder",
        });

        cate.save(function (err) {
            if (err) {
                console.log(err);
                return;
            }

            console.log("a category has been saved.");
            console.log(cate);
        });
    },
    findAll() {
        var cate = new Category();
        cate.findAll(function (err, docs) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(docs);
        });
    },
    find() {
        Category.findS(function (err, docs) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(docs);
        });
    },
    findById() {
        console.log("test findById()");
        var cate = new Category();
        cate.findById("58b67e92324ae3201c7f24a4", function (doc) {
            console.log(doc);
        });
    }
};
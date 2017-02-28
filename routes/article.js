var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('article', {
        title: 'Express',
        partials: {
            footer: 'footer',
            header: "header",
            blog_summary: "blog_summary",
            review_form: "review_form",
        },
    }

    );
});

module.exports = router;
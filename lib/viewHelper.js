const hbs = require("hbs");
const fs = require("fs");
const path = require("path");


module.exports.registerByName = function (viewName) {
    let fullFilename1 = path.join(process.cwd(), "views", viewName + ".hbs");
    let fullFilename2;

    if (!fs.existsSync(fullFilename1)) {
        fullFilename2 = path.join(process.cwd(), "views", "partials", viewName + ".hbs");

        if (!fs.existsSync(fullFilename2)) {
            throw new Error(
                `cannot find view at ${fullFilename1}
cannot find view at ${fullFilename2}`);
        }
    }

    let viewContents;
    if (fullFilename2) {
        viewContents = fs.readFileSync(fullFilename2, "utf8");
    } else {
        viewContents = fs.readFileSync(fullFilename1, "utf8");
    }

    hbs.registerPartial(viewName, viewContents);
};
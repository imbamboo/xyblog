var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require("hbs");
var viewHelper = require("./lib/viewHelper");
const globalConfig = require("./lib/global_config");


//var test = require ("./test");

var index = require('./routes/index');
var articleList = require('./routes/article_list');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: "layouts/default" });

// register common partial views
viewHelper.registerByName("_header");
viewHelper.registerByName("_footer");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// renderX
app.use(function (req, res, next) {
  res.renderX = function (viewName, data) {
    data.globalConfig = globalConfig;
    res.render(viewName, data);
  }

  next();
});



app.use('/', index);
var promise = articleList(app);
promise.then(function () {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  app.listen(5000);
  console.log("app started at port 5000, press ctrl+c to terminate.");
});


require("./test")();
module.exports = app;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// init
const db = require("./lib/mongodb");
const categoryDb = require("./lib/categoryDb");

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/about');
var article = require('./routes/article');



var app = express();

db.init();

//******************************************* test code:start

// var cate = {
//   title: "javascript",
//   createdTime: new Date(),
//   articleCount: 0,
//   urlName: "javascript",
// };
// categoryDb.add(cate);
// categoryDb.findAll(function (items) {
//   console.log(items);
// });

// var cate = new db.Category();
// cate.title = "node.js";
// cate.createdTime = new Date();
// cate.articleCount = 0;
// cate.save(function (err) {
//   if (err) {
//     throw err;
//   }

//   console.log("cate saved");
// });

//******************************************* test code:end

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
// app.set('partials', {footer: 'footer'});
// app.set('testa', "tttdd");
//app.set("partials", { footer: 'footer' });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use("/about", about);
app.use("/article", article);

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
console.log("app started at port 5000");

module.exports = app;

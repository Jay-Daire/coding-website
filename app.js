var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var flash = require('connect-flash');
var sqlite3 = require('sqlite3').verbose()
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
//
var tasks = require('./routes/tasks');

var app = express();
var router = express.Router();

mongoose.connect(dbConfig.url);

//var db = new sqlite3.Database( ':memory:')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
//New Flash middleware
//app.use(session({ cookie: { maxAge:60000 }}));
app.use(flash());

//Databasing code
//db.serialize(function () {
  //db.run('CREATE TABLE lorem (info TEXT)')
  //var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  //for (var i = 0; i < 10; i++) {
    //stmt.run('Ipsum' + i)
  //}

  //stmt.finalize()

  //db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    //console.log(row.id + ': ' + row.info)
  //})
//})

//db.close()

app.use('/index', index);
app.use('/users', users);
app.use('/tasks', tasks);

app.get('/flash', function(req, res){
  req.flash('info', 'Flash is back!')
  req.redirect('/');
});

app.get('/', function(req, res){
  res.render('index', { messages: req.flash('info') });
});

router.all('/', function (req, res, next) {
  console.log('Someone made a request!');
  next();
});

router.get('/', function (req, res) {
  res.render('index');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler())
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

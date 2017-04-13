var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('express-hbs');
var helper = require('./public/helpers');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.engine('hbs', hbs.express3({
    viewsDir    : path.join(__dirname, 'views'),
    layoutsDir  : path.join(__dirname, 'views/layouts'),
    defaultLayout : path.join(__dirname, 'views/layouts/default.hbs'),
    partialsDir : path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname,'/views'));

app.locals.title = '热门';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

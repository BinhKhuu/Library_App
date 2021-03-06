var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose');
var mongoDB = process.env.MONGOLAB_URI;

//setup DB connection
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'MongoDB connection error:'));

var app = express();


// view engine setup 
// tells the application where to find our views
app.set('views', path.join(__dirname, 'views'));
// tells the application what view extnetion is being used, so that controllers
// and other files that access the views do not need to add the extension .pug
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// indexRouter and userRouter will redirect to catalog, index and users
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog); 
// last middleware 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//gets imported by /bin/www to start application
module.exports = app;

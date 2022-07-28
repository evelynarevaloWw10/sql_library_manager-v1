
const sequelize =require('./models/index.js').sequelize;var createError = require('http-errors');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);


app.use((req,res,next) => {
  console.log('404 error handler called');
  res.status(404).render('page-not-found')
});


//global handler
app.use((err,req,res,next) => {

if(err.status === 404){
  res.status(404).render('page-not-found',{err});
} else {
  err.message = err.message || 'Oops! It looks like something went wrong on the server '
  res.status(err.status || 500).render('error',{err})
}
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();




module.exports = app;
//start server

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var booksRouter = require('./routes/books');
const {sequelize} =require('./models')
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);


app.use('/', booksRouter);
(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
app.use((req, res, next) => {
  next(createError(404, "Sorry, that page was not found. Please check the URL."));
});
// Error handler reference: https://teamtreehouse.com/library/one-solution-28
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status);
  // Render the Page Not Found page
  if (err.status === 404) {
    console.log(`Error Code: ${err.status} ${err.message}`);
    res.render("page-not-found", {
      title: "Page Not Found",
      error: err,
    });
  } 
    // Render the Error page
    else {
    err.message = "Sorry, there was a problem with our server.";
    console.log(`Error Code: ${err.status} ${err.message}`);
    res.render("error", {
      title: "Server Error",
      error: err,
    });
  }
});
module.exports = app;
//start server

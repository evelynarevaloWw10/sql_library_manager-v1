var Book = require("../models").Book;
var express = require('express');
var router = express.Router();

//redirect into books file
router.get('/', (req, res, next) => {
  res.redirect('/books')
 });


module.exports = router;

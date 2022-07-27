var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET home page. */
router.get('/', async(req, res, next) => {
  //res.render('index', { title: 'Express' });
 const books = await Book.findAll();
 res.render( books.map(book => book.toJSON()) );
 
 });

module.exports = router;

var express = require('express');
var router = express.Router();
var createError = require('http-errors');


//imports book Model
const book = require('../models').Book;


// hander function to wrap each function
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
        res.status(500).send(error)
    }
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});


//Get Book listing 

router.get('/', asyncHandler(async(req, res) => {
    const books = await Book.findAll();
    res.render("index", { books });
    console.log( Book.map(Book => Book.toJSON()) );
}));



// gets /books/new-create new book form 
router.get('/books/new', asyncHandler( async(req,res) => {
  res.render("new-book",{book:{}});
}));


//Post Book-post new book to datatbase
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try{
  book = await Book.create(req.body);
  res.redirect("/");
  }catch(error){
    if (error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render("new-book",{book, errors:error.errors})
    }
  }
}));


//show book detail form
router.get("/books/:id", asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
  res.render("update-book", {book});
  }else {
    res.renderStatus(404);
  }
}));


//update a book in database
router.post('/books/:id',asyncHandler(async(req,res)=> {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books/");
    } else {
      res.render("page-not-found");
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("update-book", { book, errors: error.errors });
    } else {
      throw error;
    }
  }
})
);

// //Delete book router
router.post("/books/:id/delete",asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.para.id);
  if(book){
     await book.destroy();
  res.redirect("/books")
  }else{
    res.sendStatus(404);
  }
 
}));



module.exports = router;

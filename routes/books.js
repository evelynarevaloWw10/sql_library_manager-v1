//combined index and book routes 

var express = require('express');
var router = express.Router();
var createError = require('http-errors');

//imports book Model
const Book = require('../models').Book;

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
 router.get('/', async function(req, res, next){
   res.redirect("/books")
 });


//Shows the full list of books and renders to index page
router.get('/books', asyncHandler(async(req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "Books" });
}));



// Shows the create new book form and renders new-book pug
router.get('/books/new', asyncHandler( async(req,res) => {
  res.render("new-book",{ books:{}, title: "New Book"});
}));


//Posts a new book to the database
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try{
  book = await Book.create(req.body);
  res.redirect("/");
  }catch(error){
    if (error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render("new-book",{book, errors:error.errors, title: "New Book"})
    }else{
      throw error;
    }
  }
}));


//show book detail form
router.get("/books/:id", asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
  res.render("update-book", {book});
  }else {
    res.render("page-not-found");
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
  const book = await Book.findByPk(req.params.id);
  if(book){
     await book.destroy();
  res.redirect("/books/")
  }else{
    res.render("page-not-found");
  }
 
}));



module.exports = router;

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

 // Get book listing
 router.get('/books', asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  res.render("index", {books, title: "Sequelize-It!"});
   }));
 

// gets books 
router.get('/books/new', asyncHandler( async(req,res) => {
  res.render("new-book",{book:{}, title:"New Book"});
}));


//Post Book
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try{
  book = await Book.create(req.body);
  res.redirect("new-book" + book.id);
  }catch(error){
    if (error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      res.render("/new",{book, errors:error.errors, title: "New Book"})
    }
  }
}));


//Get individual book
router.get("/:id/books", asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
  res.render("show-book", {book:{}, title: book}.title)
  }else {
    res.renderStatus(404);
  }
}));


//update a book
router.post('/:id/books',asyncHandler(async(req,res)=> {
  const book = await Book.findByPk(req.params.id);
    if(book){ 
     await book.update(req.body);
  res.redirect("edit",{book, title: "Edit Book"});
  //res.redirect("/books" + book.id)
  }else{
    res.sendStatus(404);
  }
}));


// //Delete book router
router.get("/books/:id/delete",asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.para.id);
  if(book){
     await article.destroy();
  res.render("delete", {book: {}, title:"Delete Book"});
  //res.redirect("/books")
  }else{
    res.sendStatus(404);
  }
 
}));



module.exports = router;

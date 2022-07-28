var express = require('express');
const book = require('../models/book');
var router = express.Router();

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
router.get('/', asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  res.render( "books/index", {books, title: "Sequelize-It!"});
   }));
 

// creates new book form 
router.get('/new',(req,res) => {
  res.render("books/new",{book:{}, title:"New Book"});
});


//Post create book
router.post('/', asyncHandler(async(req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/new" + book.id);
  }));


//Get individual book
router.get("/:id/books", asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("book/show", {book:{}, title: book}.title)
}))




//update a book
router.post('/:id/edit',asyncHandler(async(req,res)=> {
  const article = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect("books/edit",{book, title: "Edit Book"});
}));

// //Delete book router
router.get("/:id/delete",asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.para.id);
  await article.destroy();
  res.render("book/delete", {book: {}, title:"Delete Book"});
}));



module.exports = router;

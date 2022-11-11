const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const mongoose = require("mongoose");

const async = require('async');
const { body, validationResult } = require("express-validator");
const book = require("../models/book");



//Display the home page of the site
exports.index = (req, res) => {
    async.parallel(
      {
        book_count(callback) {
          Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count(callback) {
          BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count(callback) {
          BookInstance.countDocuments({ status: "Available" }, callback);
        },
        author_count(callback) {
          Author.countDocuments({}, callback);
        },
        genre_count(callback) {
          Genre.countDocuments({}, callback);
        },
      },
      (err, results) => {
        res.render("index", {
          title: "Local Library Home",
          error: err,
          data: results,
        });
      }
    );
  };


// Display the list of all the book
exports.BookList = (req,res)=>{
 Book.find({},"author title")  //selecting author and title field
     .sort({title:1})
     .populate("author")
     .exec(function(err,data){
          if(err){
            console.log(err);
          }
          //Successful , render
          res.render("book_list",{title:"BOOK LIST",book_list:data});

     })
}



//Display the information(details) of a specific book
exports.BookDetails = (req,res,next)=>{
  
  const id = mongoose.Types.ObjectId(req.params.id);

      async.parallel(

        {
          book(callback){
            Book.findById(id)
              .populate("author")
              .populate("genre")
              .exec(callback);
          },
          book_instance(callback){
            BookInstance.find({book:id}).exec(callback);
          },

        },
        (err,results)=>{
              if(err){
                return next(err);
              }

              if(results.book==null){
                const err = new Error("Book not found");
                err.status = 400;
                return next(err);
              }
              // success
              res.render("book_detail",{
                title :results.book.title,
                book:results.book,
                book_instances:results.book_instance
              });
        }

      )
  
}



//Display book create form
exports.BookCreateGet = (req,res,next)=>{
  
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
  
}



//Handle book create form
exports.BookCreatePost = [
 

// Convert the genre to an array.
 (req,res,next)=>{

  console.log(req.body.genre)

  if(!Array.isArray(req.body.genre)){
    req.body.genre = typeof req.body.genre ==="undefined" ? [] : [req.body.genre]
  }
  next();
 },

 // validate and santize the fields
 body("title" , "title must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),
 body("author" , "author must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),
 body("summary" , "summary must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),
 body("isbn" , "ISBN must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),
 body("genre.*").escape(),
 
 (req,res,next)=>{

  const errors = validationResult(req);

  const {title , author , summary ,isbn , genre} = req.body ;
  // creating new book
  const book = new Book({
    title:title,
    author:author,
    summary:summary,
    isbn:isbn,
    genre:genre,
  })
 

  if(!errors.isEmpty()){

    // there are errors

    async.parallel(
      {
        authors(callback){
          Author.find(callback)
        },
        genres(callback){
          Genre.find(callback)
        }
      },
      (err,results)=>{
        if(err){
          return next(err);
        }

        // while rerendering the form mark our selected genre as checked
        for(const genre of results.genres){
          if(book.genre.includes(genre._id)){
            genre.checked = "true"
          }
        }

        res.render("book_form",{
          title:"Create Book",
          authors:results.authors,
          genres:results.genres,
        });
      }
    )
    return ;
  }
    
  // Data from form is valid --> Save book
  book.save((err)=>{
    if(err){
      return next(err);

    }

    res.redirect(book.url);
  });
 }
]
  



//Display book update form
exports.BookUpdateGet = (req,res)=>{
    res.send("Not Implemented : Book Update form");
};



//Handle book update form
exports.BookUpdatePost = (req,res)=>{
    res.send("Not Implemented : Book upadated!");
};

//Display book delete form
exports.BookDeleteGet = (req,res)=>{
  
  async.parallel(
    {
      book(callback){
        Book.findById(req.params.id).exec(callback);
      },
      book_bookinstance(callback){
        BookInstance.find({book:req.params.id}).exec(callback);
      },
    },
    (err,results)=>{
      if(err){
        return next(err);

      }

      res.render("book_delete",{
        title:"DELETE BOOK",
        book:results.book,
        bookinstances:results.book_bookinstance,
      });

    }
  );
  

}

//Handle book delte form
exports.BookDeletePost = (req , res ,next) =>{
  
  async.parallel(
    {
      book(callback){
        Book.findById(req.body.bookid).exec(callback);
      },
      book_bookinstances(callback){
        BookInstance.find({ book:req.body.bookid}).exec(callback);
      }
    },
    (err,results)=>{
      if(err){
        return next(err);
      }
      // if book has an bookinstance
      if(results.book_bookinstances.length > 0 ){
        res.render("book_delete",{
          title:"DELETE BOOK",
          book:results.book,
          bookinstances:results.book_bookinstances,
        });
      }
      // if book has no bookIntance, delete the book
      Book.findByIdAndDelete(req.body.bookid,(err)=>{
        if(err){
          return next(err);
        }
        res.redirect('/catalog/books');
      })

    }
  )

}
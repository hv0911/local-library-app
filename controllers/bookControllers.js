const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

const async = require('async');


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
exports.BookDetails = (req,res)=>{
    res.send(`Not Implementd: Book Detail:${req.params.id} `);
}

//Display book create form
exports.BookCreateGet = (req,res)=>{
    res.send("Not Implemented: Book Create Form");
}

//Handle book create form
exports.BookCreatePost = (req,res)=>{
    res.send("Not Implementd : Book created! ");
}

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
    res.send("Not Implemented : Book delete Form");
}

//Handle book delte form
exports.BookDeletePost = (req , res) =>{
    res.send("Not Implemented: Book delelted! ");
}

const BookInstance = require("../models/bookInstance");
const mongoose = require('mongoose');
const async = require("async");
const {body , validationResult} = require('express-validator');
const Book = require("../models/book");

//Display list of all BookInstance
exports.BookInstanceList = (req,res)=>{
   BookInstance.find()
     .populate("book")
     .exec((err,data)=>{
        if(err){
          console.log(err);
        }

        //On Success
        res.render('bookInstance_list',{title:"BOOK INSTANCE LIST" ,bookInstance_list:data})
     });
}




//Display the Details of a BookInstance
 exports.BookInstanceDetails = (req, res, next) => {

    const id = mongoose.Types.ObjectId(req.params.id);

    BookInstance.findById(id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_detail", {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance,
      });
    });
      
 };
  


//Display BookInstace Create Form 
exports.BookInstanceCreateGet = (req,res,next)=>{
    Book.find({},"title").exec((err,books)=>{
      if(err){
        return next(err);
      }
      // on success
      res.render("bookInstance_form",{title:"CREATE BOOKINSTANCE",book_list:books});
    })
}

//Handle BookIntance Create Form
exports.BookInstanceCreatePost = [

  //validate and santize fields
  body("book","Book must be specified")
  .trim()
  .isLength({min:1})
  .escape(),
  body("imprint","Imprint must be specified")
  .trim()
  .isLength({min:1})
  .escape(),
  body("status")
   .escape(),
  body("due_book")
   .optional({checkFalsy:true})
   .isISO8601()
   .toDate()
   ,
   //Process the request
   (req ,res,next)=>{
    //Extracting the error from form
     const errors = validationResult(req);

     const {book,imprint,status,due_book} = req.body;
     // Creating a bookInstance
     const bookinstance = new BookInstance({
      book:book,
      imprint:imprint,
      status:status,
      due_book:due_book,
     });

     // checking for validation errors
      if(!errors.isEmpty()){

        Book.find({},"title").exec((err,books)=>{

          if(err){
            return next(err);
          }

          res.render("bookInstance_form",{
            title:"CREATE BOOKINSTANCE",
            book_list:books,
            selected_book:bookinstance.book._id,
            errors:errors.array(),
            bookinstance,
          });

        });
        return ;
        
      }

      //data from the form is valid
      bookinstance.save((err)=>{
        if(err){
          return next(err);
        }

        res.redirect(bookinstance.url);
      })

   } 
 

]

//Display BookInstace Update Form 
exports.BookInstanceUpdateGet = (req,res,next)=>{
  
  async.parallel(
    {
      bookinstance: function (callback) {
        BookInstance.findById(req.params.id).populate("book").exec(callback);
      },
      books: function (callback) {
        Book.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bookinstance == null) {
        // No results.
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("bookinstance_form", {
        title: "Update  BookInstance",
        book_list: results.books,
        selected_book: results.bookinstance.book._id,
        bookinstance: results.bookinstance,
      });
    }
  );
  
}

//Handle BookIntance Update Form
exports.BookInstanceUpdatePost = [

  // Validation 
  body("imprint","Imprint must be specified")
  .trim()
  .isLength({min:1})
  .escape()
  ,
  body("book","Book must be specified")
  .trim()
  .isLength({min:1})
  .escape()
  ,
  body("status").escape()
  ,
  body("due_book","Invalid Date")
  .optional({checkFalsy:true})
  .isISO8601()
  .toDate()

  ,
  //Process request after validation
  (req,res,next)=>{
    
    const errors = validationResult(req);

    const {imprint,book,status,due_book} = req.body

    const bookinstance = new BookInstance({
      book:book,
      imprint:imprint,
      status:status,
      due_book:due_book,
      _id:req.params.id
    });

    if(!errors.isEmpty()){

      Book.find({},"title").exec((err,books)=>{

        if(err){
          return next(err);
        }

        res.render("bookInstance_form",{
          title:"UPDATE BOOK",
          book_list:books,
          selected_book:bookinstance.book._id,
          errors:errors.array(),
          bookinstance:bookinstance,
         
        })
      })

      return ;
    }else{

      BookInstance.findByIdAndUpdate(req.params.id , bookinstance , (err,thebookinstance)=>{
        if(err){
          return next(err);
        }
        //on Success
        res.redirect(thebookinstance.url);
      });

    }

  }

]

//Display BookInstace Delete Form 
exports.BookInstanceDeleteGet = (req,res,next)=>{
  
  BookInstance.findById(req.params.id).exec((err,bookinstance)=>{
    if(err){
      return next(err);
    }
    res.render("bookinstance_delete",{
      title:"DELETE BOOKINTANCE",
      bookinstance:bookinstance
    });
  });
  
}

//Handle BookIntance Delete Form
exports.BookInstanceDeletePost = (req,res,next)=>{
  
  BookInstance.findByIdAndDelete(req.body.bookinstanceid,(err)=>{
    if(err){
      return next(err);
    }
    res.redirect("/catalog/bookinstances");
  });

}



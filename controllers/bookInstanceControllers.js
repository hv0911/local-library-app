
const BookInstance = require("../models/bookInstance");
const mongoose = require('mongoose');


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
exports.BookInstanceCreateGet = (req,res)=>{
    res.send("Not Implemented: BookInstance create Form");
}

//Handle BookIntance Create Form
exports.BookInstanceCreatePost = (req,res)=>{
    res.send("Not Implemented: BookIntace Created!");
}

//Display BookInstace Update Form 
exports.BookInstanceUpdateGet = (req,res)=>{
    res.send("Not Implemented: BookInstance update Form");
}

//Handle BookIntance Update Form
exports.BookInstanceUpdatePost = (req,res)=>{
    res.send("Not Implemented: BookIntace Updated!");
}

//Display BookInstace Delete Form 
exports.BookInstanceDeleteGet = (req,res)=>{
    res.send("Not Implemented: BookInstance delete Form");
}

//Handle BookIntance Delete Form
exports.BookInstanceDeletePost = (req,res)=>{
    res.send("Not Implemented: BookIntace Deleted!");
}



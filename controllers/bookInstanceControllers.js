
const BookInstance = require("../models/bookInstance");

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
exports.BookInstanceDetails = (req,res)=>{
    res.send(`Not Implemented: BookInstance detail: ${req.params.id}`);
}

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



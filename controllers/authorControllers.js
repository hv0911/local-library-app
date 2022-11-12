const Author = require('../models/author');
const Book = require("../models/book");
const mongoose = require("mongoose");
const async = require("async");
const { body ,validationResult } = require("express-validator");
// const author = require('../models/author');


// Display the list of all the author
exports.authorList = (req, res) => {

    Author.find()
        .sort([["familyName", "ascending"]])
        .exec((err, data) => {

            if (err) {
                console.log(err);
            }
            //on sucess
            res.render("author_list", { title: "AUTHOR LIST", author_list: data });

        });

}



//Display the information(details) of a specific author
exports.authorDetails = (req, res, next) => {

    const id = mongoose.Types.ObjectId(req.params.id);

    async.parallel(
        {
            author(callback) {
                Author.findById(id).exec(callback);
            },
            book(callback) {
                Book.find( { author: id } , "title summary").exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.author == null) {
                const err = new Error("author not found");
                err.status = 404;
                return next(err);
            }
            // successfull
            res.render("author_detail", {
                author: results.author,
                author_books: results.book,
            })
        }
    )

}



//Display authors create form
exports.authorCreateGet = (req, res) => {
 
    res.render("author_form",{title:"CREATE GENRE"});

};



//Handle authors create form
exports.authorCreatePost =  [
    //Validatin
    body("firstName")
     .trim()
     .isLength({min:1})
     .escape()
     .withMessage("First Name must be specified")
     .isAlphanumeric()
     .withMessage("firstName must have alphanumeric characters"),
    body("familyName")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Family Name must be specified")
    .isAlphanumeric()
    .withMessage("Family must have alphanumeric characters"),
    body("dateOfBirth")
     .optional({checkFalsy:true})
     .isISO8601()
     .toDate(),
    body("dateOfDeath")
     .optional({checkFalsy:true})
     .isISO8601()
     .toDate(),

     //Process request after validation
     (req,res,next)=>{

        //extract the validation error from request
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render("author_form",{
                title:"CREATE AUTHOR",
                author:req.body,
                errors:errors.array()
            });
        }

        // date from form is valid then

        //creating new Author
        const author = new Author({
            firstName: req.body.firstName,
            familyName:req.body.familyName,
            dateOfBirth:req.body.dateOfBirth,
            dateOfDeath:req.body.dateOfDeath,
        });
        author.save((err)=>{
            if(err){
                return next(err) ;
            }
            res.redirect(author.url);
        });
        

     }

]




//Display authors update form
exports.authorUpdateGet = (req, res ,next) => {
   
    Author.findById(req.params.id,(err,author)=>{
        if(err){
            return next(err);
        }
        if(author===null){
          const err = new Error("Author not found");
          err.status = 404;
          return next(err);
        }

        // On success
        res.render("author_form",{
            title:"UPDATE Author",
            author:author
        });
    });

};

//Handle author update form
exports.authorUpdatePost = [

    body("firstName")
     .trim()
     .isLength({min:1})
     .escape()
     .withMessage("firstName must be specified")
     .isAlphanumeric()
     .withMessage("firstName must be alphanumeric")
    ,
    body("familyName")
     .trim()
     .isLength({min:1})
     .escape()
     .withMessage("familyName must be specified")
     .isAlphanumeric()
     .withMessage("familyName must be alphanumeric")
    ,
    body("dateOfBirth","Invalid date of birth")
     .optional({checkFalsy:true})
     .isISO8601()
     .toDate()
    ,
    body("dateOfDeath","Invalid date of Death")
     .optional({checkFalsy:true})
     .isISO8601()
     .toDate()
    ,

    //Process request after validation and sanatization
    (req,res,next)=>{

        const errors = validationResult(req);

        const {firstName,familyName,dateOfBirth,dateOfDeath} = req.body;

        const author = new Author({
            firstName:firstName,
            familyName:familyName,
            dateOfBirth:dateOfBirth,
            dateOfDeath:dateOfDeath,
            _id:req.params.id  //required so that new id is not created

        })

        if(!errors.isEmpty()){
            // if validation fail 
           res.render("author_form",{
            title:"UPDATE AUTHOR",
            author:author,
            errors:errors.array()
           });
           return ;
        }

        //On Success
        Author.findByIdAndUpdate(req.params.id, author ,(err,theauthor)=>{
            if(err){
                return next(err);
            }
            res.redirect(theauthor.url);
        } )

    }

]



//Display authors delete form
exports.authorDeleteGet = (req, res ,next) => {
   
    async.parallel(
        {
            author(callback){
                Author.findById(req.params.id).exec(callback);
            },
            author_books(callback){
                Book.find({author:req.params.id}).exec(callback);
            }
        },
        (err,results)=>{
            if(err){
                return next(err);
            }

            if(results.author===null){
                res.redirect('/catalog/authors')
            }

            //Author exists
            res.render("author_delete",{
                title:"DELETE AUTHOR",
                author:results.author,
                author_books:results.author_books,
            });
        }
    )
    
}

//Handle auhtors delte form
exports.authorDeletePost = (req, res,next) => {
   
    async.parallel(
        {
            author(callback){
                Author.findById(req.body.authorid).exec(callback);
            },
            author_books(callback){
                Book.find({ author:req.body.authorid }).exec(callback);
            },
        },
        (err,results)=>{
            if(err){
                return next(err);
            }
            // Success if author has books render the same page
            if(results.author_books.length > 0){
                res.render("author_delete",{
                    title:"DELETE AUTHOR",
                    author:results.author,
                    author_books:results.author_books,
                });
            }

            //if author has no books, delete author
            Author.findByIdAndDelete(req.body.authorid,(err)=>{
                if(err){
                    return next(err);
                }
                res.redirect('/catalog/authors');
            });


        }
    )

}
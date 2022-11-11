const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
 const mongoose = require('mongoose');

 //including form validators
 const { body , validationResult } = require('express-validator');
const genre = require("../models/genre");
const author = require("../models/author");



// Display the list of all the Genres
exports.GenreList = (req, res) => {
    Genre.find()
        .sort([["name", "ascending"]])
        .exec((err, data) => {
            if (err) {
                console.log(err);
            }
            //on success
            res.render('genre_list', { title: "GENRE LIST", genre_list: data })
        });
}



//Display the information(details) of a specific Genre
exports.GenreDetails = (req, res, next) => {

     const id = mongoose.Types.ObjectId(req.params.id) ;

    async.parallel(
        {
            genre(callback) {
                Genre.findById(id).exec(callback);
            },
            genre_book(callback) {
                Book.find({ genre: id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.genre == null) {
                //not found
                const err = new Error("Genre not found");
                err.status = 404;
                return next(err);
            }
            //
            res.render("genre_detail",
                {
                    title: "GENRE DETAIL",
                    genre: results.genre,
                    genre_books: results.genre_book
                })
        }
    );
}



//Display Genre create form
exports.GenreCreateGet = (req, res) => {
   
    res.render('genre_form' , { title:"Genre Form" });

}



//Handle Genre create form
exports.GenreCreatePost = [
    body("name", "Genre name required" ).trim().isLength({min:1}).escape(),

    (req,res,next)=>{
    
        const errors = validationResult(req);

        const genre = new Genre({name:req.body.name});

        if(!errors.isEmpty()){
            res.render("genre_form",{
                title:"CREATE GENRE",
                genre,
                errors:errors.array()
            })
        }else{

            Genre.findOne({name:req.body.name}).exec((err,found_genre)=>{
                
                if(err){
                    return next(err);
                }
                
                if(found_genre){
                    //i.e genre already exists
                    res.redirect(found_genre.url);
                }else{
                    genre.save((err)=>{
                        if(err){
                            return next(err)
                        }
                        res.redirect(genre.url);
                    });
                }


            })

        }

    }
]



//Display Genre update form
exports.GenreUpdateGet = (req, res) => {
    res.send("Not Implemented : Genre update form");
};

//Handle Genre update form
exports.GenreUpdatePost = (req, res) => {
    res.send("Not Implemented : Genre upadated!");
};



//Display Genre delete form
exports.GenreDeleteGet = (req, res ,next) => {
   
    async.parallel(
        {
            genre(callback){
                Genre.findById(req.params.id).exec(callback);
            },
            genre_books(callback){
                Book.find({genre:req.params.id}).exec(callback);
            },
        },
        (err,results)=>{
           if(err){
             return next(err);
           }
           if(results.genre===null){
            res.redirect('/catalog/genres');
           }

           //Sucess
           res.render("genre_delete",{
            title:"DELETE GENRE",
            genre:results.genre,
            genre_books:results.genre_books
           });
        }
    )

}

//Handle Genre delete form
exports.GenreDeletePost = (req, res ,next) => {
    
    async.parallel(
        {
            genre(callback){
               Genre.findById(req.body.genreid).exec(callback);
            },
            genre_books(callback){
              Book.find({genre:req.body.genreid}).exec(callback);  
            },
        },
        (err,results)=>{
            
            if(err){
                return next(err);
            }
            // if genre has books renger the same page
            if(results.genre_books.length > 0 ){
                res.render("genre_delete",{
                    title:"DELETE GENRE",
                    genre:results.genre,
                    genre_books:results.genre
                });
            }
            //if genre has no book , delete the genre
            Genre.findByIdAndDelete(req.body.genreid,(err)=>{
                if(err){
                    return next(err);
                }
                res.redirect("/catalog/genres");
            })

        }


    )

}
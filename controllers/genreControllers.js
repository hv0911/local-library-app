const Genre = require("../models/genre");
const Book = require('../models/book');
const async = require('async');
 const mongoose = require('mongoose');



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



//Display the information(details) of a specific author
exports.GenreDetails = (req, res, next) => {

     const id = mongoose.Types.ObjectId(req.params.id)

    async.parallel(
        {
            genre(callback) {
                Genre.findById(id).exec(callback);
            },
            genre_book(callback) {
                Book.find({ genre:id }).exec(callback);
            },
        },
        (err, result) => {
            if (err) {
                return next(err);
            }
            if (result.genre == null) {
                //not found
                const err = new Error("Genre not found");
                err.status = 404;
                return next(err);
            }
            //
            res.render("genre_detail",
                {
                    title: "GENRE DETAIL",
                    genre: result.genre,
                    genre_book: result.genre_book
                })
        }
    );
}



//Display Genre create form
exports.GenreCreateGet = (req, res) => {
    res.send("Not Implemented: Genre Create Form");
}

//Handle Genre create form
exports.GenreCreatePost = (req, res) => {
    res.send("Not Implementd : Genre created! ");
}

//Display Genre update form
exports.GenreUpdateGet = (req, res) => {
    res.send("Not Implemented : Genre update form");
};

//Handle Genre update form
exports.GenreUpdatePost = (req, res) => {
    res.send("Not Implemented : Genre upadated!");
};

//Display Genre delete form
exports.GenreDeleteGet = (req, res) => {
    res.send("Not Implemented : Genre delete Form");
}

//Handle Genre delete form
exports.GenreDeletePost = (req, res) => {
    res.send("Not Implemented: Genre delelted! ");
}
const express = require('express');
const router = express.Router();

//Requiring all the controllers
const authorContollers = require('../controllers/authorControllers');
const bookControllers = require('../controllers/bookControllers');
const bookInstanceControllers = require('../controllers/bookInstanceControllers');
const genreControllers = require('../controllers/genreControllers');


//         <-- Books Routes -->

//Serving the home page for site 
router.get('/',bookControllers.index);

//get request for displaying books
router.get('/books',bookControllers.BookList);

//get request for creating book
router.get('/book/create',bookControllers.BookCreateGet);

//post request for creating book
router.post('/book/create',bookControllers.BookCreatePost);

//get request for updating book
router.get('/book/:id/update',bookControllers.BookUpdateGet);

//post request for updating book
router.post('/book/:id/update',bookControllers.BookUpdatePost);

//get request for deleting book
router.get('/book/:id/delete',bookControllers.BookDeleteGet);

//post request for deleting book
router.post('/book/:id/delete',bookControllers.BookDeletePost);

//get request for deatail of a particular book
router.get('/book/:id',bookControllers.BookDetails);


//         <-- Author Routes -->

//get request for Author List
router.get('/authors',authorContollers.authorList);

//get request for creating author
router.get('/author/create',authorContollers.authorCreateGet);

//post request for creating author
router.post('/author/create',authorContollers.authorCreatePost);

//get request for updating author
router.get('/author/:id/update',authorContollers.authorUpdateGet);

//post request for updating author
router.post('/author/:id/update',authorContollers.authorUpdatePost);

//get request for deleting author
router.get('/author/:id/delete',authorContollers.authorDeleteGet);

//post request for creating author
router.post('/author/:id/delete',authorContollers.authorDeletePost);

//get request for Details of an author
router.get('/author/:id',authorContollers.authorDetails);



//        <-- GENRE ROUTES -->

//get request for list of genres
router.get('/genres',genreControllers.GenreList);

//get request for creating new genre
router.get('/genre/create',genreControllers.GenreCreateGet);

//post request for creating new genre
router.post('/genre/create',genreControllers.GenreCreatePost);

//get request for creating new genre
router.get('/genre/:id/update',genreControllers.GenreUpdateGet);

//post request for creating new genre
router.post('/genre/:id/update',genreControllers.GenreUpdatePost);

//get request for creating new genre
router.get('/genre/:id/delete',genreControllers.GenreDeleteGet);

//post request for creating new genre
router.post('/genre/:id/update',genreControllers.GenreDeletePost);

//get request for one genre
router.get('/genre/:id',genreControllers.GenreDetails);



//        <-- BOOKINSTANCE ROUTES -->

//get request for list of BookInstance
router.get('/bookInstances',bookInstanceControllers.BookInstanceList);

//get request for creating bookInstance
router.get('/bookInstance/create',bookInstanceControllers.BookInstanceCreateGet);

//post request for creating bookInstance
router.post('/bookInstance/create',bookInstanceControllers.BookInstanceCreatePost);

//get request for update bookInstance
router.get('/bookInstance/:id/update',bookInstanceControllers.BookInstanceUpdateGet);

//post request for creating bookInstance
router.post('/bookInstance/:id/update',bookInstanceControllers.BookInstanceUpdatePost);

//get request for deleting bookInstance
router.get('/bookInstance/:id/delete',bookInstanceControllers.BookInstanceDeleteGet);

//post request for creating bookInstance
router.post('/bookInstance/:id/delete',bookInstanceControllers.BookInstanceDeletePost);

//get request for one bookInstance
router.get('/bookInstance/:id',bookInstanceControllers.BookInstanceDetails);



module.exports = router;


let express = require('express');
let router = express.Router();
 
const genres = require('../controllers/genre.controller.js');
const authors = require('../controllers/author.controller.js');
const translators = require('../controllers/translator.controller.js');
const books = require('../controllers/book.controller.js');

//Genre router
router.post('/api/genre', genres.createGenre);
router.get('/api/genre/:id', genres.getBooksByGenreId);
router.get('/api/genre_item/:id', genres.getGenreById);
router.get('/api/genres', genres.genres);
router.put('/api/genre_item/:id', genres.updateGenre);
router.delete('/api/genre_item/:id', genres.deleteGenre);

//Author router
router.post('/api/author', authors.createAuthor);
router.get('/api/author/:id', authors.getBooksByAuthorId);
router.get('/api/author_item/:id', authors.getAuthorById);
router.get('/api/authors', authors.authors);
router.put('/api/author_item/:id', authors.updateAuthor);
router.delete('/api/author_item/:id', authors.deleteAuthor);

//Translator router
router.post('/api/translator', translators.createTranslator);
router.get('/api/translator/:id', translators.getBooksByTranslatorId);
router.get('/api/translator_item/:id', translators.getTranslatorById);
router.get('/api/translators', translators.translators);
router.put('/api/translator_item/:id', translators.updateTranslator);
router.delete('/api/translator_item/:id', translators.deleteTranslator);

//Book router
router.post('/api/book', books.createBook);
router.get('/api/book/:id', books.getBook);
router.get('/api/books', books.books);
router.put('/api/book/:id', books.updateBook);
router.delete('/api/book/:id', books.deleteBook);

module.exports = router;
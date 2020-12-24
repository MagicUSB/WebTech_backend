const db = require('../config/db.config.js');
const Book = db.Book;

//CRUD Book
exports.createBook = (req, res) => {
    let book = {};

    try {
        book.book_name = req.body.book_name;
        book.author_id = req.body.author_id;
        book.genre_id = req.body.genre_id;
        book.translator_id = req.body.translator_id;
        book.year_of_publication = req.body.year_of_publication;
        Book.create(book,
            {attributes: ['id', 'book_name', 'author_id', 'genre_id', 'translator_id', 'year_of_publication']})
            .then(result => {
                res.status(200).jsonp(result);
            });
    } catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.books = (req, res) => {
    try {
        //Book.findAll()
        db.sequelize.query("SELECT books.id, books.book_name AS 'Назва', " +
            "authors.name AS 'Автор', " +
            "genres.name AS 'Жанр', " +
            "translators.name AS 'Перекладач', " +
            "books.year_of_publication AS 'Виданий' " +
            "FROM books " +
            "LEFT JOIN authors on authors.id = books.author_id " +
            "LEFT JOIN genres on genres.id = books.genre_id " +
            "LEFT JOIN translators on translators.id = books.translator_id",
            {raw: true, type: db.Sequelize.QueryTypes.SELECT})
            .then(books => {
                res.status(200).json(books);
            })
    } catch (error) {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
    }
}

exports.getBook = (req, res) => {
    // Book.findByPk(req.params.id,
    //     {attributes: ['book_name', 'author_id', 'genre_id', 'translator_id', 'year_of_publication']})
    db.sequelize.query("SELECT books.id, books.book_name AS 'Назва', " +
        "authors.name AS 'Автор', " +
        "genres.name AS 'Жанр', " +
        "translators.name AS 'Перекладач', " +
        "books.year_of_publication AS 'Виданий' " +
        "FROM books " +
        "LEFT JOIN authors on authors.id = books.author_id " +
        "LEFT JOIN genres on genres.id = books.genre_id " +
        "LEFT JOIN translators on translators.id = books.translator_id " +
        "WHERE books.id = " + req.params.id,
        {raw: true, type: db.Sequelize.QueryTypes.SELECT})
        .then(book => {
            res.status(200).json(book);
        }).catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
    })
}

exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findByPk(req.params.id);
        if (!book) {
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a book with id = " + book.id,
                error: "404"
            });
        } else {
            // update new change to database
            let updatedObject = {
                book_name: req.body.book_name,
                author_id: req.body.author_id,
                genre_id: req.body.genre_id,
                translator_id: req.body.translator_id,
                year_of_publication: req.body.year_of_publication
            }
            let result = await Book.update(updatedObject,
                {
                    returning: true,
                    where: {id: req.params.id},
                    attributes: ['id', 'book_name', 'author_id', 'genre_id', 'translator_id', 'year_of_publication']
                }
            );

            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not update a book with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not update a customer with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteBook = async (req, res) => {
    try {
        let bookId = req.params.id;

        let book = await Book.findByPk(bookId);

        if (!book) {
            res.status(404).json({
                message: "Does Not exist an book with id = " + bookId,
                error: "404",
            });
        } else {
            await book.destroy().then(() => {
                res.status(200);
                res.end();
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a book with id = " + req.params.id,
            error: error.message
        });
    }
}

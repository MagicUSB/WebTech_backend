const db = require('../config/db.config.js');
const Genre = db.Genre;
const Book = db.Book;

//CRUD Genre
exports.createGenre = (req, res) => {
    let genre = {};

    try {
        // Building Genre object from uploading request's body
        genre.name = req.body.name;

        // Save to MySQL database
        Genre.create(genre,
            {attributes: ['id', 'name']})
            .then(result => {
                res.status(200).json(result);
            });
    } catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.genres = (req, res) => {
    // find all Genre information from
    try {
        Genre.findAll({attributes: ['id', 'name']})
            .then(genres => {
                res.status(200).json(genres);
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

exports.getGenreById = (req, res) => {
    Genre.findByPk(req.params.id, {attributes: ['name']})
        .then(genre => {
            res.status(200).json(genre);
        }).catch(error => {
        // log on console
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        })
    });
}

exports.getBooksByGenreId = (req, res) => {
    db.sequelize.query("SELECT books.id, books.book_name AS 'Назва', " +
        "authors.name AS 'Автор', " +
        "genres.name AS 'Жанр', " +
        "translators.name AS 'Перекладач', " +
        "books.year_of_publication AS 'Виданий' " +
        "FROM books " +
        "JOIN authors on authors.id = books.author_id " +
        "LEFT JOIN genres on genres.id = books.genre_id " +
        "LEFT JOIN translators on translators.id = books.translator_id " +
        "WHERE books.genre_id = " + req.params.id, {type: db.sequelize.QueryTypes.SELECT})
        .then(booksByGenre => {
            res.status(200).json(booksByGenre);
        }).catch(error => {
        // log on console
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
    })
}

exports.updateGenre = async (req, res) => {
    try {
        let genre = await Genre.findByPk(req.params.id);

        if (!genre) {
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a genre with id = " + genre.id,
                error: "404"
            });
        } else {
            // update new change to database
            let updatedObject = {
                name: req.body.name
            }
            let result = await Genre.update(updatedObject,
                {
                    returning: true,
                    where: {id: req.params.id},
                    attributes: ['id', 'name']
                }
            );

            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not update a genre with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json(result);
            res.end();
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not update a customer with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteGenre = async (req, res) => {
    try {
        let genreId = req.params.id;
        let genre = await Genre.findByPk(genreId);

        if (!genre) {
            res.status(404).json({
                message: "Does Not exist a Genre with id = " + genreId,
                error: "404",
            });
        } else {
            await genre.destroy();
            res.status(200);
            res.end();
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a genre with id = " + req.params.id,
            error: error.message
        });
    }
}


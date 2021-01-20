const db = require('../config/db.config.js');
const Author = db.Author;

//CRUD Author
exports.createAuthor = (req, res) => {
    let author = {};

    try {
        author.name = req.body.name;

        Author.create(author,
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

exports.authors = (req, res) => {
    try {
        Author.findAll({attributes: ['id', 'name']})
            .then(authors => {
                res.status(200).json(authors);
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

exports.getAuthorById = (req, res) => {
    Author.findByPk(req.params.id, {attributes: ['name']})
        .then(author => {
            res.status(200).json(author);
        }).catch(error => {
        // log on console
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        })
    });
}

exports.getBooksByAuthorId = (req, res) => {
    db.sequelize.query("SELECT books.id, books.book_name AS 'Назва', " +
        "authors.name AS 'Автор', " +
        "genres.name AS 'Жанр', " +
        "translators.name AS 'Перекладач', " +
        "books.year_of_publication AS 'Виданий' " +
        "FROM books " +
        "JOIN authors on authors.id = books.author_id " +
        "LEFT JOIN genres on genres.id = books.genre_id " +
        "LEFT JOIN translators on translators.id = books.translator_id " +
        "WHERE books.author_id = " + req.params.id, {type: db.sequelize.QueryTypes.SELECT})
        .then(booksByAuthor => {
            res.status(200).json(booksByAuthor);
        }).catch(error => {
        // log on console
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
    })
}

exports.updateAuthor = async (req, res) => {
    try {
        let author = await Author.findByPk(req.params.id);

        if (!author) {
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a author with id = " + author.Id,
                error: "404"
            });
        } else {
            // update new change to database
            let updatedObject = {
                name: req.body.name
            }
            let result = await Author.update(updatedObject,
                {
                    returning: true,
                    where: {id: req.params.id},
                    attributes: ['id', 'name']
                }
            );

            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not update a author with id = " + req.params.id,
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

exports.deleteAuthor = async (req, res) => {
    try {
        let authorId = req.params.id;
        let author = await Author.findByPk(authorId);

        if (!author) {
            res.status(404).json({
                message: "Does Not exist an author with id = " + authorId,
                error: "404",
            });
        } else {
            await author.destroy();
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

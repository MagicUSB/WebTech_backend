const db = require('../config/db.config.js');
const Translator = db.Translator;

//CRUD Translator
exports.createTranslator = (req, res) => {
    let translator = {};

    try {
        // Building Translator object from uploading request's body
        translator.name = req.body.name;

        // Save to MySQL database
        Translator.create(translator,
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

exports.translators = (req, res) => {
    // find all Translator information from
    try {
        Translator.findAll({attributes: ['id', 'name']})
            .then(translators => {
                res.status(200).json(translators);
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

exports.getTranslatorById = (req, res) => {
    Translator.findByPk(req.params.id, {attributes: ['name']})
        .then(translator => {
            res.status(200).json(translator);
        }).catch(error => {
        // log on console
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        })
    });
}

exports.getBooksByTranslatorId = (req, res) => {
    db.sequelize.query("SELECT books.id, books.book_name AS 'Назва', " +
        "authors.name AS 'Автор', " +
        "genres.name AS 'Жанр', " +
        "translators.name AS 'Перекладач', " +
        "books.year_of_publication AS 'Виданий' " +
        "FROM books " +
        "JOIN authors on authors.id = books.author_id " +
        "LEFT JOIN genres on genres.id = books.genre_id " +
        "LEFT JOIN translators on translators.id = books.translator_id " +
        "WHERE books.translator_id = " + req.params.id, {type: db.sequelize.QueryTypes.SELECT})
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

exports.updateTranslator = async (req, res) => {
    try {
        let translator = await Translator.findByPk(req.params.id);

        if (!translator) {
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a translator with id = " + translator.Id,
                error: "404"
            });
        } else {
            // update new change to database
            let updatedObject = {
                name: req.body.name
            }
            let result = await Translator.update(updatedObject,
                {
                    returning: true,
                    where: {id: req.params.id},
                    attributes: ['id', 'name']
                }
            );

            // return the response to client
            if (!result) {
                res.status(500).json({
                    message: "Error -> Can not update a translator with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can not update a translator with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteTranslator = async (req, res) => {
    try {
        let translatorId = req.params.id;
        let translator = await Translator.findByPk(translatorId);

        if (!translator) {
            res.status(404).json({
                message: "Does Not exist a Translator with id = " + translatorId,
                error: "404",
            });
        } else {
            await translator.destroy();
            res.status(200);
            res.end();
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a translator with id = " + req.params.id,
            error: error.message
        });
    }
}


module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('book', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        book_name: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        author_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        genre_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        translator_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        year_of_publication: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: false,
    });

    return Book;
}
module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define('author', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return Author;
}

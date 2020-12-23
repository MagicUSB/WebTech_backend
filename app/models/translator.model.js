module.exports = (sequelize, Sequelize) => {
    const Translator = sequelize.define('translator', {
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

    return Translator;
}

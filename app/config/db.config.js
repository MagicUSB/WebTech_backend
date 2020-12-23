const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    operatorsAliases: false,

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Genre = require('../models/genre.model.js')(sequelize, Sequelize);
db.Author = require('../models/author.model.js')(sequelize, Sequelize);
db.Book = require('../models/book.model.js')(sequelize, Sequelize);
db.Translator = require('../models/translator.model.js')(sequelize, Sequelize);

module.exports = db;
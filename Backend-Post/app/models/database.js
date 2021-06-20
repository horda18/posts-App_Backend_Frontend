const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    });

sequelize.posts = require("./post.model.js")(sequelize,Sequelize);
sequelize.category = require("./category.model")(sequelize, Sequelize);

sequelize.posts.belongsTo(sequelize.category);

sequelize.category.hasMany(sequelize.posts);


//Create category table and all tables
/*sequelize.sync({ force: true })
    .then(() => {
        sequelize.category.bulkCreate([
            { name: "Software" }, { name: "Hardware" }, { name: "News" },
        ]);
    })
    .then(() => {
        console.log('Successfully created categories');
    })
    .catch((error) => console.error(error));*/

module.exports = sequelize;
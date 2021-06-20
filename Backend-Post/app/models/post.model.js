module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define(
        "post",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            date: {
                type: Sequelize.DATE,
            },
        },
        {
            timestamps: false,
        }
    );
    return Post;
};



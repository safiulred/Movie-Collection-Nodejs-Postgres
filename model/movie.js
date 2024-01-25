module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        director: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        paranoid: true, // soft delete
        indexes: [
            {
                fields: ['title']
            }
        ]
    })

    Movie.associate = (models) => {
        Movie.belongsToMany(models.Genre, {
            through: models.MovieGenre,
            foreignKey: 'movieId'
        })
    }

    return Movie
}
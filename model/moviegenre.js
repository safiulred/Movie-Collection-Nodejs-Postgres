'use strict'

module.exports = (sequelize, DataTypes) => {
    const MovieGenre = sequelize.define('MovieGenre', {
        isOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        remark: DataTypes.STRING
    }, {
        paranoid: true
    })

    MovieGenre.associate = (models) => {

    }

    return MovieGenre
}
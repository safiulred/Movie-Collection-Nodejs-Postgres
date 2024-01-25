const {
    Movie,
    MovieGenre
} = require('../../model')
const db = require('../../model')

const { Op } = require('sequelize')
// DATA BODY
// -> id -> value bisa single atau multi berupa array 
module.exports = async (req, res) => {
    const source = req.body
    const transaction = await db.sequelize.transaction({ autocommit: false })

    try {
        const arrIds = Array.isArray(source.id) ? source.id : [source.id]

        await Movie.destroy({
            where: {
                id: { [Op.in]: arrIds }
            },
            transaction
        })

        await MovieGenre.destroy({
            where: {
                movieId: { [Op.in]: arrIds }
            },
            transaction
        })

        await transaction.commit()
        res.status(200).send('Ok')
    } catch (err) {
        console.log(err)
        transaction && await transaction.rollback()
        res.status(500).send('Terjadi kelasalahan pada system')
    }
}
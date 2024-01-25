const {
    Movie,
    MovieGenre
} = require('../../model')
const db = require('../../model')

// DATA BODY
// -> id 
// -> title
// -> director
// -> summary
// -> genreIds -> [1,2,4] -> daftar id gennre yang masih ada di movie 
// -> genreDeleteIds -> [3] -> daftar id genre yang di hapus dari movie

module.exports = async (req, res) => {
    const source = req.body
    const transaction = await db.sequelize.transaction({ autocommit: false })

    try {
        const genreIds = source.genreIds
        const genreDeleteIds = source.genreDeleteIds
        const payload = {
            title: source.title,
            director: source.director,
            summary: source.summary
        }

        await Movie.update(payload, { where: { id: source.id }, transaction })

        genreIds && genreIds.length > 0 && await Promise.all(source.genreIds.map(async (item) => {
            const mg = await MovieGenre.update({ isOpen: true }, {
                where: { genreId: item, movieId: source.id },
                transaction
            })

            if (mg[0] === 0) {
                await MovieGenre.create({ movieId: source.id, genreId: item }, { transaction })
            }
        }))

        // set isOpen jadi false jika value genreDeleteIds lebih dari 0
        genreDeleteIds && genreDeleteIds.length > 0 && await Promise.all(source.genreDeleteIds.map(async (item) => {
            await MovieGenre.update({ isOpen: false }, { where: { genreId: item, movieId: source.id }, transaction })
        }))

        transaction && await transaction.commit()
        res.status(200).send('OK')
    } catch (err) {
        console.log(err)

        transaction && await transaction.rollback()
        res.status(500).send('Terjadi kelasalahan pada system')
    }
}
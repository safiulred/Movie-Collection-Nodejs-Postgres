const {
    Movie,
    MovieGenre
} = require('../../model')
const db = require('../../model')

// DATA BODY
// -> title
// -> director
// -> summary
// -> genreIds -> [1,2,3,4]
module.exports = async (req, res) => {
    const source = req.body
    let transaction = await db.sequelize.transaction({ autocommit: false })

    try {
        const genreIds = source.genreIds
        const payload = {
            title: source.title,
            director: source.director,
            summary: source.summary
        }

        const movie = await Movie.create(payload, { transaction })

        for (const g of genreIds) {
            const mg = await MovieGenre.update({ isOpen: true }, {
                where: { genreId: g, movieId: movie.id },
                transaction
            })

            // jika record gagal di update atau belum ada di MovieGenre
            // akan di buat baru
            if (mg[0] === 0) {
                await MovieGenre.create({ movieId: movie.id, genreId: g }, { transaction })
            }
        }

        transaction && await transaction.commit()
        res.status(200).send('OK')
    } catch (err) {
        transaction && await transaction.rollback()
        // console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system');
    }

}
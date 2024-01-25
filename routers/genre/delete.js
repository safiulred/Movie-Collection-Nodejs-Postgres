const { Genre, MovieGenre } = require('../../model')

module.exports = (req, res) => {
    const source = req.body

    Genre.destroy({ where: { id: source.id } })
        .then(result => {
            MovieGenre.destroy({ where: { genreId: source.id } })

            res.status(200).send('Ok')
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Terjadi kelasalahan pada system')
        })
}
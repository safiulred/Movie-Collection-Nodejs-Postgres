const { Movie, Genre } = require('../../model')

const moment = require('moment')
module.exports = (req, res) => {
    const source = req.body

    const attributes = ['id', 'title', 'director', 'summary', 'createdAt']
    Movie.findOne({
        attributes,
        where: { id: source.id },
        include: {
            model: Genre,
            attributes: ['id', 'name'],
            through: {
                attributes: ['isOpen'],
                where: { isOpen: true }
            },
        }
    }).then(result => {
        if (result) {
            result = JSON.parse(JSON.stringify(result))

            const genres = result.Genres.map(i => ({ id: i.id, name: i.name }))
            delete result.Genres

            const output = {
                ...result,
                genres,
                createdAt: moment(result.createdAt).utc().add(7, 'hours').format('YYYY-MM-DD HH:mmss')
            }

            res.status(200).send(output)
        }
        else res.status(404).send('Data not found')
    }).catch(err => {
        console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system');
    })
}
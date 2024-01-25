const { Genre } = require('../../model')

module.exports = (req, res) => {
    const source = req.body

    const queryId = source.id ? { id: source.id } : {}
    const where = { ...queryId }

    Genre.findOne({
        where,
        attributes: ['id', 'name'],
        raw: true
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system')
    })
}
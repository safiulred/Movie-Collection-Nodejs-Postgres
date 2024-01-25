const { Genre } = require('../../model')

module.exports = (req, res) => {
    const source = req.body

    const payload = {
        name: source.name.toLowerCase()
    }

    Genre.create(payload)
        .then(result => {
            res.status(200).send('Ok')
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err.message)
        })
}

module.exports.Bulk = (req, res) => {
    const source = req.body

    const payload = source.items.map(item => ({ name: item }))
    // console.log({ payload })
    Genre.bulkCreate(payload)
        .then(result => {
            res.status(200).send('Ok')
        }).catch(err => {
            res.status(500).send('Terjadi kelasalahan pada system')
        })
}
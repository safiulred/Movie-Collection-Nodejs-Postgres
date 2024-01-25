const { Genre } = require('../../model')

module.exports = (req, res) => {
    const source = req.body

    const payload = {
        name: source.name.toLowerCase()
    }

    Genre.update(payload, { where: { id: source.id } })
        .then(result => {
            res.status(200).send('Ok')
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Terjadi kelasalahan pada system')
        })
}
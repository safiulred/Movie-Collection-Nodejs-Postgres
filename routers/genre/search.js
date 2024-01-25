const { Genre } = require('../../model')

const { Op, Sequelize } = require('sequelize')

module.exports = (req, res) => {
    const source = req.body

    const keyword = source.keyword ? {
        [Op.or]: [
            Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('name')),
                Op.like,
                `%${source.keyword.toLowerCase()}%`
            ),
        ]
    } : {}

    const where = { ...keyword }

    Genre.findAll({
        attributes: ['id', 'name'],
        where,
        order: [['name', 'ASC']],
        raw: true
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system');
    })
}
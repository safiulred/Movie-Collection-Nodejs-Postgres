const {
    Movie,
    Genre,
    MovieGenre
} = require('../../model')

const moment = require('moment')
const { Op, Sequelize } = require('sequelize')

module.exports = (req, res) => {
    const source = req.body

    const keyword = source.keyword ? {
        [Op.or]: [{
            [Op.and]: [
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('title')),
                    Op.like,
                    `%${source.keyword.toString().toLowerCase()}%`
                ),
            ]
        }]
    } : {}

    const where = { ...keyword }

    const rowsPerPage = source.rowsPerPage ? source.rowsPerPage : 10
    const currentPage = source.currentPage ? source.currentPage : 1

    const limit = rowsPerPage !== 'All' ? rowsPerPage : undefined
    const offset = rowsPerPage !== 'All' ? (currentPage - 1) * rowsPerPage : 0
    const attributes = ['id', 'title', 'director', 'summary', 'createdAt']

    Movie.findAndCountAll({
        attributes,
        where,
        include: {
            model: Genre,
            attributes: ['id', 'name'],
            through: {
                attributes: ['isOpen'],
                where: { isOpen: true },
            },
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    }).then(result => {
        const totalData = result.count
        const totalPages = rowsPerPage !== "All" ? totalData ? totalData % rowsPerPage === 0
            ? parseInt(totalData / rowsPerPage)
            : parseInt(totalData / rowsPerPage) + 1
            : 0
            : 1

        const rows = JSON.parse(JSON.stringify(result.rows))
        const output = rows.map(item => {
            const genres = item.Genres.map(i => ({ id: i.id, name: i.name }))

            delete item.Genres
            return {
                ...item,
                genres,
                createdAt: moment(item.createdAt).utc().add(7, 'hours').format('YYYY-MM-DD HH:mmss')
            }
        })

        res.status(200).send({ output, totalData, totalPages })
    }).catch(err => {
        console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system')
    })
}
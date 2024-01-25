const { Movie, Genre } = require('../../model')

const { Op, Sequelize } = require('sequelize')
const moment = require('moment')

module.exports = (req, res) => {
    const source = req.body

    const keyword = source.keyword ? {
        [Op.or]: [
            Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('title')),
                Op.like,
                `%${source.keyword.toLowerCase()}%`
            ),
            Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('director')),
                Op.like,
                `%${source.keyword.toLowerCase()}%`
            ),
        ]
    } : {}

    const includeWhere = source.genreId ? {
        where: {
            id: {
                [Op.in]: Array.isArray(source.genreId) ? source.genreId : [source.genreId]
            }
        }
    } : {}

    const where = { ...keyword }
    const attributes = ['id', 'title', 'director', 'summary', 'createdAt']

    const rowsPerPage = source.rowsPerPage ? source.rowsPerPage : 10
    const currentPage = source.currentPage ? source.currentPage : 1

    const limit = rowsPerPage !== 'All' ? rowsPerPage : undefined
    const offset = rowsPerPage !== 'All' ? (currentPage - 1) * rowsPerPage : 0

    Movie.findAndCountAll({
        attributes,
        where,
        include: {
            model: Genre,
            attributes: ['id', 'name'],
            through: {
                attributes: ['isOpen'],
                where: { isOpen: true }
            },
            ...includeWhere
        },
        offset,
        limit,
        order: [['title', 'ASC']],
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
        res.status(500).send('Terjadi kelasalahan pada system');
    })
}
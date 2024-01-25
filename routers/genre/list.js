const { Genre } = require('../../model')

module.exports = (req, res) => {
    const source = req.body

    const rowsPerPage = source.rowsPerPage ? source.rowsPerPage : 10
    const currentPage = source.currentPage ? source.currentPage : 1

    const limit = rowsPerPage !== 'All' ? rowsPerPage : undefined
    const offset = rowsPerPage !== 'All' ? (currentPage - 1) * rowsPerPage : 0

    Genre.findAndCountAll({
        attributes: ['id', 'name'],
        offset,
        limit,
        order: [['name', 'ASC']],
        raw: true,
    }).then(result => {
        const totalData = result.count
        const totalPages = rowsPerPage !== "All" ? totalData ? totalData % rowsPerPage === 0
            ? parseInt(totalData / rowsPerPage)
            : parseInt(totalData / rowsPerPage) + 1
            : 0
            : 1

        const output = result.rows.map(item => ({ ...item }))
        res.status(200).send({ output, totalData, totalPages })
    }).catch(err => {
        console.log(err)
        res.status(500).send('Terjadi kelasalahan pada system')
    })
}
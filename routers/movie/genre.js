const {
    Movie,
    MovieGenre
} = require('../../model')

// DATA BODY
// id -> movieId
// genreId 
// act -> flag action
//  - remove
//  - update / add
module.exports.Set = async (req, res) => {
    const source = req.body

    const isOpen = source.act === "remove" ? false : true
    const mg = await MovieGenre.update({ isOpen }, {
        where: {
            movieId: source.id,
            genreId: source.genreId,
        }
    })

    if (source.act !== 'remove' && mg[0] === 0) {
        MovieGenre.create({ movieId: source.id, genreId: source.genreId })
    }

    res.status(200).send()
}


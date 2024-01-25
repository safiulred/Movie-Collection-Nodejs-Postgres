const router = require('express').Router()

const List = require('./list')
const Get = require('./get')
const Search = require('./search')
const Add = require('./add')
const Update = require('./update')
const Delete = require('./delete')
const Genre = require('./genre')

router.post('/', List)
router.post('/get', Get)
router.post('/search', Search)
router.post('/add', Add)
router.post('/update', Update)
router.post('/delete', Delete)

router.post('/genre/set', Genre.Set)

module.exports = router
const router = require('express').Router()

const List = require('./list')
const Get = require('./get')
const Search = require('./search')
const Add = require('./add')
const Update = require('./update')
const Delete = require('./delete')

router.post('/', List)
router.post('/get', Get)
router.post('/search', Search)
router.post('/add', Add)
router.post('/addBulk', Add.Bulk)
router.post('/update', Update)
router.post('/delete', Delete)

module.exports = router
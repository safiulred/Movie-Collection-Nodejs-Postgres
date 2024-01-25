const app = require('express').Router()

const Auth = require('./auth')
const Movie = require('./movie')
const Genre = require('./genre')

// melewati beberapa route yang tidak di cek authentication
app.use(Auth.unless({
    path: [
        '/user/login', // bypass
    ]
}))
// end

app.use('/movie', Movie)
app.use('/genre', Genre)

module.exports = app
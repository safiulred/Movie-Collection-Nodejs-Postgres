const env = process.env.NODE_ENV
const config = require('../config/core')[env]

const unless = require('express-unless')

const Auth = (req, res, next) => {
    const header = req.headers.authorization
    const source = req.useragent.source
    const ip = req.clientIp
    const url = req.originalUrl

    if (header) {
        const bearer = header.split(' ')
        const token = bearer[1]

        // proses verify token 
        // jika ada proses login nanti proses verify token akan berbeda
        if (token && token === config.token) {
            req.token = token
            console.log({ token, source, ip, url })
            next()
        }
        else {
            console.log({ message: 'Token Invalid', source, ip, url })
            res.status(403).send('Forbidden Access')
        }
    }
    else {
        console.log({ message: 'Header not found', source, ip, url })
        res.status(403).send('Forbidden Access')
    }
}

Auth.unless = unless

module.exports = Auth
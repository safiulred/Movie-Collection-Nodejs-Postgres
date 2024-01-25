require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const requestIp = require('request-ip')
const useragent = require('express-useragent')

const env = process.env.NODE_ENV || 'development'
const config = require('./config/core')[env]

const app = express()

app.use(cors())
app.use(requestIp.mw())
app.use(useragent.express())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = config.port
const router = require('./routers')

app.use(router)

app.listen(port, () => {
    console.log(`app running on [${env}] environment on port : ${port}`)
})

process.on('exit', code => {
    console.log(`Exit code : ${code}`)
})
process.on('uncaughtException', err => {
    console.log(err)
})
process.on('unhandledRejection', err => {
    console.log(err)
})
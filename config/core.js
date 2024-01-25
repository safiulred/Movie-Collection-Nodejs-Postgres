module.exports = {
    development: {
        port: process.env.DEV_PORT,
        host: process.env.DEV_HOST,
        token: process.env.DEV_TOKEN
    },
    production: {
        port: process.env.PORT,
        host: process.env.HOST,
        token: process.env.TOKEN
    }
}
require('dotenv').config()
const db = require('./model')

db.sequelize
    .sync({ alter: true })
    .then(() => console.log('Migration success'))
    .catch((error) => console.log(error))
    .finally(() => {
        console.log('exit')
        process.exit(0)
    })

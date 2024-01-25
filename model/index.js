'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)

const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/postgres')[env]

class Database {

    constructor() {
        this.db = {}

        if (!Database.instance) {
            this._sequelize = new Sequelize(
                config.database,
                config.username,
                config.password,
                config,
            )

            this.initialize()
            Database.instance = this;
        }

        return Database.instance
    }

    initialize() {
        fs.readdirSync(__dirname)
            .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
            .forEach(file => {
                const model = require(path.join(__dirname, file))(this._sequelize, Sequelize.DataTypes)

                this.db[model.name] = model
            })

        Object.keys(this.db).forEach(modelName => {
            if (this.db[modelName].associate) {
                this.db[modelName].associate(this.db)
            }
        })

        this.db.sequelize = this._sequelize
    }
}

const database = new Database()


module.exports = database.db
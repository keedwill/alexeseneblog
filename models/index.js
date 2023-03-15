const dbConfig = require('../config/db.config.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Tables
db.users = require('./userModel.js')(sequelize, Sequelize)
db.posts = require('./postModel.js')(sequelize, Sequelize)
db.comments = require('./commentModel.js')(sequelize, Sequelize)
db.likes = require('./likeModel.js')(sequelize, Sequelize)

// Associations of User & Post tables
db.users.hasMany(db.posts, { onDelete: 'cascade' })
db.posts.belongsTo(db.users)

// Associations of the Comment & User and Comment & Post tables
db.users.hasMany(db.comments, { onDelete: 'cascade' })
db.comments.belongsTo(db.users)
db.posts.hasMany(db.comments, { onDelete: 'cascade' })
db.comments.belongsTo(db.posts)

// Associations of Like & user and Like & Post tables
db.users.hasMany(db.likes, { onDelete: 'cascade' })
db.likes.belongsTo(db.users)
db.posts.hasMany(db.likes, { onDelete: 'cascade' })
db.likes.belongsTo(db.posts)

module.exports = db

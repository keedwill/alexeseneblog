const express = require('express')
const cors = require('cors')
const path = require('path')
// Security
require('dotenv').config({ path: './config/.env' })
const helmet = require('helmet')
const xssClean = require('xss-clean')

// Routes
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')

// Express
const app = express()

//Secures Express by setting various HTTP headers
app.use(helmet())

// Sanitize user input
app.use(xssClean())

// Connecting to the db - sequelize
const db = require('./models')
db.sequelize.sync()

// // Drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.')
// })

// Creation of the middleware containing the response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') //Access the API from any origin
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ) //Add headers to requests to the API
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ) //Methods allowed
  next()
})

// CORS
app.use(cors())

// To turn the request body into a usable JavaScript object (replaces bodyParser)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// How to process requests to the /image route
app.use('/images', express.static(path.join(__dirname, 'images')))

// Routes
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
// app.use('/posts/:postId/comments', commentRoutes)

module.exports = app

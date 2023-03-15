const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../config/.env' })

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    const userId = decodedToken.userId
    //If the userId of the request does not correspond to that of the token => Invalid user ID otherwise we call next()
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid User ID'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthenticated request' + error })
  }
}

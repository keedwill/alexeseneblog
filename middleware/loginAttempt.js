const rateLimit = require('express-rate-limit')

const limitAttempt = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    'You have reached the maximum number of attempts allowed. Please try again in an hour ',
})

module.exports = limitAttempt

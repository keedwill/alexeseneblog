const passwordSchema = require('../models/password')

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "The password must contain at least 8 characters including at least one number, one uppercase letter, one lowercase letter and no spaces",
    })
  } else {
    next()
  }
}

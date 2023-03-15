const db = require('../models')
const User = db.users
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const emailScramble = require('email-scramble')
const jwt = require('jsonwebtoken')
const fs = require('fs')

// Creation of a new user
exports.signup = (req, res, next) => {
  if (emailValidator.validate(req.body.email)) {
    const encodedEmail = emailScramble.encode(req.body.email)
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = {
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          email: encodedEmail,
          // Encrypted password recovery
          password: hash,
        }
        // Saving the new user in db
        User.create(user)
          .then(() =>
            res.status(201).json({ message: 'New user created' })
          )
          .catch((error) => res.status(400).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
  } else {
    res.status(400).json({ message: 'Please enter a valid email' })
  }
}

exports.login = (req, res, next) => {
  const encodedEmail = emailScramble.encode(req.body.email)
  // Recovery of the user with his email
  User.findOne({ where: { email: encodedEmail } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }
      // Password verification
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Invalid password' })
          }
          res.status(200).json({
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.SECRET_KEY,
              {
                expiresIn: '24h',
              }
            ),
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

// Recovery of a user
exports.getUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => res.status(200).json(user))
    .catch((error) =>
      res.status(400).json({
        message:
          "Unable to retrieve user data" + error,
      })
    )
}

// Editing a user
exports.updateUser = (req, res, next) => {
  const user = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }
  User.update(user, { where: { id: req.params.id } })
    .then(() =>
      res
        .status(200)
        .json({ message: 'User data has been updated' })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Unable to update profile' + error })
    )
}

// Deleting a user
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      const filename = user.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        User.destroy({ where: { id: req.params.id } })
          .then(() =>
            res.status(200).json({ message: "User has been deleted" })
          )
          .catch((error) =>
            res.status(400).json({
              message:
                "A problem occurred while deleting the user" +
                error,
            })
          )
      })
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: 'there is an error in the findOne catch' + error })
    )
}

const db = require('../models')
const User = db.users
const Comment = db.comments

// Create a comment
exports.createComment = (req, res, next) => {
  const comment = { ...req.body, userId: req.body.userId }
  Comment.create(comment)
    .then(() => res.status(201).json({ message: 'Comment created' }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Unable to create comment' + error })
    )
}

// Retrieve all comments from a post
exports.getComments = (req, res) => {
  Comment.findAll({ where: { postId: req.params.id }, include: User })
    .then((data) => res.status(201).json({ data }))
    .catch((error) =>
      res
        .status(500)
        .json({ message: 'Unable to retrieve comments. ' + error })
    )
}

// Delete a comment
exports.deleteComment = (req, res, next) => {
  Comment.destroy({ where: { id: req.params.id } })
    .then(() =>
      res.status(200).json({ message: 'The comment has been deleted' })
    )
    .catch((error) =>
      res.status(400).json({
        message:
          'There was a problem deleting the comment' +
          error,
      })
    )
}

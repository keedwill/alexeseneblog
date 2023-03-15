const db = require('../models')
const User = db.users
const Post = db.posts
const Like = db.likes
const fs = require('fs')
const { Op } = require('sequelize')

// Create a post
exports.createPost = (req, res, next) => {
  const post = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
        like: 0,
      }
    : { ...req.body, like: 0 }
    
  Post.create(post)
    .then(() => res.status(201).json({ message: 'Post created' }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Unable to create post' + error })
    )
}

// Delete a post
exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.imageUrl != null) {
        const filename = post.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Post.destroy({ where: { id: req.params.id } })
            .then(() =>
              res
                .status(200)
                .json({ message: 'The post has been deleted' })
            )
            .catch((error) =>
              res.status(400).json({
                message:
                  'There was a problem deleting the post' +
                  error,
              })
            )
        })
      } else {
        Post.destroy({ where: { id: req.params.id } })
          .then(() =>
            res.status(200).json({ message: 'The post has been deleted' })
          )
          .catch((error) =>
            res.status(400).json({
              message:
                'There was a problem deleting the post' +
                error,
            })
          )
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: 'there is an error in the findOne catch' + error })
    )
}

// Retrieve all publications
exports.getAllPosts = (req, res, next) => {
  Post.findAll({ include: User })
    .then((posts) => res.status(200).json(posts))
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Unable to display posts" + error })
    )
}

// Fetch a single post
exports.getOnePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id }, include: User })
    .then((post) => res.status(200).json(post))
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Unable to display post" + error })
    )
}

// Like a post
exports.likePost = (req, res, next) => {
  Like.findOne({
    where: { userId: req.body.userId, postId: req.body.postId },
  }).then((response) => {
    if (!response) {
      Like.create({ ...req.body })
      Post.increment({ like: 1 }, { where: { id: req.body.postId } })
      res
        .status(200)
        .json({ message: 'Like saved and counter incremented' })
    } else {
      Like.destroy({
        where: {
          [Op.and]: [{ postId: req.body.postId }, { userId: req.body.userId }],
        },
      })
      Post.decrement({ like: 1 }, { where: { id: req.body.postId } })
      res.status(200).json({ message: 'Like deleted and counter decremented' })
    }
  })
}

// Edit a post
exports.updatePost = (req, res, next) => {
  console.log(req.body)
  Post.update({ content: req.body.content }, { where: { id: req.params.id } })
    .then(() =>
      res.status(200).json({ message: 'The post has been updated' })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'Unable to update post' + error })
    )
}

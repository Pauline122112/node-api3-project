const express = require('express');
const {
	validateUserId,
	validateUser,
	validatePost,
} = require("../middleware/middleware.js");
const Users = require('./users-model')
const Posts = require("../posts/posts-model");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
	Users.get(req.query)
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

router.post("/:id/posts", validateUserId,(req, res) => {
	// RETURN THE NEWLY CREATED USER POST
	// this needs a middleware to verify user id
	// and another middleware to check that the request body is valid
	const postInfo = { ...req.body, user_id: req.params.id };
	Posts.insert(postInfo)
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

router.post("/", validatePost, (req, res) => {
	// RETURN THE NEWLY CREATED USER OBJECT
	// this needs a middleware to check that the request body is valid
	Posts.insert(req.body)
		.then((post) => {
			res.status(201).json(post);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

router.put('/:id', (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// do not forget to export the router
module.exports = router
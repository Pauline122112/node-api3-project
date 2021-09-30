const express = require('express');
const {
	validateUserId,
	validateUser,
	validatePost,
} = require("../middleware/middleware")

const User = require('./users-model')
const Posts = require("../posts/posts-model")

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
  User.get(req.query)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			res.status(500).json({ message: err.message });
		});
})

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params
  User.getById(id)
  .then(user => {
    res.status(200).json(req.user)
  })
})

router.post("/", validateUser, (req, res, next) => {
  User.insert({ name: req.name })
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
  })

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  const changes = req.body
	User.update(req.params.id, changes,{ name: req.name })
  .then(() => {
    return User.getById(req.params.id, changes)
  })
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
});

router.delete("/:id", validateUserId, async (req, res, next) => {
	try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
})

router.get("/:id/posts", validateUserId, async (req, res, next) => {
		try {
			const result = await User.getUserPosts(req.params.id)
			res.json(result);
		} catch (err) {
			next(err);
		}
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res, next) => {
try {
const result = await Posts.insert({
  user_id: req.params.id,
  text: req.text,
})
res.status(201).json(result)
} catch (err) {
  next(err)
}
})

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'something tragic inside posts router happened',
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router
// Express imports
const express = require('express');
const router = new express.Router();

// Sec imports
const auth = require('../middleware/authenticator');

// DB imports
const Post = require('../db/models/post');

// Make express parse all data as json
router.use(express.json());

// fetch all posts
router.get('/posts', async (req, res) => {
	try {
		const posts = await Post.find();
		res.send(posts);
	} catch (error) {
		res.status(400).send(error);
	}
});

// get post by post id
router.get('/posts/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const post = await Post.findById(_id);
		if (!post) {
			return res.status(404).send();
		}
		res.send(post);
	} catch (error) {
		res.status(500).send();
	}
});

// create a post
router.post('/posts', auth, async (req, res) => {
	// attaching OP to post
	const post = new Post({
		...req.body,
		postowner: req.user._id,
	});

	try {
		await post.save();
		res.status(201).send(post);
	} catch (error) {
		res.status(400).send(error);
	}
});

// delete a post (post owner only)
router.delete('/posts/:id', auth, async (req, res) => {
	try {
		const post = await Post.findOneAndDelete({ _id: req.params.id, postowner: req.user._id });
		if (!post) {
			return res.status(404).send('Not allowed');
		}
		res.send(post);
	} catch (error) {
		res.status(500).send(error);
	}
});

// allowing for postowner to update his post
// provide post id
router.patch('/posts/owner/:id', auth, async (req, res) => {
	// Validation logic
	const updates = Object.keys(req.body);
	const allowedUpdates = ['title', 'postbody', 'links'];
	// check if each individual update is in allowedUpdates
	const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

	// respond to user if task update is invalid
	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update' });
	}

	// Update logic
	try {
		// Fetch user ID + owner ID and store it
		const post = await Post.findOne({ _id: req.params.id, postowner: req.user._id });
		// if post+postowner doesn't exist return 404
		if (!post) {
			// To trigger, make a 12 byte request > 123456789012
			return res.status(404).send('Task not found');
		}
		updates.forEach((update) => (post[update] = req.body[update]));
		await post.save();
		res.send(post);
	} catch (error) {
		res.status(400).send(error);
	}
});

// comment on a post, provide post id
// TODO not working properly
router.patch('/posts/comment/:id', auth, async (req, res) => {
	// making sure we're trying to comment
	const update = Object.keys(req.body);
	const allowedUpdate = ['comments'];
	const isValidUpdate = update.every((update) => allowedUpdate.includes(update));
	// respond if update is invalid
	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid' });
	}
	// Update logic
	try {
		//TODO Hacky destructuring, revisit to make more elegant
		const post = await Post.findById(req.params.id);
		const comment = req.body.comments[0];
		post.comments.push(comment);
		await post.save();
		res.send(post);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;

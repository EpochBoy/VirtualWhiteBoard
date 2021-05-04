const express = require('express');
const router = new express.Router();

// model imports
const User = require('../db/models/user');

// sec imports
const auth = require('../middleware/authenticator');

// Express config
// parse all data as json
router.use(express.json());

// Create new user
router.post('/users/create', async (req, res) => {
	const user = new User(req.body);
	try {
		const token = await user.generateAuthToken();
		await user.save();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

// Login existing user
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (error) {
		res.status(400).send();
	}
});

// Logout current user
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send('Logout failed');
	}
});

// Nuke all current sessions
router.post('/users/logout/all', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

// Current user
router.get('/users/self', auth, async (req, res) => {
	res.send(req.user);
});

// Self update user
router.patch('/users/self', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password'];
	const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update' });
	}
	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Delete current user
router.delete('/users/self', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;

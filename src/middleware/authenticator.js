const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		// check that secret used in model is the same as here
		const decoded = jwt.verify(token, 'SuperSecretSecret');
		// Finds user with correct id and checks if token is stored
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
		if (!user) {
			throw new Error();
		}
		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;

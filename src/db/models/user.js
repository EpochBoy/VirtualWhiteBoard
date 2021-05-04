const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('./post');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

// Creating a virtual property, to connect user&posts for get route
userSchema.virtual('userPosts', {
	ref: 'Post',
	localField: '_id',
	foreignField: 'postowner',
});

// generate JWT Token
userSchema.methods.generateAuthToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, 'SuperSecretSecret');
	// saving the token to the user
	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

// Verify Login
userSchema.statics.findByCredentials = async (email, password) => {
	// Looking for user by email
	const user = await User.findOne({ email });
	if (!user) {
		// Intentionally generic info, as it might be a bad actor
		throw new Error('Unable to Login');
	}

	// Checking password hash with existing password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		// Intentionally generic info, as it might be a bad actor
		throw new Error('Unable to Login');
	}

	return user;
};

// Hash the clear text password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

// Making a public user profile, where I only expose necessary information
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

// Delete user posts when user is deleted
userSchema.pre('remove', async function (next) {
	const user = this;
	await Post.deleteMany({ postowner: user._id });
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

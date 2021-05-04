const mongoose = require('mongoose');
const validator = require('validator');

// Explicitly making title/description none mandatory, so a user can just post an URL
const Post = mongoose.model('Post', {
	title: {
		type: String,
		trim: true,
		required: false,
	},
	postbody: {
		type: String,
		trim: true,
		required: false,
		maxLength: 280,
	},
	links: {
		type: String,
		trim: true,
		unique: true,
		validate(value) {
			if (!validator.isURL(value)) {
				throw new Error('Invalid URL');
			}
		},
	},
	comments: [
		{
			comment: {
				type: String,
				required: true,
			},
			commentowner: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'User',
			},
		},
	],
	postowner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
});

module.exports = Post;

// Src: https://www.joomconnect.com/blog/twitter-101-character-count-limits-and-best-practices-social-media-101

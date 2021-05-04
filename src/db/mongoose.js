const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/virtual_white_board_db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

// note: https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate

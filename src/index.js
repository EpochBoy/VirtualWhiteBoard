// Express imports
const express = require('express');
const app = express();

// Mongoose imports
require('./db/mongoose');

// Router imports
const userRouter = require('./routers/user');
const postRouter = require('./routers/posts');
app.use(userRouter, postRouter);

// Local
const port = 8181;

// Set server to listen
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

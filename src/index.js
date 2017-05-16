const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routeCandidate = require('./routes/candidate');
const poll = require('./routes/poll');
const poll_new = require('./routes/poll_new');
const poll_up = require('./routes/poll_up');
const voter = require('./routes/voter');
const config = require('./config.json');
const app = express();
const port = process.env.PORT || config.port;

// logger
app.use(morgan('dev'));
app.use(cors({
	exposedHeaders: config.corsHeaders
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// api router
app.use('/api/candidate', routeCandidate);
app.use('/api/poll', poll);
app.use('/api/voter', voter);
app.use('/api/poll/up', poll_up);
app.use('/api/poll/create', poll_new);

app.listen(port);
console.log(`Started on port ${port}`);

module.exports = app;

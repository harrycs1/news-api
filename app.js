const express = require('express');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.all('*', (req, res) => {
	res.status(404).send({ msg: "path not found" })
})

module.exports = app;
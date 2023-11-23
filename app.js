const express = require('express');
const { handleCustomErrors, handlePsqlErrors } = require('./errors');
const apiRouter = require('./routes/api-router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.all('*', (req, res) => {
	res.status(404).send({ msg: "path not found" })
})

module.exports = app;
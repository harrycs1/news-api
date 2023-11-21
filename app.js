const express = require('express');
const { handleCustomErrors, handlePsqlErrors } = require('./errors');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticleById, getArticles } = require('./controllers/articles.controllers');
const { getEndpoints } = require('./controllers/endpoints.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById);

app.get('/api', getEndpoints);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.all('*', (req, res) => {
	res.status(404).send({ msg: "path not found" })
})

module.exports = app;
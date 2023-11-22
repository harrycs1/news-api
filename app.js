const express = require('express');
const { handleCustomErrors, handlePsqlErrors } = require('./errors');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticle, patchArticleVotes } = require('./controllers/articles.controllers');
const { getEndpoints } = require('./controllers/endpoints.controllers');
const { getUsers } = require('./controllers/users.controllers');
const { getCommentsByArticleId, postComment, deleteComment } = require('./controllers/comments.controllers')

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.patch('/api/articles/:article_id', patchArticleVotes)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);

app.get('/api/users', getUsers);

app.get('/api', getEndpoints);

app.delete('/api/comments/:comment_id', deleteComment)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.all('*', (req, res) => {
	res.status(404).send({ msg: "path not found" })
})

module.exports = app;
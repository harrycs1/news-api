const { getEndpoints } = require('../controllers/endpoints.controllers');
const { getTopics, postTopic } = require('../controllers/topics.controllers');

const apiRouter = require('express').Router();
const articleRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');

apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.get('/', getEndpoints);
apiRouter
    .route('/topics')
    .get(getTopics)
    .post(postTopic);

module.exports = apiRouter;
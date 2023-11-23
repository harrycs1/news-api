const { selectArticleById, selectArticles } = require('../models/articles.models')
const { selectArticle } = require('../models/articles.models');
const { amendArticleVotes, checkArticleExists } = require('../models/comments.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}
      
exports.patchArticleVotes = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params
    const articlePromises = [checkArticleExists(article_id), amendArticleVotes(inc_votes, article_id)]

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const amendedArticle = resolvedPromises[1]
        res.status(200).send({ article: amendedArticle })
    })
    .catch(next)
}
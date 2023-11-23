const { selectArticleById, selectArticles, amendArticleVotes, checkArticleExists } = require('../models/articles.models');
const { checkTopicExists } = require('../models/topics.models');

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
    const { topic } = req.query;
    const articlePromises = [selectArticles(topic)]

    if (topic) {
        articlePromises.push(checkTopicExists(topic));
    }

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const articles = resolvedPromises[0];
        if (!articles.length) { articles[0] = "No results found" }
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
const { selectArticleById, selectArticles, amendArticleVotes, checkArticleExists, insertArticle } = require('../models/articles.models');
const { checkTopicExists } = require('../models/topics.models');
const { selectUserByUsername, checkUsernameExists } = require('../models/users.models');

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
    const { topic, sort_by, order, limit = 10, p } = req.query;
    const articlePromises = [selectArticles(topic, sort_by, order)]

    if (topic) {
        articlePromises.push(checkTopicExists(topic));
    }

    if (limit && !Number.isInteger(+limit)) {
        res.status(400).send({msg: "Invalid limit query"})
    }

    if (p && !Number.isInteger(+p)) {
        res.status(400).send({msg: "Invalid page query"})
    }

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const firstArticleIndex = (p * limit-1) || 0;
        const lastArticleIndex = (p * limit+1) || limit;
        const limitedResponse = { articles: resolvedPromises[0].slice(firstArticleIndex, lastArticleIndex) }
        limitedResponse.total_count = resolvedPromises[0].length;
        res.status(200).send(limitedResponse)
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

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;
    const { author } = req.body;
    const { topic } = req.body;
    const articlePromises = [checkTopicExists(topic), selectUserByUsername(author), insertArticle(newArticle)]

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const article = resolvedPromises[2]
        res.status(201).send(article)
    })
    .catch(next)
}
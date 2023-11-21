const { selectCommentsByArticleId, checkArticleExists, insertComment } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const articlePromises = [selectCommentsByArticleId(article_id), checkArticleExists(article_id)];

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;

    insertComment(newComment, article_id)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}
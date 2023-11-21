const { selectCommentsByArticleId, checkArticleExists, insertComment, checkUserExists } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const articlePromises = [checkArticleExists(article_id), selectCommentsByArticleId(article_id)];

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[1]
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;
    const articlePromises = [checkArticleExists(article_id), checkUserExists(newComment.username), insertComment(newComment, article_id), ];

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const comment = resolvedPromises[2]
        res.status(201).send({ comment })
    })
    .catch(next)
}
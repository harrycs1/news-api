const { checkArticleExists } = require("../models/articles.models");
const { selectCommentsByArticleId, insertComment, checkUserExists, checkCommentExists, removeComment, amendComment } = require("../models/comments.models");

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
    const articlePromises = [checkArticleExists(article_id), checkUserExists(newComment.username), insertComment(newComment, article_id)];

    Promise.all(articlePromises)
    .then((resolvedPromises) => {
        const comment = resolvedPromises[2]
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    const commentPromises = [checkCommentExists(comment_id), removeComment(comment_id)]

    Promise.all(commentPromises)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    const commentPromises = [checkCommentExists(comment_id), amendComment(comment_id, inc_votes)]

    Promise.all(commentPromises)
    .then((resolvedPromises) => {
        const amendedComment = resolvedPromises[1]
        res.status(200).send({ comment: amendedComment})
    })
    .catch(next)
}
const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db.query(queryStr, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

exports.checkArticleExists = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Article does not exist"})
        }
    })
}
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

exports.amendArticleVotes = (inc_votes, article_id) => {
    const queryStr = `UPDATE articles
                    SET
                        votes = votes + $1
                    WHERE
                        article_id = $2
                    RETURNING *`
    
    return db
    .query(queryStr, [inc_votes, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
}
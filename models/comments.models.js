const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db
    .query(queryStr, [article_id])
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

exports.checkUserExists = (username) => {
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "User does not exist"})
        }
    })
}

exports.insertComment = (newComment, article_id) => {
    const { username, body } = newComment;
    const queryValues = [username, body, article_id]

    const queryStr = `INSERT INTO comments
                        (author, body, article_id)
                    VALUES
                        ($1, $2, $3)
                    RETURNING *`

    return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
        return rows[0]
    })
}
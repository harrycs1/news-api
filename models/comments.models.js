const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id, limit = 10, p) => {
    const queryStr =    `SELECT * FROM comments 
                        WHERE article_id = $1 
                        ORDER BY created_at 
                        DESC
                        LIMIT $2
                        OFFSET $3`

    const page = (p-1) * limit || 0;
    const queryValues = [article_id, limit, page]

    if (!Number.isInteger(+limit)) {
        return Promise.reject({status: 400, msg: "Invalid limit query"})
    }

    if (p && !Number.isInteger(+p)) {
        return Promise.reject({status: 400, msg: "Invalid page query"})
    }

    return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
        return rows
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

exports.checkCommentExists = (comment_id) => {
    return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Comment does not exist"})
        }
    })
}

exports.removeComment = (comment_id) => {
    const queryStr = `DELETE FROM comments WHERE comment_id = $1`
    return db.query(queryStr, [comment_id])
}

exports.amendComment = (comment_id, inc_votes) => {
    const queryStr =    `UPDATE comments
                        SET
                            votes = votes + $1
                        WHERE
                            comment_id = $2
                        RETURNING *`

    return db
    .query(queryStr, [inc_votes, comment_id])
    .then(({ rows }) => {
    return rows[0]
    })
}
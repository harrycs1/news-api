const db = require('../db/connection');

exports.selectArticle = (article_id) => {
    const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
    return db.query(queryStr, [article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Article does not exist"})
        } else {
            return rows[0]
        }
    })
}
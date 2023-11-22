const db = require('../db/connection');

exports.selectArticle = (article_id) => {
    const queryStr =    `SELECT articles.article_id, articles.author, articles.body, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) as comment_count
                        FROM articles LEFT JOIN comments
                        ON articles.article_id = comments.article_id
                        WHERE articles.article_id = $1
                        GROUP BY articles.article_id`;

    return db.query(queryStr, [article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Article does not exist"})
        } else {
            return rows[0]
        }
    })
}
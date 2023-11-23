const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
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

exports.selectArticles = () => {
    const queryStr =    `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
                        FROM articles JOIN comments
                        ON articles.article_id = comments.article_id
                        GROUP BY articles.article_id
                        ORDER BY articles.created_at DESC`
    return db.query(queryStr)
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
const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    const queryStr =    `SELECT 
                            articles.article_id, 
                            articles.author, 
                            articles.body, 
                            articles.title, 
                            articles.topic, 
                            articles.created_at, 
                            articles.votes, 
                            articles.article_img_url, 
                            COUNT(comments.comment_id) as comment_count
                        FROM 
                            articles LEFT JOIN comments
                        ON 
                            articles.article_id = comments.article_id
                        WHERE 
                            articles.article_id = $1
                        GROUP BY 
                            articles.article_id`;

    return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Article does not exist"})
        } else {
            return rows[0]
        }
    })
}

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    let queryStr =    `SELECT 
                            articles.article_id, 
                            articles.author, 
                            articles.title, 
                            articles.topic, 
                            articles.created_at, 
                            articles.votes, 
                            article_img_url, 
                            COUNT(comments.article_id) AS comment_count
                        FROM 
                            articles LEFT JOIN comments
                        ON 
                            articles.article_id = comments.article_id`

    const queryValues = [];

    if (topic) {
        queryValues.push(topic);
        queryStr += ` WHERE articles.topic = $1`
    }

    queryStr += ` GROUP BY articles.article_id`;

    const allowedSorts = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes', 'comment_count']

    if (sort_by && allowedSorts.includes(sort_by)) {
        queryStr += ` ORDER BY articles.${sort_by}`
    } else {
        return Promise.reject({status: 400, msg: "Invalid sort query"})
    }

    if (order && ['asc', 'desc'].includes(order)) {
        queryStr += ` ${order}`
    }
    else if (order && !['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query'});
    }

    return db
    .query(queryStr, queryValues)
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

exports.insertArticle = (newArticle) => {
    const { author, title, body, topic, article_img_url } = newArticle;
    const queryValues = [author, title, body, topic, article_img_url];

    const queryStr =    `WITH new_article AS (
                            INSERT INTO articles
                                (author, title, body, topic, article_img_url)
                            VALUES
                                ($1, $2, $3, $4, $5)
                            RETURNING *)
                        SELECT 
                            new_article.article_id,
                            new_article.author,
                            new_article.title,
                            new_article.body,
                            new_article.topic,
                            new_article.article_img_url,
                            new_article.created_at,
                            new_article.votes,
                            COUNT(comments.comment_id) as comment_count
                        FROM
                            new_article LEFT JOIN comments
                        ON 
                            new_article.article_id = comments.article_id
                        GROUP BY 
                        new_article.article_id, 
                        new_article.author, 
                        new_article.title, 
                        new_article.body, 
                        new_article.topic, 
                        new_article.article_img_url, 
                        new_article.created_at, 
                        new_article.votes`

    return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
        return rows[0]
    })
}
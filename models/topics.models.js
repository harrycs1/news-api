const db = require('../db/connection');
const endpoints = require('../endpoints.json');

exports.selectTopics = () => {
    const queryStr = `SELECT * FROM topics`
    return db.query(queryStr)
    .then(({ rows }) => {
        return rows
    })
}

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: "Topic does not exist"})
        }
    })
}

exports.insertTopic = (newTopic) => {
    const { slug, description } = newTopic;

    const queryValues = [slug, description]

    const queryStr =    `INSERT INTO topics
                            (slug, description)
                        VALUES
                            ($1, $2)
                        RETURNING *`
                    
    return db.query(queryStr, queryValues)
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.checkTopicAlreadyExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
        if (rows.length) {
            return Promise.reject({status: 400, msg: "Topic already exists"})
        }
    })
}
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
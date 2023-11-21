const db = require('../db/connection');
const endpoints = require('../endpoints.json');

exports.selectTopics = () => {
    const queryStr = `SELECT * FROM topics`
    return db.query(queryStr)
    .then(({ rows }) => {
        return rows
    })
}
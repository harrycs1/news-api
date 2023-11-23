const db = require('../db/connection');

exports.selectUsers = () => {
    const queryStr = `  SELECT * FROM users`
    return db.query(queryStr)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectUserByUsername = (username) => {
    const queryStr = `SELECT * FROM users WHERE username = $1`;

    return db.query(queryStr, [username])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Username does not exist"})
        } else {
            return rows[0]
        }
    })
}
const { selectTopics } = require("../models/topics.models");
const endpoints = require('../endpoints.json');


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    })
}

// this controller should be in it's own file?
// we edit the endpoints.json file everytime we add an endpoint?
// test?
exports.getApi = (req, res, next) => {
    res.status(200).send(endpoints)
}
const { selectTopics, insertTopic, checkTopicExists, checkTopicAlreadyExists } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    })
}

exports.postTopic = (req, res, next) => {
    const newTopic = req.body;
    const { slug } = req.body;

    const topicPromises = [checkTopicAlreadyExists(slug), insertTopic(newTopic)]

    Promise.all(topicPromises)
    .then((resolvedPromises) => {
        const topic = resolvedPromises[1]
        res.status(201).send(topic)
    })
    .catch(next)
}
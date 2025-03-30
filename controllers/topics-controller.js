const model = require("../model/models");

const getTopics = (req, res, next) => {
  model
    .fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  let { slug, description } = req.body;
  model
    .insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic: topic });
    })
    .catch(next);
};

module.exports = { getTopics, postTopic };

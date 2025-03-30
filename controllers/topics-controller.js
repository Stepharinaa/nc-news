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
  console.log(slug, "<--- THIS IS SLUG");
  console.log(description, "<--- THIS IS DESCRIPTION");
  model
    .insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic: topic });
    })
    .catch(next);
};

module.exports = { getTopics, postTopic };

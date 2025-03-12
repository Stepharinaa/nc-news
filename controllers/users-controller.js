const model = require("../model/models");

const getUsers = (req, res, next) => {
  model.fetchUsers().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

module.exports = { getUsers };

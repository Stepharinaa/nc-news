const model = require("../model/models");

const getUsers = (req, res, next) => {
  model.fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

module.exports = { getUsers };

const model = require("../model/models");

const getUsers = (req, res, next) => {
  model.fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  model.fetchUserByUsername(username).then((user) => {
    res.status(200).send({ user: user });
  });
};

module.exports = { getUsers, getUserByUsername };

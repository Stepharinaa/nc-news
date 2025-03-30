const model = require("../model/models");

const getUsers = (req, res) => {
  model.fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  model
    .fetchUserByUsername(username)
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "username not found..." });
      }
      res.status(200).send({ user: user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };

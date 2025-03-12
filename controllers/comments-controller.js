const model = require("../model/models");

const deleteCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  model
    .removeCommentbyCommentID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { deleteCommentByCommentID };

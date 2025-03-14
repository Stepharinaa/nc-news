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

const patchVotesByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  model.updateVotesByCommentID(comment_id).then((comment) => {
    res.staus(200).send({ comment: comment });
  });
};

module.exports = { deleteCommentByCommentID, patchVotesByCommentId };

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

const patchVotesByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return res.status(400).send({ msg: "bad request: missing 'inc_votes'" });
  }
  model
    .updateVotesByCommentID(comment_id, inc_votes)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({ msg: "comment does not exist" });
      }
      res.status(200).send({ comment: comment });
    })
    .catch(next);
};

module.exports = { deleteCommentByCommentID, patchVotesByCommentID };

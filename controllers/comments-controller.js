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
  console.log(comment_id, "<-- THIS IS COMMENT_ID");
  const { inc_votes } = req.body;
  console.log(inc_votes, "<-- THIS IS VOTES");
  model
    .updateVotesByCommentID(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment: comment });
    })
    .catch(next);
};

module.exports = { deleteCommentByCommentID, patchVotesByCommentID };

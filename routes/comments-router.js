const express = require("express");
const {
  deleteCommentByCommentID,
  patchVotesByCommentID,
} = require("../controllers/comments-controller");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentByCommentID);
commentsRouter.patch("/:comment_id", patchVotesByCommentID);

module.exports = commentsRouter;

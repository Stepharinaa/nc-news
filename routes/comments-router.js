const express = require("express");
const {
  deleteCommentByCommentID,
} = require("../controllers/comments-controller");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentByCommentID);

module.exports = commentsRouter;
